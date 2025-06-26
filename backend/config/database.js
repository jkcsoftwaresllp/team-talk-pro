import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const createPool = (withDatabase = true) => {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
    
    if (withDatabase) {
        config.database = process.env.DB_NAME || 'teamtalk_pro';
    }
    
    return mysql.createPool(config);
};

const poolWithoutDB = createPool(false);
let dbPool;


export const createDatabaseIfNotExists = async () => {
    try {
        const dbName = process.env.DB_NAME || 'teamtalk_pro';
        await poolWithoutDB.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' created/verified`);
        
       
        dbPool = createPool(true);
        
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        throw error;
    }
};


export const testConnection = async () => {
    try {
       
        await createDatabaseIfNotExists();
        const connection = await dbPool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};

export const pool = () => dbPool;
