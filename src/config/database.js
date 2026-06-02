const dotenv = require('dotenv');
dotenv.config();

const provider = 'postgres';

if (!process.env.DATABASE_URL) {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || 'postgres';
  const pass = process.env.DB_PASS || 'postgres';
  const name = process.env.DB_NAME || 'samu_senac';
  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(pass);
  process.env.DATABASE_URL = `postgresql://${encodedUser}:${encodedPass}@${host}:${port}/${name}?schema=public`;
}

module.exports = {
  provider,
  databaseUrl: process.env.DATABASE_URL,
};
