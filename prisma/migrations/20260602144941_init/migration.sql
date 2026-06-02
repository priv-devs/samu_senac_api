-- CreateTable
CREATE TABLE "usuarios" (
    "id_user" SERIAL NOT NULL,
    "nome_usuario" VARCHAR(100),
    "cpf_cnpj" VARCHAR(25),
    "cep" VARCHAR(12),
    "telefone1" VARCHAR(25),
    "email" VARCHAR(100),
    "senha" TEXT,
    "tipo" VARCHAR(50),
    "status" VARCHAR(15),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id_noticia" SERIAL NOT NULL,
    "titulo" VARCHAR(150),
    "resumo" TEXT NOT NULL,
    "imagem" TEXT,
    "banner" TEXT,
    "conteudo" TEXT,
    "link" TEXT,
    "categoria" VARCHAR(20) NOT NULL DEFAULT 'diaria',
    "data" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id_noticia")
);

-- CreateTable
CREATE TABLE "mapa" (
    "id" SERIAL NOT NULL,
    "embed_url" TEXT,
    "endereco" VARCHAR(200),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "mapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_page" (
    "id_course_page" SERIAL NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_page_pkey" PRIMARY KEY ("id_course_page")
);

-- CreateTable
CREATE TABLE "courses" (
    "id_course" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "status" VARCHAR(30) DEFAULT 'Rascunho',
    "duration" VARCHAR(50),
    "level" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id_course")
);
