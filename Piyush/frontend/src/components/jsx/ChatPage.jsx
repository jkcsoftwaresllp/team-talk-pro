import React, { useState } from 'react';
import styles from '../css/ChatPage.module.css';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, time: new Date().toLocaleTimeString() }]);
      setInputMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>Chat Room</h2>
      </div>
      <div className={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.message}>
            {msg.text} <span className={styles.time}>{msg.time}</span>
          </div>
        ))}
      </div>
      <form className={styles.chatInput} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatPage;