CREATE TABLE IF NOT EXISTS tipo_usuario (
    id_tipo SERIAL PRIMARY KEY,
    tipo VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_user SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(100),
    senha TEXT,
    tipo INT,
    status VARCHAR(15),
    FOREIGN KEY (tipo) REFERENCES tipo_usuario(id_tipo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

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

CREATE TABLE IF NOT EXISTS course_page (
    id_course_page SERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

INSERT INTO sobre_trajetoria (tag, titulo, descricao)
VALUES (
    'Nossa trajetória',
    'Breve histórico',
    'O SAMU de Dourados atua há anos no atendimento à população de Dourados e região, integrando redes de saúde e atendendo casos clínicos, traumáticos e pediátricos.'
);

INSERT INTO sobre_equipe (tag, titulo, descricao)
VALUES (
    'Equipe',
    'Profissionais em campo',
    'Equipes compostas por condutor socorrista, técnico de enfermagem e enfermeiro, treinadas para atendimento de urgência e reanimação.'
);

INSERT INTO sobre_cards_equipe (titulo, descricao) VALUES
    ('Coordenação', 'Responsável pela gestão e integração com a rede de saúde local.'),
    ('Enfermagem',  'Enfermeiros especializados em emergência e suporte avançado.'),
    ('Técnicos',    'Técnicos em enfermagem e condutores socorristas capacitados.'),
    ('Comunicação', 'Central de regulação médica e recepção das chamadas 192.');
