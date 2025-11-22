import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ApiKeyModal from './components/ApiKeyModal';

function App() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: 'New Chat',
      messages: []
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showApiModal, setShowApiModal] = useState(!localStorage.getItem('gemini_api_key'));
  const messagesEndRef = useRef(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);

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
              title: chat.messages.length === 0 ? message.slice(0, 30) + (message.length > 30 ? '...' : '') : chat.title
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

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: conversationHistory
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
      title: 'New Chat',
      messages: []
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
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

  return (
    <div className="app">
      {showApiModal && (
        <ApiKeyModal 
          onSave={handleSaveApiKey} 
          onClose={() => setShowApiModal(false)}
          currentKey={apiKey}
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
      />
      
      <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <div className="chat-header">
          {!sidebarOpen && (
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
          )}
          <h1>ChatGPT Clone</h1>
          <button className="api-settings-button" onClick={handleOpenApiSettings} title="API Settings">
            <i className="fas fa-key"></i>
          </button>
        </div>

        <div className="chat-container">
          {currentChat?.messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <i className="fas fa-comments"></i>
                <h2>How can I help you today?</h2>
                <div className="example-prompts">
                  <div className="example-prompt" onClick={() => handleSendMessage("Explain quantum computing in simple terms")}>
                    <i className="fas fa-lightbulb"></i>
                    <span>Explain quantum computing in simple terms</span>
                  </div>
                  <div className="example-prompt" onClick={() => handleSendMessage("Help me write a creative story")}>
                    <i className="fas fa-pen"></i>
                    <span>Help me write a creative story</span>
                  </div>
                  <div className="example-prompt" onClick={() => handleSendMessage("What can you do?")}>
                    <i className="fas fa-question-circle"></i>
                    <span>What can you do?</span>
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
      </div>
    </div>
  );
}

export default App;
