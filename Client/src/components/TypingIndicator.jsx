// src/components/TypingIndicator.jsx

const TypingIndicator = ({ isTyping, user }) => {
  return isTyping ? (
    <div style={{ fontStyle: 'italic', color: 'gray' }}>
      {user} is typing...
    </div>
  ) : null;
};

export default TypingIndicator;
