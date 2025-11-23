// Encryption utilities for secure storage of sensitive data
// Using Web Crypto API for AES-GCM encryption

class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
  }

  // Generate a random encryption key
  async generateKey() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  }

  // Convert key to exportable format for storage
  async exportKey(key) {
    const exported = await window.crypto.subtle.exportKey('jwk', key);
    return JSON.stringify(exported);
  }

  // Import key from stored format
  async importKey(keyData) {
    const keyObject = JSON.parse(keyData);
    const key = await window.crypto.subtle.importKey(
      'jwk',
      keyObject,
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  }

  // Derive key from password using PBKDF2
  async deriveKeyFromPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Generate random salt
  generateSalt() {
    return window.crypto.getRandomValues(new Uint8Array(16));
  }

  // Encrypt data
  async encrypt(data, key) {
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
    
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      encoder.encode(data)
    );

    // Return IV + encrypted data as base64
    const encryptedArray = new Uint8Array(encryptedData);
    const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
    combinedArray.set(iv, 0);
    combinedArray.set(encryptedArray, iv.length);

    return this.arrayBufferToBase64(combinedArray);
  }

  // Decrypt data
  async decrypt(encryptedDataB64, key) {
    const combinedArray = this.base64ToArrayBuffer(encryptedDataB64);
    const iv = combinedArray.slice(0, 12);
    const data = combinedArray.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }

  // Helper: Convert ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Helper: Convert Base64 to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Generate or retrieve encryption key for journal
  async getOrCreateJournalKey(password = null) {
    const storedKeyData = localStorage.getItem('journal_encryption_key');
    const storedSalt = localStorage.getItem('journal_key_salt');

    if (password) {
      // Use password-based encryption
      let salt;
      if (storedSalt) {
        salt = this.base64ToArrayBuffer(storedSalt);
      } else {
        salt = this.generateSalt();
        localStorage.setItem('journal_key_salt', this.arrayBufferToBase64(salt));
      }
      return await this.deriveKeyFromPassword(password, salt);
    } else {
      // Use device-based encryption (less secure but more convenient)
      if (storedKeyData) {
        return await this.importKey(storedKeyData);
      } else {
        const newKey = await this.generateKey();
        const exportedKey = await this.exportKey(newKey);
        localStorage.setItem('journal_encryption_key', exportedKey);
        return newKey;
      }
    }
  }

  // Encrypt journal entry
  async encryptJournalEntry(entry, password = null) {
    const key = await this.getOrCreateJournalKey(password);
    const dataToEncrypt = JSON.stringify(entry);
    return await this.encrypt(dataToEncrypt, key);
  }

  // Decrypt journal entry
  async decryptJournalEntry(encryptedEntry, password = null) {
    try {
      const key = await this.getOrCreateJournalKey(password);
      const decryptedData = await this.decrypt(encryptedEntry, key);
      return JSON.parse(decryptedData);
    } catch (error) {
      // Silently fail - encryption keys may have been cleared from browser storage
      // This is expected behavior when localStorage is cleared
      throw new Error('Failed to decrypt journal entry. Password may be incorrect.');
    }
  }

  // Check if password is set
  isPasswordProtected() {
    return localStorage.getItem('journal_key_salt') !== null;
  }

  // Reset encryption (clears all encrypted data)
  resetEncryption() {
    localStorage.removeItem('journal_encryption_key');
    localStorage.removeItem('journal_key_salt');
    localStorage.removeItem('journal_password_enabled');
  }
}

export default new EncryptionService();
