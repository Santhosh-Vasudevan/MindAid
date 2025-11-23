import React from 'react';

function CrisisAlert({ message, onClose }) {
  const resources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 crisis support',
      icon: 'phone'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Text-based crisis support',
      icon: 'comment'
    },
    {
      name: 'International Association for Suicide Prevention',
      phone: 'Visit iasp.info',
      description: 'Global crisis resources',
      icon: 'globe'
    },
    {
      name: 'Emergency Services',
      phone: '911 or local emergency',
      description: 'Immediate emergency help',
      icon: 'exclamation-triangle'
    }
  ];

  return (
    <div className="crisis-overlay" onClick={onClose}>
      <div className="crisis-modal-clean" onClick={(e) => e.stopPropagation()}>
        <div className="crisis-scroll-container">
          <div className="crisis-header-clean">
            <i className="fas fa-heart-pulse"></i>
            <h2>You're Not Alone</h2>
            <p className="crisis-subtitle">Help is available right now</p>
          </div>

          <div className="crisis-message-clean">
            <p>
              I'm concerned about what you've shared. Your life matters, and there are people who want to help you through this difficult time.
            </p>
          </div>

          <div className="crisis-resources-clean">
            <h3>Professional Crisis Resources</h3>
            {resources.map((resource, index) => (
              <div key={index} className="crisis-resource-card">
                <div className="resource-icon">
                  <i className={`fas fa-${resource.icon}`}></i>
                </div>
                <div className="resource-details">
                  <h4>{resource.name}</h4>
                  <div className="resource-contact">{resource.phone}</div>
                  <p className="resource-description">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="crisis-reminder">
            <p>
              <strong>Remember:</strong> These feelings are temporary. Professional help can make a difference. You deserve support and care.
            </p>
          </div>

          <button className="crisis-continue-btn" onClick={onClose}>
            <i className="fas fa-check-circle"></i>
            I understand - Continue conversation
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrisisAlert;
