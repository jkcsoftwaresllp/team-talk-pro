import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  let connection;
  
  try {
    console.log('🚀 Setting up database...');
    
   
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true 
    });

    console.log(' Connected to MySQL server');

   
    const schema = fs.readFileSync('./db/schema.sql', 'utf8');
    const statements = schema.split(';').filter(stmt => stmt.trim());

  
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement.trim());
      }
    }
    console.log('✅ Database schema created');

    await connection.changeUser({ database: process.env.DB_NAME });
    const seedData = fs.readFileSync('./db/seed.sql', 'utf8');
    const seedStatements = seedData.split(';').filter(stmt => stmt.trim());

    for (const statement of seedStatements) {
      if (statement.trim() && !statement.trim().startsWith('USE')) {
        await connection.execute(statement.trim());
      }
    }
    console.log(' Seed data inserted');

    console.log(' Database setup completed successfully!');
    console.log(' Sample users created:');
    console.log('   - admin@teamtalk.com (password: password123)');
    console.log('   - john@example.com (password: password123)');
    console.log('   - jane@example.com (password: password123)');
    
  } catch (error) {
    console.error(' Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

setupDatabase();
