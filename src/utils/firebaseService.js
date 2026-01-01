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
      console.error('[FirebaseService] Connection error:', error.message);
      return false;
    }
  }

  // Initialize with user ID (can be device ID or authenticated user ID)
  initialize(userId) {
    if (!userId) {
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_id', deviceId);
      }
      this.userId = deviceId;
    } else {
      this.userId = userId;
    }
    this.isInitialized = true;
    // ...existing code...
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
      console.error('[FirebaseService] Error creating user document:', error.message);
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
      await setDoc(chatRef, chatData, { merge: true });
      // ...existing code...
      return true;
    } catch (error) {
      console.error('[FirebaseService] Error saving chat:', error.message);
      throw error;
    }
  }

  // Get all chats for user
  async getChats() {
    try {
      const userId = this.getUserId();
      const chatsRef = collection(db, 'users', userId, 'chats');
      const querySnapshot = await getDocs(chatsRef);
      const chats = [];
      if (querySnapshot.empty) {
        return [];
      }
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const chat = {
          id: doc.id.includes('_') ? doc.id : parseInt(doc.id),
          title: data.title || 'Untitled Chat',
          messages: data.messages || [],
          mood: data.mood || null,
          timestamp: data.timestamp || new Date().toISOString()
        };
        chats.push(chat);
      });
      chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      // ...existing code...
      return chats;
    } catch (error) {
      console.error('[FirebaseService] Error loading chats:', error.message);
      return [];
    }
  }

  // Delete chat
  async deleteChat(chatId) {
    try {
      const userId = this.getUserId();
      const chatRef = doc(db, 'users', userId, 'chats', chatId.toString());
      await deleteDoc(chatRef);
      // ...existing code...
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
      
      const querySnapshot = await getDocs(moodRef);
      const moodHistory = [];
      querySnapshot.forEach((doc) => {
        moodHistory.push({
          id: doc.id,
          ...doc.data()
        });
      });
      moodHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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
      
      const encryptedContent = await encryptionService.encryptJournalEntry(journalEntry);
      const entryRef = doc(db, 'users', userId, 'journalEntries', journalEntry.id.toString());
      await setDoc(entryRef, {
        id: journalEntry.id,
        encrypted: encryptedContent,
        timestamp: journalEntry.timestamp,
        createdAt: new Date().toISOString()
      });
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
      
      const querySnapshot = await getDocs(entriesRef);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push(doc.data());
      });
      // Decrypt entries
      const decryptedEntries = [];
      for (const entry of entries) {
        try {
          const decrypted = await encryptionService.decryptJournalEntry(entry.encrypted);
          decryptedEntries.push(decrypted);
        } catch (error) {
          decryptedEntries.push({
            id: entry.id,
            content: '[Encrypted - Unable to decrypt. Encryption key may have been cleared from browser storage.]',
            timestamp: entry.timestamp,
            encrypted: true,
            error: true
          });
        }
      }
      decryptedEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
      
      // ...existing code...
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
        return docSnap.data();
      } else {
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
      // Migrate chats
      const localChats = JSON.parse(localStorage.getItem('chats') || '[]');
      if (localChats.length > 0) {
        for (const chat of localChats) {
          await this.saveChat(chat);
        }
      }
      // Migrate mood history
      const localMoodHistory = JSON.parse(localStorage.getItem('mood_history') || '[]');
      if (localMoodHistory.length > 0) {
        for (const mood of localMoodHistory) {
          await this.saveMoodEntry(mood);
        }
      }
      // Migrate encrypted journal entries
      const localJournalEntries = JSON.parse(localStorage.getItem('journal_entries_encrypted') || '[]');
      if (localJournalEntries.length > 0) {
        for (const entry of localJournalEntries) {
          try {
            const decrypted = await encryptionService.decryptJournalEntry(entry.encrypted);
            await this.saveJournalEntry(decrypted);
          } catch (error) {
            // Only log error
            console.error('Failed to migrate journal entry:', error);
          }
        }
      }
      // Save API key
      const apiKey = localStorage.getItem('gemini_api_key');
      if (apiKey) {
        await this.saveSettings({ apiKey });
      }
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
