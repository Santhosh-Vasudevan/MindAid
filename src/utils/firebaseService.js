// Firebase Database Service for MindAid
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import encryptionService from './encryption';

class FirebaseService {
  constructor() {
    this.userId = null;
    this.isInitialized = false;
  }

  // Check Firebase connection
  async checkConnection() {
    try {
      const testRef = doc(db, '_connection_test', 'test');
      await getDoc(testRef);
      return true;
    } catch (error) {
      console.error('❌ Firebase connection error:', error);
      return false;
    }
  }

  // Initialize with user ID (can be device ID or authenticated user ID)
  initialize(userId) {
    if (!userId) {
      // Generate a unique device ID if no user ID provided
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_id', deviceId);
        console.log('🆔 Generated new device ID:', deviceId);
      }
      this.userId = deviceId;
    } else {
      this.userId = userId;
    }
    this.isInitialized = true;
    console.log('🔥 FirebaseService initialized with userId:', this.userId);
    
    // Create user document if it doesn't exist (so subcollections show in console)
    this.ensureUserDocument();
    
    return this.userId;
  }

  // Ensure user document exists
  async ensureUserDocument() {
    try {
      const userRef = doc(db, 'users', this.userId);
      await setDoc(userRef, {
        deviceId: this.userId,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }

  getUserId() {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.userId;
  }

  // ============ CHATS ============

  // Save chat to Firebase
  async saveChat(chat) {
    try {
      const userId = this.getUserId();
      const chatRef = doc(db, 'users', userId, 'chats', chat.id.toString());
      
      const chatData = {
        id: chat.id,
        title: chat.title,
        messages: chat.messages || [],
        mood: chat.mood || null,
        timestamp: chat.timestamp || new Date().toISOString()
      };
      
      console.log('💾 Saving chat to Firebase:', {
        chatId: chat.id,
        title: chatData.title,
        messageCount: chatData.messages.length,
        path: `users/${userId}/chats/${chat.id}`
      });
      
      await setDoc(chatRef, chatData, { merge: true });
      
      console.log('✅ Chat saved successfully to Firebase:', chat.id, 'with', chatData.messages.length, 'messages');
      return true;
    } catch (error) {
      console.error('❌ Error saving chat to Firebase:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }

  // Get all chats for user
  async getChats() {
    try {
      const userId = this.getUserId();
      const chatsRef = collection(db, 'users', userId, 'chats');
      
      console.log('📥 Fetching chats for userId:', userId);
      console.log('📍 Collection path: users/' + userId + '/chats');
      
      const querySnapshot = await getDocs(chatsRef);
      const chats = [];
      
      console.log('📊 Found', querySnapshot.size, 'chat documents in Firestore');
      
      if (querySnapshot.empty) {
        console.log('⚠️ No chat documents found in Firestore');
        return [];
      }
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Raw document data:', doc.id, data);
        
        const chat = {
          id: doc.id.includes('_') ? doc.id : parseInt(doc.id),
          title: data.title || 'Untitled Chat',
          messages: data.messages || [],
          mood: data.mood || null,
          timestamp: data.timestamp || new Date().toISOString()
        };
        
        chats.push(chat);
        console.log('✅ Loaded chat:', chat.id, 'Title:', chat.title, 'Messages:', chat.messages.length);
      });
      
      // Sort by timestamp descending (newest first)
      chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      console.log('📦 Successfully loaded', chats.length, 'chats from Firebase');
      console.log('📋 Chat IDs:', chats.map(c => c.id));
      return chats;
    } catch (error) {
      console.error('❌ Error loading chats from Firebase:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      return [];
    }
  }

  // Delete chat
  async deleteChat(chatId) {
    try {
      const userId = this.getUserId();
      const chatRef = doc(db, 'users', userId, 'chats', chatId.toString());
      await deleteDoc(chatRef);
      console.log('Chat deleted from Firebase:', chatId);
      return true;
    } catch (error) {
      console.error('Error deleting chat from Firebase:', error);
      throw error;
    }
  }

  // Listen to chat changes in real-time
  subscribeToChats(callback) {
    const userId = this.getUserId();
    const chatsRef = collection(db, 'users', userId, 'chats');
    const q = query(chatsRef, orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const chats = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chats.push({
          ...data,
          id: parseInt(doc.id)
        });
      });
      callback(chats);
    });
  }

  // ============ MOOD HISTORY ============

  // Get today's mood entry (if exists)
  async getTodaysMoodEntry() {
    try {
      const userId = this.getUserId();
      const moodRef = collection(db, 'users', userId, 'moodHistory');
      const querySnapshot = await getDocs(moodRef);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let todaysEntry = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const entryDate = new Date(data.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        
        if (entryDate.getTime() === today.getTime()) {
          todaysEntry = { id: doc.id, ...data };
        }
      });
      
      return todaysEntry;
    } catch (error) {
      console.error('Error getting today\'s mood entry:', error);
      return null;
    }
  }

  // Update existing mood entry
  async updateMoodEntry(docId, moodEntry) {
    try {
      const userId = this.getUserId();
      const moodDocRef = doc(db, 'users', userId, 'moodHistory', docId);
      
      await setDoc(moodDocRef, {
        ...moodEntry,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error updating mood entry:', error);
      throw error;
    }
  }

  // Save mood entry
  async saveMoodEntry(moodEntry) {
    try {
      const userId = this.getUserId();
      const moodRef = collection(db, 'users', userId, 'moodHistory');
      
      const docRef = await addDoc(moodRef, {
        ...moodEntry,
        createdAt: new Date().toISOString()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving mood entry to Firebase:', error);
      throw error;
    }
  }

  // Get mood history
  async getMoodHistory() {
    try {
      const userId = this.getUserId();
      const moodRef = collection(db, 'users', userId, 'moodHistory');
      
      console.log('📥 Fetching mood history for userId:', userId);
      
      const querySnapshot = await getDocs(moodRef);
      const moodHistory = [];
      
      console.log('📊 Found', querySnapshot.size, 'mood documents');
      
      querySnapshot.forEach((doc) => {
        moodHistory.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by timestamp ascending
      moodHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      console.log('📦 Loaded', moodHistory.length, 'mood entries from Firebase');
      return moodHistory;
    } catch (error) {
      console.error('❌ Error loading mood history from Firebase:', error);
      return [];
    }
  }

  // ============ JOURNAL ENTRIES ============

  // Save encrypted journal entry
  async saveJournalEntry(journalEntry) {
    try {
      const userId = this.getUserId();
      
      console.log('📓 Saving journal to Firebase:', {
        userId,
        path: `users/${userId}/journalEntries/${journalEntry.id}`,
        entryId: journalEntry.id,
        contentLength: journalEntry.content?.length || 0
      });
      
      // Encrypt the entry before saving
      const encryptedContent = await encryptionService.encryptJournalEntry(journalEntry);
      console.log('🔐 Journal entry encrypted successfully');
      
      const entryRef = doc(db, 'users', userId, 'journalEntries', journalEntry.id.toString());
      
      await setDoc(entryRef, {
        id: journalEntry.id,
        encrypted: encryptedContent,
        timestamp: journalEntry.timestamp,
        createdAt: new Date().toISOString()
      });
      
      console.log('✅ Encrypted journal entry saved to Firebase:', journalEntry.id);
      return true;
    } catch (error) {
      console.error('❌ Error saving journal entry to Firebase:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }

  // Get all journal entries (encrypted)
  async getJournalEntries() {
    try {
      const userId = this.getUserId();
      const entriesRef = collection(db, 'users', userId, 'journalEntries');
      
      console.log('📥 Fetching journal entries for userId:', userId);
      
      const querySnapshot = await getDocs(entriesRef);
      const entries = [];
      
      console.log('📊 Found', querySnapshot.size, 'journal documents');
      
      querySnapshot.forEach((doc) => {
        entries.push(doc.data());
      });
      
      console.log('🔐 Loaded', entries.length, 'encrypted journal entries from Firebase');
      
      // Decrypt entries
      const decryptedEntries = [];
      for (const entry of entries) {
        try {
          const decrypted = await encryptionService.decryptJournalEntry(entry.encrypted);
          decryptedEntries.push(decrypted);
          console.log('✅ Decrypted journal entry:', decrypted.id);
        } catch (error) {
          // Silently handle decryption errors (encryption keys may have been cleared)
          // Just mark the entry as unable to decrypt without logging the full error
          console.warn('⚠️ Could not decrypt journal entry:', entry.id, '- encryption key may be missing');
          decryptedEntries.push({
            id: entry.id,
            content: '[Encrypted - Unable to decrypt. Encryption key may have been cleared from browser storage.]',
            timestamp: entry.timestamp,
            encrypted: true,
            error: true
          });
        }
      }
      
      // Sort by timestamp descending (newest first)
      decryptedEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      console.log('📦 Loaded and decrypted', decryptedEntries.length, 'journal entries');
      return decryptedEntries;
    } catch (error) {
      console.error('❌ Error loading journal entries from Firebase:', error);
      return [];
    }
  }

  // ============ USER SETTINGS ============

  // Save user settings
  async saveSettings(settings) {
    try {
      const userId = this.getUserId();
      const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
      
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('Settings saved to Firebase');
      return true;
    } catch (error) {
      console.error('Error saving settings to Firebase:', error);
      throw error;
    }
  }

  // Get user settings
  async getSettings() {
    try {
      const userId = this.getUserId();
      const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
      
      const docSnap = await getDoc(settingsRef);
      
      if (docSnap.exists()) {
        console.log('Settings loaded from Firebase');
        return docSnap.data();
      } else {
        console.log('No settings found in Firebase');
        return null;
      }
    } catch (error) {
      console.error('Error loading settings from Firebase:', error);
      return null;
    }
  }

  // ============ MIGRATION FROM LOCALSTORAGE ============

  // Migrate existing localStorage data to Firebase
  async migrateLocalStorageToFirebase() {
    try {
      console.log('Starting migration from localStorage to Firebase...');
      
      // Migrate chats
      const localChats = JSON.parse(localStorage.getItem('chats') || '[]');
      if (localChats.length > 0) {
        console.log(`Migrating ${localChats.length} chats...`);
        for (const chat of localChats) {
          await this.saveChat(chat);
        }
      }
      
      // Migrate mood history
      const localMoodHistory = JSON.parse(localStorage.getItem('mood_history') || '[]');
      if (localMoodHistory.length > 0) {
        console.log(`Migrating ${localMoodHistory.length} mood entries...`);
        for (const mood of localMoodHistory) {
          await this.saveMoodEntry(mood);
        }
      }
      
      // Migrate encrypted journal entries
      const localJournalEntries = JSON.parse(localStorage.getItem('journal_entries_encrypted') || '[]');
      if (localJournalEntries.length > 0) {
        console.log(`Migrating ${localJournalEntries.length} journal entries...`);
        for (const entry of localJournalEntries) {
          // Decrypt first
          try {
            const decrypted = await encryptionService.decryptJournalEntry(entry.encrypted);
            await this.saveJournalEntry(decrypted);
          } catch (error) {
            console.error('Failed to migrate journal entry:', error);
          }
        }
      }
      
      // Save API key
      const apiKey = localStorage.getItem('gemini_api_key');
      if (apiKey) {
        await this.saveSettings({ apiKey });
      }
      
      console.log('Migration completed successfully!');
      
      // Mark migration as complete
      localStorage.setItem('migrated_to_firebase', 'true');
      
      return true;
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  // Check if migration is needed
  needsMigration() {
    return localStorage.getItem('migrated_to_firebase') !== 'true';
  }

  // ============ SYNC STATUS ============
}

export default new FirebaseService();
