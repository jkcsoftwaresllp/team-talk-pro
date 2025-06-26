import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from '../config/database.js';  // Fixed import

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing database tables...');
        
        // Get pool
        const dbPool = pool();
        
        if (!dbPool) {
            throw new Error('Database pool not initialized');
        }
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await dbPool.execute(statement);
            }
        }
        
        console.log('✅ Database tables created successfully');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    }
};
