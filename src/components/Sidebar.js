import React, { useState } from 'react';

function Sidebar({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat, isOpen, onToggle, onOpenApiSettings }) {
  const [hoveredChatId, setHoveredChatId] = useState(null);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={onNewChat}>
          <i className="fas fa-plus"></i>
          <span>New chat</span>
        </button>
        <button className="sidebar-close" onClick={onToggle}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
            onMouseEnter={() => setHoveredChatId(chat.id)}
            onMouseLeave={() => setHoveredChatId(null)}
          >
            <i className="fas fa-message"></i>
            <span className="chat-title">{chat.title}</span>
            {hoveredChatId === chat.id && chats.length > 1 && (
              <button
                className="delete-chat-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="api-settings-button-sidebar" onClick={onOpenApiSettings}>
          <i className="fas fa-key"></i>
          <span>API Settings</span>
        </button>
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <span className="user-name">User</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
