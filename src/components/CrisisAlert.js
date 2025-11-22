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
    <div className="modal-overlay crisis-overlay">
      <div className="modal-content crisis-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crisis-header">
          <i className="fas fa-heart-pulse"></i>
          <h2>You're Not Alone - Help is Available</h2>
        </div>

        <div className="modal-body">
          <div className="crisis-message">
            <p>
              I'm concerned about what you've shared. Your life matters, and there are people who want to help you through this difficult time.
            </p>
            <p>
              Please reach out to one of these professional crisis resources right now:
            </p>
          </div>

          <div className="crisis-resources">
            {resources.map((resource, index) => (
              <div key={index} className="crisis-resource">
                <i className={`fas fa-${resource.icon}`}></i>
                <div className="resource-info">
                  <h3>{resource.name}</h3>
                  <p className="resource-phone">{resource.phone}</p>
                  <p className="resource-desc">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="crisis-footer">
            <p>
              <strong>Remember:</strong> These feelings are temporary. Professional help can make a difference. You deserve support and care.
            </p>
            <button className="btn-primary crisis-btn" onClick={onClose}>
              <i className="fas fa-check"></i>
              I understand - Continue conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrisisAlert;
