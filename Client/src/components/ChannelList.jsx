// src/components/ChannelList.jsx

import PropTypes from 'prop-types';
import { useState } from 'react';

const ChannelList = ({ setSelectedChatId }) => {
  const [activeChannel, setActiveChannel] = useState('general');

  const handleSelect = (chatId) => {
    setActiveChannel(chatId);
    if (setSelectedChatId) {
      setSelectedChatId(chatId);
    }
  };

  const channels = ['general', 'random', 'team'];

  return (
    <div className="channel-list">
      <h2 className="channel-title">Channels</h2>
      <ul className="channel-items">
        {channels.map((channel) => (
          <li
            key={channel}
            onClick={() => handleSelect(channel)}
            className={`channel-item ${activeChannel === channel ? 'active' : ''}`}
          >
            #{channel.charAt(0).toUpperCase() + channel.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

ChannelList.propTypes = {
  setSelectedChatId: PropTypes.func.isRequired,
};

export default ChannelList;
