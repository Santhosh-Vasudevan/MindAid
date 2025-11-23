import React, { useState } from 'react';
import encryptionService from '../utils/encryption';

function EncryptionInfo({ onClose }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleResetEncryption = () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete all encryption keys and you will LOSE ACCESS to all encrypted journal entries.\n\nThis action cannot be undone. Are you absolutely sure?'
    );
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'Final confirmation: This will delete all encrypted journal data. Continue?'
      );
      
      if (doubleConfirmed) {
        encryptionService.resetEncryption();
        localStorage.removeItem('journal_entries_encrypted');
        alert('✓ Encryption reset complete. Please refresh the page.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content encryption-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-shield-halved"></i>
            Encryption & Security
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="encryption-info-section">
            <div className="security-status">
              <div className="status-icon">
                <i className="fas fa-lock"></i>
              </div>
              <div className="status-text">
                <h3>🔒 Your Journal is Protected</h3>
                <p>All entries are encrypted using military-grade AES-256 encryption</p>
              </div>
            </div>

            <div className="security-features">
              <h4>Security Features:</h4>
              <ul>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <strong>AES-256-GCM Encryption:</strong> Industry-standard encryption algorithm
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <strong>Device-Based Keys:</strong> Encryption keys stored securely on your device
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <strong>No Server Upload:</strong> All data stays on your device, never transmitted
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <strong>Browser Security:</strong> Uses Web Crypto API for cryptographic operations
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <strong>Automatic Migration:</strong> Old entries automatically encrypted on first load
                </li>
              </ul>
            </div>

            <div className="security-note">
              <i className="fas fa-info-circle"></i>
              <div>
                <strong>Important:</strong> Your encryption keys are stored locally. 
                If you clear browser data or use a different device, you won't be able 
                to access encrypted entries. Keep backups if needed.
              </div>
            </div>

            {showDetails && (
              <div className="technical-details">
                <h4>Technical Details:</h4>
                <ul>
                  <li><strong>Algorithm:</strong> AES-GCM (Galois/Counter Mode)</li>
                  <li><strong>Key Size:</strong> 256 bits</li>
                  <li><strong>IV Size:</strong> 96 bits (randomly generated per entry)</li>
                  <li><strong>Key Derivation:</strong> PBKDF2 with SHA-256 (100,000 iterations)</li>
                  <li><strong>Storage:</strong> Encrypted entries stored in localStorage</li>
                </ul>
              </div>
            )}

            <button 
              className="details-toggle-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '▲ Hide' : '▼ Show'} Technical Details
            </button>
          </div>

          <div className="danger-zone">
            <h4>⚠️ Danger Zone</h4>
            <p>
              Resetting encryption will permanently delete all encryption keys and 
              make all encrypted journal entries unrecoverable.
            </p>
            <button 
              className="reset-encryption-btn"
              onClick={handleResetEncryption}
            >
              <i className="fas fa-exclamation-triangle"></i>
              Reset Encryption Keys
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            <i className="fas fa-check"></i>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default EncryptionInfo;
