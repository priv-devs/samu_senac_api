const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const provider = (process.env.DB_PROVIDER || process.env.DATABASE_PROVIDER || 'sqlite').toLowerCase();

if (!process.env.DATABASE_URL) {
  if (provider === 'sqlite') {
    const dbFile = path.join(process.cwd(), 'prisma', 'dev.db');
    process.env.DATABASE_URL = `file:${dbFile}`;
  } else if (provider === 'postgres' || provider === 'postgresql') {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const user = process.env.DB_USER || 'postgres';
    const pass = process.env.DB_PASS || 'postgres';
    const name = process.env.DB_NAME || 'samu_senac';
    const encodedUser = encodeURIComponent(user);
    const encodedPass = encodeURIComponent(pass);
    process.env.DATABASE_URL = `postgresql://${encodedUser}:${encodedPass}@${host}:${port}/${name}?schema=public`;
  } else {
    throw new Error(`Unknown DB_PROVIDER: ${provider}`);
  }
}

module.exports = {
  provider,
  databaseUrl: process.env.DATABASE_URL,
};
