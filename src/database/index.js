require('dotenv').config();
const { Pool } = require('pg');

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
      CREATE TABLE IF NOT EXISTS noticias (
        id_noticia SERIAL PRIMARY KEY,
        titulo VARCHAR(150),
        resumo TEXT NOT NULL,
        imagem TEXT,
        banner TEXT,
        conteudo TEXT,
        link TEXT,
        categoria VARCHAR(20) NOT NULL DEFAULT 'diaria',
        data DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS course_page (
        id_course_page SERIAL PRIMARY KEY,
        payload JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id_course SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        thumbnail TEXT,
        status VARCHAR(30) DEFAULT 'Rascunho',
        duration VARCHAR(50),
        level VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS categorias (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(50));

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
