import React, { useState, useRef, useEffect } from 'react';

function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows="1"
            className="chat-input"
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!input.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
      <div className="input-footer">
        OpenMind provides emotional support but is not a substitute for professional mental health care. If you're in crisis, please contact emergency services or a crisis hotline.
      </div>
    </div>
  );
}

export default ChatInput;
