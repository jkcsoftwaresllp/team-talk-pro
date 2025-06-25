import { db } from '../../config/db.js';

export const toggleReaction = async ({ messageId, userId, emoji }) => {
  // Check if this reaction already exists
  const [existing] = await db.query(
    'SELECT * FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?',
    [messageId, userId, emoji]
  );

  if (existing.length > 0) {
    // Reaction exists — remove it
    await db.query(
      'DELETE FROM message_reactions WHERE id = ?',
      [existing[0].id]
    );
    return { removed: true };
  } else {
    // Add new reaction
    await db.query(
      'INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)',
      [messageId, userId, emoji]
    );
    return { added: true };
  }
};
