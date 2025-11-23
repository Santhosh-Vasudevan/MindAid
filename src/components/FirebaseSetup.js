import React, { useState, useEffect } from 'react';
import firebaseService from '../utils/firebaseService';

function FirebaseSetup({ onComplete, onSkip }) {
  const [step, setStep] = useState('check'); // 'check', 'configure', 'migrate', 'complete'
  const [isConfigured, setIsConfigured] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkFirebaseConfig();
  }, []);

  const checkFirebaseConfig = () => {
    // Check if Firebase is configured
    const configured = localStorage.getItem('firebase_configured') === 'true';
    setIsConfigured(configured);
    
    if (configured) {
      // Check if migration is needed
      if (firebaseService.needsMigration()) {
        setStep('migrate');
      } else {
        setStep('complete');
      }
    } else {
      setStep('configure');
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationStatus('Starting migration...');
    setError('');
    
    try {
      setMigrationStatus('Migrating chats...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMigrationStatus('Migrating mood history...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMigrationStatus('Migrating journal entries...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await firebaseService.migrateLocalStorageToFirebase();
      
      setMigrationStatus('Migration completed!');
      setStep('complete');
      
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err) {
      console.error('Migration error:', err);
      setError('Migration failed: ' + err.message);
      setMigrationStatus('');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSkipMigration = () => {
    localStorage.setItem('migrated_to_firebase', 'true');
    setStep('complete');
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const markAsConfigured = () => {
    localStorage.setItem('firebase_configured', 'true');
    setIsConfigured(true);
    checkFirebaseConfig();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content firebase-setup-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-cloud"></i>
            Firebase Cloud Storage Setup
          </h2>
        </div>

        <div className="modal-body">
          {step === 'configure' && (
            <div className="firebase-configure">
              <div className="setup-icon">
                <i className="fas fa-database"></i>
              </div>
              <h3>Configure Firebase</h3>
              <p>To use Firebase cloud storage, you need to set up your Firebase project.</p>
              
              <div className="setup-steps">
                <h4>Setup Instructions:</h4>
                <ol>
                  <li>
                    <strong>Create Firebase Project:</strong>
                    <br />
                    Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a> and create a new project
                  </li>
                  <li>
                    <strong>Enable Firestore Database:</strong>
                    <br />
                    In your Firebase project, go to Build → Firestore Database → Create Database
                  </li>
                  <li>
                    <strong>Get Configuration:</strong>
                    <br />
                    Project Settings → Your apps → Web app → Copy config object
                  </li>
                  <li>
                    <strong>Update Configuration:</strong>
                    <br />
                    Open <code>src/config/firebase.js</code> and paste your Firebase config
                  </li>
                  <li>
                    <strong>Set Security Rules:</strong>
                    <br />
                    In Firestore, set rules to allow read/write for your users
                  </li>
                </ol>
              </div>

              <div className="firebase-note">
                <i className="fas fa-info-circle"></i>
                <p>
                  <strong>Note:</strong> Firebase offers a free tier (Spark plan) with 1GB storage 
                  and 50K daily reads/writes, perfect for personal use.
                </p>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={onSkip}>
                  Skip for Now
                </button>
                <button className="btn-primary" onClick={markAsConfigured}>
                  <i className="fas fa-check"></i>
                  I've Configured Firebase
                </button>
              </div>
            </div>
          )}

          {step === 'migrate' && (
            <div className="firebase-migrate">
              <div className="setup-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>Migrate Existing Data</h3>
              <p>
                You have existing data in local storage. Would you like to migrate it to Firebase?
              </p>
              
              <div className="migration-info">
                <div className="info-item">
                  <i className="fas fa-comments"></i>
                  <span>Chat conversations</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-smile"></i>
                  <span>Mood history</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-book"></i>
                  <span>Journal entries (encrypted)</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings & preferences</span>
                </div>
              </div>

              {migrationStatus && (
                <div className="migration-status">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>{migrationStatus}</span>
                </div>
              )}

              {error && (
                <div className="migration-error">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={handleSkipMigration}
                  disabled={isMigrating}
                >
                  Skip Migration
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleMigrate}
                  disabled={isMigrating}
                >
                  <i className={`fas ${isMigrating ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
                  {isMigrating ? 'Migrating...' : 'Migrate to Firebase'}
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="firebase-complete">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>All Set!</h3>
              <p>Firebase cloud storage is ready to use.</p>
              <p className="success-message">
                Your data will now be synced to the cloud and available across devices.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirebaseSetup;
