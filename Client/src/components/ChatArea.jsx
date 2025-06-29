// src/components/ChatArea.jsx

import { useEffect, useState } from 'react';
import MessageItem from './MessageItem';
import FileUpload from './FileUpload';
import TypingIndicator from './TypingIndicator';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

const ChatArea = ({ user, selectedChatId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  // Fetch messages and join room on chat switch
  useEffect(() => {
    if (!selectedChatId || !user?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${selectedChatId}`, {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    // Join room and notify user online
    socket.emit('joinRoom', selectedChatId);
    socket.emit('userOnline', user._id);
    fetchMessages();

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [selectedChatId, user]);

  // Listen for real-time events
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleTyping = ({ userId }) => {
      setTypingUser(userId);
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setTypingUser('');
      setIsTyping(false);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    socket.emit('typing', { chatId: selectedChatId, userId: user._id });

    setTimeout(() => {
      socket.emit('stopTyping', { chatId: selectedChatId, userId: user._id });
    }, 1000);
  };

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const messageData = {
      chat_id: selectedChatId,
      sender_id: user._id,
      sender_name: user.username,
      content: messageInput,
    };

    socket.emit('sendMessage', messageData);
    setMessages((prev) => [...prev, messageData]); // Optimistic UI
    setMessageInput('');
  };

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <MessageItem key={index} sender={msg.sender_name || 'User'} content={msg.content} />
        ))}
        {isTyping && <TypingIndicator isTyping={true} user={typingUser} />}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          className="chat-input"
          value={messageInput}
          onChange={handleInputChange}
        />
        <button type="submit" className="chat-send-btn">Send</button>
      </form>

      <FileUpload />
    </div>
  );
};

export default ChatArea;
