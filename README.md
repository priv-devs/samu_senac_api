# SAMU Senac API

API em Node.js com Express e PostgreSQL para cadastro de usuarios e tipos de usuario.

## Tecnologias

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- morgan

## Como rodar

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` na raiz do projeto:

```env
PORT=7777
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
```

Crie as tabelas no banco usando o arquivo:

```text
src/database/schema.sql
```

Inicie a API:

```bash
npm start
```

Para desenvolvimento:

```bash
npm run dev
```

Por padrao, a API roda em:

```text
http://localhost:7777
```

## Estrutura principal

```text
src/
  app/
  controllers/
  database/
  models/
  routes/
```

O fluxo usado no projeto e:

```text
routes -> controllers -> models -> database
```

## Tipo de usuario

Base da rota:

```text
/tipo-usuario
```

### Listar tipos

```http
GET /tipo-usuario
```

Resposta:

```json
[
  {
    "id_tipo": 1,
    "tipo": "admin"
  }
]
```

### Buscar tipo por ID

```http
GET /tipo-usuario/1
```

Resposta:

```json
{
  "id_tipo": 1,
  "tipo": "admin"
}
```

### Cadastrar tipo

```http
POST /tipo-usuario
```

Body:

```json
{
  "tipo": "admin"
}
```

Resposta:

```json
{
  "id_tipo": 1,
  "tipo": "admin"
}
```

### Atualizar tipo

```http
PUT /tipo-usuario/1
```

Body:

```json
{
  "tipo": "medico"
}
```

### Atualizar parcialmente

```http
PATCH /tipo-usuario/1
```

Body:

```json
{
  "tipo": "enfermeiro"
}
```

### Remover tipo

```http
DELETE /tipo-usuario/1
```

Quando remove com sucesso, retorna `204 No Content`.

Se o tipo estiver sendo usado por algum usuario, a API retorna erro, porque existe chave estrangeira entre `usuarios.tipo` e `tipo_usuario.id_tipo`.

## Usuarios

Base da rota:

```text
/users
```

### Listar usuarios

```http
GET /users
```

Resposta:

```json
[
  {
    "id_user": 1,
    "nome_usuario": "Guilherme",
    "tipo": 1,
    "tipo_usuario": "admin",
    "status": "ativo"
  }
]
```

### Buscar usuario por ID

```http
GET /users/1
```

Resposta:

```json
{
  "id_user": 1,
  "nome_usuario": "Guilherme",
  "tipo": 1,
  "tipo_usuario": "admin",
  "status": "ativo"
}
```

### Cadastrar usuario

```http
POST /users
```

Body:

```json
{
  "nome_usuario": "Guilherme",
  "senha": "123456",
  "tipo": 1,
  "status": "ativo"
}
```

O campo `tipo` pode receber o ID do tipo de usuario. O `status` e opcional; se nao for enviado, entra como `ativo`.

### Atualizar usuario

```http
PUT /users/1
```

Body:

```json
{
  "nome_usuario": "Guilherme Souza",
  "senha": "123456",
  "tipo": 1,
  "status": "ativo"
}
```

### Atualizar parcialmente

```http
PATCH /users/1
```

Body:

```json
{
  "status": "inativo"
}
```

### Remover usuario

```http
DELETE /users/1
```

Quando remove com sucesso, retorna `204 No Content`.

## Noticias

Base da rota:

```text
/api/noticias
```

### Buscar noticia principal

```http
GET /api/noticias/principal
```

### Criar noticia principal

```http
POST /api/noticias/principal
```

Body:

```json
{
  "titulo": "Titulo da noticia",
  "resumo": "Resumo sobre a noticia",
  "imagem": "url_do_banner",
  "conteudo": "Conteudo completo"
}
```

### Listar noticias secundarias

```http
GET /api/noticias/secundarias?limite=4&pagina=1
```

### Criar noticia secundaria

```http
POST /api/noticias/secundarias
```

Body:

```json
{
  "resumo": "Resumo sobre a noticia",
  "imagem": "url_thumbnail",
  "link": "/noticia/1"
}
```

### Atualizar noticia secundaria

```http
PUT /api/noticias/secundarias/1
```

### Remover noticia secundaria

```http
DELETE /api/noticias/secundarias/1
```

### Listar noticias diarias

```http
GET /api/noticias?pagina=1&por_pagina=10
```

### Criar noticia diaria

```http
POST /api/noticias
```

Body:

```json
{
  "titulo": "Titulo da noticia",
  "resumo": "Resumo da noticia",
  "banner": "url_do_banner",
  "conteudo": "Conteudo completo em HTML",
  "categoria": "diaria"
}
```

### Atualizar noticia diaria

```http
PUT /api/noticias/1
```

### Atualizar parcialmente

```http
PATCH /api/noticias/1
```

Body:

```json
{
  "resumo": "Atualizar apenas o resumo"
}
```

### Remover noticia

```http
DELETE /api/noticias/1
```

Quando remove com sucesso, retorna `204 No Content`.

## Validacoes

Alguns exemplos de erro:

```json
{
  "message": "id de usuario invalido"
}
```

```json
{
  "message": "Dados invalidos",
  "erros": [
    "nome_usuario e obrigatorio",
    "senha e obrigatoria",
    "tipo e obrigatorio"
  ]
}
```

```json
{
  "message": "tipo informado nao existe"
}
```

## Banco de dados

Tabelas usadas:

```sql
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
```
