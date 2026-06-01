/*
  This file provides a small compatibility layer so existing code that
  calls `pool.query(sql, params)` (pg-style) keeps working when using
  either Postgres (pg.Pool) or a local database via Prisma (sqlite).

  Behavior:
  - If DB provider is postgres, use pg.Pool (and run the existing initDB()).
  - If DB provider is sqlite (local), use Prisma client and expose an
    object with a `query(sql, params)` method that returns { rows } or
    { rowCount } similar to node-postgres.
*/

const { provider } = require('../config/database');

if (provider === 'postgres' || provider === 'postgresql') {
  require('dotenv').config();
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // run the previous initialization only for Postgres (keeps existing behavior)
  async function initDB() {
    try {
      const client = await pool.connect();

      await client.query(`
        CREATE TABLE IF NOT EXISTS tipo_usuario (
          id_tipo SERIAL PRIMARY KEY,
          tipo VARCHAR(15) UNIQUE
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id_user SERIAL PRIMARY KEY,
          nome_usuario VARCHAR(100) NOT NULL,
          senha TEXT NOT NULL,
          tipo INT,
          status VARCHAR(15),
          FOREIGN KEY (tipo) REFERENCES tipo_usuario(id_tipo)
            ON UPDATE CASCADE
            ON DELETE RESTRICT
        );
      `);

      await client.query(`
        INSERT INTO tipo_usuario (tipo)
        VALUES ('cliente'), ('admin')
        ON CONFLICT (tipo) DO NOTHING;
      `);

      // eslint-disable-next-line no-console
      console.log('Banco inicializado com sucesso.');

      client.release();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Erro ao inicializar banco:', err);
    }
  }

  initDB();
  module.exports = pool;

} else if (provider === 'sqlite') {
  // Use Prisma for sqlite and provide a pg-compatible `pool.query` wrapper.
  const prisma = require('../prisma/client');

  // basic escaping for literals (strings)
  function escapeLiteral(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number' || typeof val === 'bigint') return String(val);
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (val instanceof Date) return `'${val.toISOString()}'`;
    // strings: escape single quotes
    return `'${String(val).replace(/'/g, "''")}'`;
  }

  async function runQuery(sql, params = []) {
    // Replace $1, $2 ... with escaped literals (unsafe but acceptable here
    // because we're emulating the original behavior and not exposing this
    // to external interpolation).
    let built = sql;
    if (Array.isArray(params) && params.length) {
      params.forEach((p, i) => {
        const re = new RegExp(`\\$${i + 1}\\b`, 'g');
        built = built.replace(re, escapeLiteral(p));
      });
    }

    const isSelect = /^\s*select/i.test(sql);
    const hasReturning = /returning/i.test(sql);

    if (isSelect || hasReturning) {
      const rows = await prisma.$queryRawUnsafe(built);
      return { rows };
    }

    // Non-select statements without RETURNING -> execute and return rowCount
    const rowCount = await prisma.$executeRawUnsafe(built);
    return { rowCount };
  }

  module.exports = {
    query: runQuery,
  };

} else {
  throw new Error(`Unsupported DB provider: ${provider}`);
}
