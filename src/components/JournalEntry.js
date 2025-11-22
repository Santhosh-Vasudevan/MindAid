import React, { useState } from 'react';

function JournalEntry({ entries, onSave }) {
  const [currentEntry, setCurrentEntry] = useState('');
  const [activeTab, setActiveTab] = useState('write');

  const prompts = [
    "What am I grateful for today?",
    "What emotions did I experience today?",
    "What made me smile today?",
    "What do I need to let go of?"
  ];

  const handleSave = () => {
    if (currentEntry.trim()) {
      onSave(currentEntry);
      setCurrentEntry('');
      alert('Journal entry saved! 💚');
    }
  };

  const usePrompt = (prompt) => {
    setCurrentEntry(prompt + '\n\n');
  };

  return (
    <div className="journal-simple">
      <div className="journal-header-simple">
        <h1>Private Journal</h1>
        <p>Your thoughts, stored privately on your device</p>
      </div>

      <div className="journal-tabs-simple">
        <button 
          className={activeTab === 'write' ? 'active' : ''}
          onClick={() => setActiveTab('write')}
        >
          ✍️ Write
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          📚 History ({entries.length})
        </button>
      </div>

      {activeTab === 'write' ? (
        <div className="journal-write">
          <div className="prompts-simple">
            <p className="prompts-label">Need inspiration?</p>
            <div className="prompts-row">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  className="prompt-simple"
                  onClick={() => usePrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Write your thoughts here...

This is your private space. Everything you write stays on your device."
            className="journal-textarea-simple"
          />

          <button 
            className="save-btn-simple" 
            onClick={handleSave} 
            disabled={!currentEntry.trim()}
          >
            💾 Save Entry
          </button>
        </div>
      ) : (
        <div className="journal-history-simple">
          {entries.length === 0 ? (
            <div className="empty-state-simple">
              <i className="fas fa-book" style={{fontSize: '64px', color: '#667eea', marginBottom: '20px'}}></i>
              <h2>No Entries Yet</h2>
              <p>Start writing to capture your thoughts</p>
            </div>
          ) : (
            <div className="entries-simple">
              {[...entries].reverse().map((entry) => (
                <div key={entry.id} className="entry-simple">
                  <div className="entry-top">
                    <span className="entry-date-simple">
                      📅 {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    {entry.mood && <span className="entry-mood-simple">{entry.mood.emoji}</span>}
                  </div>
                  <p className="entry-text-simple">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JournalEntry;
