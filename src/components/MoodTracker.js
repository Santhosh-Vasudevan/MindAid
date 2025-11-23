import React from 'react';

const moods = [
  { emoji: '😊', label: 'Great', color: '#10b981', value: 5 },
  { emoji: '🙂', label: 'Good', color: '#3b82f6', value: 4 },
  { emoji: '😐', label: 'Okay', color: '#f59e0b', value: 3 },
  { emoji: '😔', label: 'Low', color: '#f97316', value: 2 },
  { emoji: '😢', label: 'Struggling', color: '#ef4444', value: 1 }
];

function MoodTracker({ onSelectMood, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mood-tracker-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="mood-tracker-header">
          <div className="mood-tracker-icon">💭</div>
          <h2>How are you feeling?</h2>
          <p>Take a moment to check in with yourself</p>
        </div>

        <div className="mood-options-grid">
          {moods.map((mood) => (
            <button
              key={mood.value}
              className="mood-option-card"
              onClick={() => onSelectMood(mood)}
            >
              <div className="mood-emoji-large">{mood.emoji}</div>
              <div className="mood-label-text" style={{ color: mood.color }}>{mood.label}</div>
            </button>
          ))}
        </div>

        <div className="mood-footer-tip">
          <span className="tip-icon">💡</span>
          <span>Daily tracking helps identify patterns in your wellbeing</span>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;
