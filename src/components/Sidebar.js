import React, { useState } from 'react';

function Sidebar({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat, isOpen, onToggle, onOpenApiSettings, currentView, onViewChange }) {
  const [hoveredChatId, setHoveredChatId] = useState(null);

  const navItems = [
    { id: 'chat', icon: 'comments', label: 'Chat' },
    { id: 'dashboard', icon: 'chart-line', label: 'Wellness Dashboard' },
    { id: 'journal', icon: 'book', label: 'Journal' },
    { id: 'breathing', icon: 'wind', label: 'Breathing Exercises' },
    { id: 'consultants', icon: 'user-doctor', label: 'Find Consultant' }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-button" onClick={onNewChat}>
          <i className="fas fa-plus"></i>
          <span>New conversation</span>
        </button>
        <button className="sidebar-close" onClick={onToggle}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="sidebar-nav">
        <h3>Navigation</h3>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <i className={`fas fa-${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="chat-list">
        <h3>Recent Conversations</h3>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
            onMouseEnter={() => setHoveredChatId(chat.id)}
            onMouseLeave={() => setHoveredChatId(null)}
          >
            <i className="fas fa-message"></i>
            <div className="chat-info">
              <span className="chat-title">{chat.title}</span>
              {chat.mood && (
                <span className="chat-mood">{chat.mood.emoji}</span>
              )}
            </div>
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
