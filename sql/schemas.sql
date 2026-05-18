CREATE TABLE tipo_usuario(
                             id_tipo SERIAL PRIMARY KEY,
                             tipo VARCHAR(15)
);

CREATE TABLE usuarios(
                         id_user SERIAL PRIMARY KEY,
                         nome_usuario VARCHAR(100),
                         senha TEXT,
                         tipo int,
                         status VARCHAR(15),
                         FOREIGN KEY (tipo) REFERENCES tipo_usuario(id_tipo)
                             ON UPDATE CASCADE
                             ON DELETE RESTRICT
);

INSERT INTO tipo_usuario (tipo) VALUES ('user');
INSERT INTO tipo_usuario (tipo) VALUES ('admin');
INSERT INTO tipo_usuario (tipo) VALUES ('root');

CREATE TABLE noticias (
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
