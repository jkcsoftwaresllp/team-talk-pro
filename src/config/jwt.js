import { config } from 'dotenv';

config();

export const secret = process.env.JWT_SECRET;
export const expiresIn = '1h';