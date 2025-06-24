import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.localhost,
  user: process.env.root,
  password: process.env.MySql,
  database: process.env.teamtalk_pro,
});

export default db;
