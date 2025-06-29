// src/components/MessageItem.jsx

import PropTypes from 'prop-types';

const MessageItem = ({ sender, content }) => {
  return (
    <div className="message-item">
      <strong className="message-sender">{sender}:</strong>{' '}
      <span className="message-content">{content}</span>
    </div>
  );
};

MessageItem.propTypes = {
  sender: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default MessageItem;
