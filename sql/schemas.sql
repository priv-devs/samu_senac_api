CREATE TABLE IF NOT EXISTS tipo_usuario (
    id_tipo INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_usuario TEXT NOT NULL,
    senha TEXT,
    tipo INTEGER,
    status TEXT,
    FOREIGN KEY (tipo) REFERENCES tipo_usuario(id_tipo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

INSERT OR IGNORE INTO tipo_usuario (tipo) VALUES ('cliente');
INSERT OR IGNORE INTO tipo_usuario (tipo) VALUES ('admin');

CREATE TABLE IF NOT EXISTS noticias (
    id_noticia INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    resumo TEXT NOT NULL,
    imagem TEXT,
    banner TEXT,
    conteudo TEXT,
    link TEXT,
    categoria TEXT NOT NULL DEFAULT 'diaria',
    data DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS course_page (
    id_course_page INTEGER PRIMARY KEY AUTOINCREMENT,
    payload TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id_course INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    status TEXT DEFAULT 'Rascunho',
    duration TEXT,
    level TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sobre_trajetoria (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(100) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sobre_equipe (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(100) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sobre_cards_equipe (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL
);
