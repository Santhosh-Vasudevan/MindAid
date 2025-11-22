import React, { useState } from 'react';

function ApiKeyModal({ onSave, onClose, currentKey }) {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) return;
    
    setIsTesting(true);
    setTestStatus('Testing...');
    
    try {
      console.log('Testing API key...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Hi' }]
            }]
          }),
        }
      );
      
      console.log('Test response status:', response.status);

      const data = await response.json();
      console.log('Test response data:', data);
      
      if (response.ok) {
        setTestStatus('✅ API key is valid!');
      } else {
        console.error('Test failed:', data);
        setTestStatus(`❌ ${data.error?.message || JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestStatus(`❌ Error: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-key"></i>
            API Key Settings
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="api-info">
            <h3>Get Your Free Gemini API Key</h3>
            <ol>
              <li>
                Visit{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Google AI Studio
                </a>
              </li>
              <li>Sign in with your Google account</li>
              <li>Click "Create API Key" or "Get API Key"</li>
              <li>Select your project (e.g., gen-lang-client-0725382294)</li>
              <li>Copy the API key and paste it below</li>
            </ol>
            <p className="api-note">
              <i className="fas fa-info-circle"></i>
              Your API key is stored locally in your browser and never sent to any server except Google's AI API. Free tier has generous limits for personal use.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="apiKey">Gemini API Key</label>
              <div className="api-key-input-wrapper">
                <input
                  type={showKey ? 'text' : 'password'}
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="api-key-input"
                  autoFocus
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowKey(!showKey)}
                >
                  <i className={`fas fa-eye${showKey ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            {testStatus && (
              <div className={`test-status ${testStatus.includes('✅') ? 'success' : 'error'}`}>
                {testStatus}
              </div>
            )}

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-test" 
                onClick={testApiKey}
                disabled={!apiKey.trim() || isTesting}
              >
                <i className="fas fa-vial"></i>
                {isTesting ? 'Testing...' : 'Test API Key'}
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!apiKey.trim()}>
                <i className="fas fa-save"></i>
                Save API Key
              </button>
            </div>
          </form>

          <div className="alternative-providers">
            <h4>Alternative: Use OpenAI API</h4>
            <p>
              To use OpenAI instead, modify the API endpoint in <code>App.js</code> to:
            </p>
            <code className="code-block">
              https://api.openai.com/v1/chat/completions
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
