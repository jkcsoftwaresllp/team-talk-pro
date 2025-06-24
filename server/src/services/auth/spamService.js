import db from '../../configs/db.js';

// Report spam
export const reportSpam = async ({ message_id, reported_by, reason }) => {
  const [result] = await db.query(
    'INSERT INTO spam_reports (message_id, reported_by, reason) VALUES (?, ?, ?)',
    [message_id, reported_by, reason]
  );
  return { id: result.insertId };
};

// Get all spam reports
export const getAllSpamReports = async () => {
  const [reports] = await db.query(
    `SELECT sr.id, sr.reason, sr.created_at, u.username AS reporter, m.content, m.file_url
     FROM spam_reports sr
     JOIN users u ON sr.reported_by = u.id
     JOIN messages m ON sr.message_id = m.id
     ORDER BY sr.created_at DESC`
  );
  return reports;
};

// Delete a spam report by ID
export const deleteSpamReport = async (id) => {
  const [result] = await db.query(
    'DELETE FROM spam_reports WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};
