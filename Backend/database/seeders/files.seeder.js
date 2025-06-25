import { db } from '../../config/db.js';

export const seedFiles = async () => {
  const files = [
    [1, 'report.pdf', '/uploads/report.pdf', 'application/pdf', 123456],
    [2, 'image.png', '/uploads/image.png', 'image/png', 654321]
  ];

  await db.query('DELETE FROM files');
  await db.query('ALTER TABLE files AUTO_INCREMENT = 1');
  await db.query(
    'INSERT INTO files (message_id, file_name, file_path, file_type, file_size) VALUES ?',
    [files]
  );

  console.log('✅ Seeded files');
};
