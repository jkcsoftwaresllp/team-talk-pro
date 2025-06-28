import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/ChatPage.module.css';
import axios from 'axios';
import socket from '../helper/socket.js';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const { receiverId } = useParams();
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const sender_id = currentUser?.id;
  const receiver_id = parseInt(receiverId);

  // Fetch receiver info
  useEffect(() => {
    const fetchReceiverInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/userlist/list');
        const receiver = response.data.find(user => user.id === receiver_id);
        setReceiverInfo(receiver);
      } catch (err) {
        console.error('Error fetching receiver info:', err);
      }
    };

    if (receiver_id) {
      fetchReceiverInfo();
    }
  }, [receiver_id]);

  // Fetch existing messages
  useEffect(() => {
    if (!sender_id || !receiver_id) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/message/history/${sender_id}/${receiver_id}`
        );
        console.log('Fetched messages:', response.data);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [sender_id, receiver_id]);

  // Socket connection and message handling
  useEffect(() => {
    if (!sender_id) return;

    // Register user with socket
    socket.emit('register', { user_id: sender_id });
    console.log('Registered user with socket:', sender_id);
    
    // Listen for incoming messages
    const handleReceiveMessage = (data) => {
      console.log('Received message via socket:', data);
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(msg => msg.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    socket.on("receive-message", handleReceiveMessage);

    socket.on("error", (error) => {
      console.error('Socket error:', error);
      alert(error.message);
    });

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('error');
    };
  }, [sender_id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && sender_id && receiver_id) {
      const newMessage = {
        sender_id,
        receiver_id,
        text: inputMessage,
      };
      
      console.log('Sending message:', newMessage);
      socket.emit('message', newMessage);
      setInputMessage('');
    }
  };

  if (!currentUser) {
    return <div>Please log in to access chat.</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h3>Chat with {receiverInfo?.username || `User ${receiver_id}`}</h3>
        <p>You are: {currentUser.username}</p>
      </div>
      
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`${styles.message} ${
                message.sender_id === sender_id ? styles.sent : styles.received
              }`}
            >
              <div className={styles.messageContent}>
                <p>{message.text}</p>
                <span className={styles.timestamp}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
