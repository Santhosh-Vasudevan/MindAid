import React from 'react';

const moods = [
  { emoji: '😊', label: 'Great', color: '#4ade80', value: 5 },
  { emoji: '🙂', label: 'Good', color: '#86efac', value: 4 },
  { emoji: '😐', label: 'Okay', color: '#fbbf24', value: 3 },
  { emoji: '😔', label: 'Low', color: '#fb923c', value: 2 },
  { emoji: '😢', label: 'Struggling', color: '#f87171', value: 1 }
];

function MoodTracker({ onSelectMood, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mood-tracker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-smile"></i>
            How are you feeling today?
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <p className="mood-description">
            Tracking your mood helps you understand patterns and triggers. Take a moment to check in with yourself.
          </p>

          <div className="mood-options">
            {moods.map((mood) => (
              <button
                key={mood.value}
                className="mood-option"
                style={{ borderColor: mood.color }}
                onClick={() => onSelectMood(mood)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>

          <div className="mood-tip">
            <i className="fas fa-lightbulb"></i>
            <p>Tip: Try to track your mood daily to identify patterns and understand what affects your wellbeing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;
