import db from '../../configs/db.js';

export const getChatVolume = async () => {
  const [rows] = await db.query(`
    SELECT 
      cc.id AS channel_id,
      cc.name AS channel_name,
      COUNT(m.id) AS message_count
    FROM chat_channels cc
    LEFT JOIN messages m ON cc.id = m.channel_id
    GROUP BY cc.id
  `);
  return rows;
};
