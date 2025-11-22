import React from 'react';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-wrapper ${isUser ? 'user-message-wrapper' : 'assistant-message-wrapper'}`}>
      <div className="message">
        <div className="message-avatar">
          {isUser ? (
            <i className="fas fa-user"></i>
          ) : (
            <i className="fas fa-robot"></i>
          )}
        </div>
        <div className="message-content">
          <div className="message-role">
            {isUser ? 'You' : 'ChatGPT'}
          </div>
          <div className="message-text">
            {message.isTyping ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              formatMessage(message.content)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMessage(content) {
  // Split by newlines and handle basic formatting
  const lines = content.split('\n');
  
  return lines.map((line, index) => {
    // Check if line is a bullet point
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      return <div key={index} className="message-bullet">{line}</div>;
    }
    // Check if line is empty
    if (line.trim() === '') {
      return <br key={index} />;
    }
    // Regular line
    return <div key={index}>{line}</div>;
  });
}

export default ChatMessage;
