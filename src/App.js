import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ApiKeyModal from './components/ApiKeyModal';
import MoodTracker from './components/MoodTracker';
import WellnessDashboard from './components/WellnessDashboard';
import JournalEntry from './components/JournalEntry';
import CrisisAlert from './components/CrisisAlert';
import BreathingExercise from './components/BreathingExercise';
import Consultants from './components/Consultants';
import FirebaseSetup from './components/FirebaseSetup';
import encryptionService from './utils/encryption';
import firebaseService from './utils/firebaseService';

function App() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'New Conversation',
      messages: [],
      mood: null,
      timestamp: new Date().toISOString()
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showApiModal, setShowApiModal] = useState(!localStorage.getItem('gemini_api_key'));
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'dashboard', 'journal', 'breathing', 'consultants'
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [crisisMessage, setCrisisMessage] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalLoading, setJournalLoading] = useState(true);
  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false);
  const [useFirebase, setUseFirebase] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const messagesEndRef = useRef(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  // Initialize Firebase and load data
  useEffect(() => {
    const initializeApp = async () => {
      const firebaseConfigured = localStorage.getItem('firebase_configured') === 'true';
      const shouldUseFirebase = localStorage.getItem('firebase_enabled') !== 'false' && firebaseConfigured;
      if (shouldUseFirebase) {
        setIsLoadingData(true);
        setUseFirebase(true);
        firebaseService.initialize();
        try {
          const connected = await firebaseService.checkConnection();
          const [fbChats, fbMoodHistory, fbJournalEntries] = await Promise.all([
            firebaseService.getChats(),
            firebaseService.getMoodHistory(),
            firebaseService.getJournalEntries()
          ]);
          if (fbChats && fbChats.length > 0) {
            setChats(fbChats);
            setCurrentChatId(fbChats[0].id);
          }
          if (fbMoodHistory.length > 0) {
            setMoodHistory(fbMoodHistory);
          }
          if (fbJournalEntries.length > 0) {
            setJournalEntries(fbJournalEntries);
          }
          setJournalLoading(false);
          setIsLoadingData(false);
        } catch (error) {
          console.error('Error loading data from Firebase:', error);
          loadFromLocalStorage();
          setIsLoadingData(false);
        }
      } else {
        loadFromLocalStorage();
        setIsLoadingData(false);
        if (!firebaseConfigured && localStorage.getItem('firebase_setup_shown') !== 'true') {
          setShowFirebaseSetup(true);
          localStorage.setItem('firebase_setup_shown', 'true');
        }
      }
    };
    
    const loadFromLocalStorage = async () => {
      // Load mood history from localStorage
      setMoodHistory(JSON.parse(localStorage.getItem('mood_history') || '[]'));
      
      // Load journal entries from localStorage
      await loadJournalEntriesFromLocalStorage();
    };
    
    const loadJournalEntriesFromLocalStorage = async () => {
      try {
        const encryptedEntries = JSON.parse(localStorage.getItem('journal_entries_encrypted') || '[]');
        
        if (encryptedEntries.length === 0) {
          // Check for legacy unencrypted entries
          const legacyEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
          if (legacyEntries.length > 0) {
            // Migrate legacy entries to encrypted format
            const encrypted = [];
            for (const entry of legacyEntries) {
              const encryptedContent = await encryptionService.encryptJournalEntry(entry);
              encrypted.push({
                id: entry.id,
                encrypted: encryptedContent,
                timestamp: entry.timestamp
              });
            }
            localStorage.setItem('journal_entries_encrypted', JSON.stringify(encrypted));
            localStorage.removeItem('journal_entries');
            setJournalEntries(legacyEntries);
          }
          setJournalLoading(false);
          return;
        }

        // Decrypt entries
        const decrypted = [];
        for (const encEntry of encryptedEntries) {
          try {
            const decryptedEntry = await encryptionService.decryptJournalEntry(encEntry.encrypted);
            decrypted.push(decryptedEntry);
          } catch (error) {
            console.error('Failed to decrypt entry:', error);
            decrypted.push({
              id: encEntry.id,
              content: '[Encrypted - Unable to decrypt]',
              timestamp: encEntry.timestamp,
              encrypted: true,
              error: true
            });
          }
        }
        setJournalEntries(decrypted);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      } finally {
        setJournalLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // Save chats to storage whenever they change
  useEffect(() => {
    if (chats.length === 0) return;
    
    // Don't save during initial mount - wait for Firebase initialization
    if (!useFirebase && localStorage.getItem('firebase_configured') === 'true') {
      return; // Skip saving while Firebase is initializing
    }
    
    const saveChats = async () => {
      console.log('💾 Saving chats... useFirebase:', useFirebase);
      if (useFirebase) {
        // Save to Firebase
        for (const chat of chats) {
          try {
            await firebaseService.saveChat(chat);
            console.log('✅ Chat saved to Firebase:', chat.id);
          } catch (error) {
            console.error('❌ Error saving chat to Firebase:', error);
          }
        }
      } else {
        // Save to localStorage as fallback
        localStorage.setItem('chats', JSON.stringify(chats));
        console.log('💾 Chats saved to localStorage');
      }
    };
    
    saveChats();
  }, [chats, useFirebase]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    // Crisis keyword detection
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die', 'die', 'kill', 'self harm',
      'hurt myself', 'no reason to live', 'better off dead', 'suicidal'
    ];
    
    const lowerMessage = message.toLowerCase();
    const hasCrisisKeyword = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasCrisisKeyword) {
      setCrisisMessage(message);
      setShowCrisisAlert(true);
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    // Update the chat with user message
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChatId
          ? { 
              ...chat, 
              messages: [...chat.messages, userMessage],
              title: chat.messages.length === 0 ? message.slice(0, 40) + (message.length > 40 ? '...' : '') : chat.title
            }
          : chat
      )
    );

    // Add typing indicator
    const typingMessageId = Date.now() + 1;
    const typingMessage = {
      id: typingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isTyping: true
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, typingMessage] }
          : chat
      )
    );

    try {
      // Get conversation history for context
      const currentChatMessages = chats.find(chat => chat.id === currentChatId)?.messages || [];
      
      // Filter out typing messages and only include valid messages
      const validMessages = currentChatMessages.filter(msg => !msg.isTyping && msg.content);
      
      // Build conversation history in Gemini format
      const conversationHistory = validMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add current user message
      conversationHistory.push({
        role: 'user',
        parts: [{ text: message }]
      });

      console.log('Sending request to Gemini API...');
      console.log('Conversation history:', conversationHistory);

      // Mental health-focused system instruction
      const systemInstruction = `You are MindAid, a compassionate mental health companion AI. Your role is to:

1. **Listen with empathy**: Validate emotions without judgment
2. **Provide support**: Offer evidence-based coping strategies from CBT, DBT, and mindfulness
3. **Encourage professional help**: Suggest therapy when needed, but never diagnose
4. **Be available 24/7**: Respond warmly at any time
5. **Respect privacy**: Never share or remember personal information beyond this conversation
6. **Use gentle language**: Be warm, non-clinical, and conversational
7. **Ask reflective questions**: Help users explore their feelings
8. **Normalize struggles**: Remind them mental health challenges are common

**Important boundaries:**
- Never diagnose mental health conditions
- Always recommend professional help for serious issues
- If someone mentions self-harm or suicide, express concern and provide crisis resources
- Don't give medical advice about medications

**Your tone:** Warm, supportive, patient, and genuinely caring - like a trusted friend who truly listens.`;

      // Call Gemini API with mental health context
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: conversationHistory,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          }),
        }
      );

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        console.error('API Error Details:', data);
        const errorMsg = data.error?.message || JSON.stringify(data);
        throw new Error(errorMsg);
      }

      if (!data.candidates || data.candidates.length === 0) {
        console.error('No candidates in response:', data);
        throw new Error('No response generated. The content may have been blocked.');
      }

      const aiResponse = data.candidates[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      console.log('AI Response:', aiResponse);

      // Replace typing indicator with actual response
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === typingMessageId 
                    ? { ...msg, content: aiResponse, isTyping: false }
                    : msg
                )
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Show detailed error message
      const errorMessage = error.message.includes('API key') 
        ? 'Invalid API key. Please check your API key in settings.'
        : error.message || 'Sorry, I encountered an error. Please check your API key and try again.';
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId
            ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === typingMessageId 
                    ? { 
                        ...msg, 
                        content: `Error: ${errorMessage}\n\nPlease try again or check the browser console for more details.`, 
                        isTyping: false 
                      }
                    : msg
                )
              }
            : chat
        )
      );
    }
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowApiModal(false);
  };

  const handleOpenApiSettings = () => {
    setShowApiModal(true);
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Conversation',
      messages: [],
      mood: null,
      timestamp: new Date().toISOString()
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
    setCurrentView('chat');
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    setCurrentView('chat');
  };

  const handleDeleteChat = (chatId) => {
    if (chats.length === 1) return; // Don't delete the last chat

    const newChats = chats.filter(chat => chat.id !== chatId);
    setChats(newChats);

    if (currentChatId === chatId) {
      setCurrentChatId(newChats[0].id);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMoodSelect = async (mood) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there's already an entry for today
    const existingTodayEntry = moodHistory.find(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    const moodEntry = {
      mood,
      timestamp: new Date().toISOString(),
      chatId: currentChatId
    };
    
    let newMoodHistory;
    if (existingTodayEntry) {
      // Update existing entry for today
      newMoodHistory = moodHistory.map(entry => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        if (entryDate.getTime() === today.getTime()) {
          return { ...entry, ...moodEntry };
        }
        return entry;
      });
    } else {
      // Add new entry
      newMoodHistory = [...moodHistory, moodEntry];
    }
    
    setMoodHistory(newMoodHistory);
    
    // Save to storage
    if (useFirebase) {
      try {
        if (existingTodayEntry && existingTodayEntry.id) {
          // Update existing entry in Firebase
          await firebaseService.updateMoodEntry(existingTodayEntry.id, moodEntry);
        } else {
          // Check Firebase for today's entry (in case of sync issues)
          const todaysFirebaseEntry = await firebaseService.getTodaysMoodEntry();
          if (todaysFirebaseEntry) {
            await firebaseService.updateMoodEntry(todaysFirebaseEntry.id, moodEntry);
          } else {
            // Create new entry
            await firebaseService.saveMoodEntry(moodEntry);
          }
        }
      } catch (error) {
        console.error('Error saving mood to Firebase:', error);
        // Fallback to localStorage
        localStorage.setItem('mood_history', JSON.stringify(newMoodHistory));
      }
    } else {
      localStorage.setItem('mood_history', JSON.stringify(newMoodHistory));
    }
    
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId ? { ...chat, mood } : chat
      )
    );
    
    setShowMoodTracker(false);
  };

  const handleJournalSave = async (entry) => {
    const journalEntry = {
      id: Date.now(),
      content: entry,
      timestamp: new Date().toISOString(),
      mood: chats.find(c => c.id === currentChatId)?.mood
    };
    
    try {
      // Save to storage
      console.log('📓 Saving journal entry... useFirebase:', useFirebase);
      if (useFirebase) {
        // Save to Firebase (encryption handled in firebaseService)
        await firebaseService.saveJournalEntry(journalEntry);
        console.log('✅ Journal entry saved to Firebase (encrypted)');
      } else {
        // Encrypt and save to localStorage
        const encryptedContent = await encryptionService.encryptJournalEntry(journalEntry);
        
        const encryptedEntries = JSON.parse(localStorage.getItem('journal_entries_encrypted') || '[]');
        encryptedEntries.push({
          id: journalEntry.id,
          encrypted: encryptedContent,
          timestamp: journalEntry.timestamp
        });
        localStorage.setItem('journal_entries_encrypted', JSON.stringify(encryptedEntries));
        console.log('💾 Journal entry saved to localStorage (encrypted)');
      }
      
      // Update state with decrypted version
      setJournalEntries(newEntries);
      
      console.log('✅ Journal entry encrypted and saved successfully');
    } catch (error) {
      console.error('Error saving encrypted journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    }
  };

  return (
    <div className="app">
      {isLoadingData && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          color: '#e0e7ff'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(139, 92, 246, 0.2)',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <div style={{
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>Loading MindAid</div>
          <div style={{
            fontSize: '14px',
            color: '#94a3b8'
          }}>Syncing your data...</div>
        </div>
      )}
      
      {showFirebaseSetup && (
        <FirebaseSetup 
          onComplete={() => {
            setShowFirebaseSetup(false);
            setUseFirebase(true);
            window.location.reload(); // Reload to sync data
          }}
          onSkip={() => {
            setShowFirebaseSetup(false);
            localStorage.setItem('firebase_enabled', 'false');
          }}
        />
      )}

      {showApiModal && (
        <ApiKeyModal 
          onSave={handleSaveApiKey} 
          onClose={() => setShowApiModal(false)}
          currentKey={apiKey}
        />
      )}

      {showMoodTracker && (
        <MoodTracker
          onSelectMood={handleMoodSelect}
          onClose={() => setShowMoodTracker(false)}
        />
      )}

      {showCrisisAlert && (
        <CrisisAlert
          message={crisisMessage}
          onClose={() => setShowCrisisAlert(false)}
        />
      )}
      
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onOpenApiSettings={handleOpenApiSettings}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <div className="chat-header">
          {!sidebarOpen && (
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
          )}
          <h1>
            <i className="fas fa-brain"></i>
            MindAid
          </h1>
          <div className="header-actions">
            <button 
              className="mood-button" 
              onClick={() => setShowMoodTracker(true)}
              title="Track your mood"
            >
              <i className="fas fa-smile"></i>
              <span>How are you feeling?</span>
            </button>
            <button className="api-settings-button" onClick={handleOpenApiSettings} title="API Settings">
              <i className="fas fa-key"></i>
            </button>
          </div>
        </div>

        {currentView === 'chat' && (
          <>
            <div className="chat-container">
              {currentChat?.messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-content">
                    <i className="fas fa-heart"></i>
                    <h2>Welcome to MindAid</h2>
                    <p>Your safe space for mental wellness. I'm here to listen, support, and help you navigate your emotions.</p>
                    <div className="example-prompts">
                      <div className="example-prompt" onClick={() => handleSendMessage("I've been feeling overwhelmed lately")}>
                        <i className="fas fa-comment-dots"></i>
                        <span>I've been feeling overwhelmed lately</span>
                      </div>
                      <div className="example-prompt" onClick={() => handleSendMessage("I'm struggling with anxiety")}>
                        <i className="fas fa-heart-pulse"></i>
                        <span>I'm struggling with anxiety</span>
                      </div>
                      <div className="example-prompt" onClick={() => handleSendMessage("Can you help me with stress management?")}>
                        <i className="fas fa-spa"></i>
                        <span>Help me with stress management</span>
                      </div>
                      <div className="example-prompt" onClick={() => handleSendMessage("I want to improve my mental health")}>
                        <i className="fas fa-seedling"></i>
                        <span>I want to improve my mental health</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="messages-container">
                  {currentChat.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
          </>
        )}

        {currentView === 'dashboard' && (
          <WellnessDashboard 
            moodHistory={moodHistory}
            journalEntries={journalEntries}
            chats={chats}
          />
        )}

        {currentView === 'journal' && (
          <JournalEntry
            entries={journalEntries}
            onSave={handleJournalSave}
          />
        )}

        {currentView === 'breathing' && (
          <BreathingExercise />
        )}

        {currentView === 'consultants' && (
          <Consultants />
        )}
      </div>
    </div>
  );
}

export default App;
