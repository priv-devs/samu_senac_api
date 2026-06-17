

require('dotenv').config();
const { Pool } = require('pg');
//process.env.DATABASE_URL
// const pool = new Pool({
//   connectionString: DATABASE_URL=" postgresql://postgres:123@localhost:5432/postgres" ,
// });

const pool = new Pool({
  connectionString: "postgresql://postgres:123@localhost:5432/postgres",
});

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

    console.log("Banco inicializado com sucesso.");

    client.release();
  } catch (err) {
    console.error("Erro ao inicializar banco:", err);
  }
}

initDB();
module.exports = pool;
