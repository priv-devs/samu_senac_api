# SAMU Senac API

API em Node.js com Express e PostgreSQL (Prisma) para cadastro de usuários e notícias.

## Resumo das mudanças recentes
- O campo `tipo` agora é uma coluna na tabela `usuarios` (string). Não existe mais uma tabela separada `tipoUsuario`.
- Endpoints de tipo de usuário foram movidos para o mesmo namespace dos usuários: `/users/tipo-usuario` (apenas leitura — mutações devem ser feitas via criação/atualização de usuários).
- Prisma é usado como ORM com o client gerado em `src/generated/prisma`.

## Tecnologias
- Node.js
- Express
- PostgreSQL
- Prisma
- dotenv

## Como rodar (desenvolvimento)
1. Instale dependências:

```powershell
npm install
```

2. Crie `.env` com as variáveis necessárias (exemplo):

```env
PORT=7777
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
```

3. Gere/atualize o client Prisma (após editar `prisma/schema.prisma`):

```powershell
npx prisma generate
```

4. (Opcional) Rode migrações para aplicar o schema no seu banco:

```powershell
npx prisma migrate dev --name init
```

5. Seed (opcional):

```powershell
node prisma/seed.js
```

6. Inicie a API:

```powershell
npm run dev
# ou
npm start
```

A API, por padrão, ficará disponível em `http://localhost:7777` (ou na porta do seu `.env`).

## Estrutura principal

```text
src/
  app/
  controllers/
  models/
  routes/
  prisma/client.js (Prisma client wrapper)
  generated/prisma (Prisma generated client)
```

Fluxo: routes -> controllers -> models -> prisma client

---

## Endpoints principais

Base: `/users`

- GET /users
  - Lista usuários (retorna: `id`, `nome_usuario`, `tipo`, `status`)
- GET /users/:id
  - Retorna um usuário público por id (omite senha e campos sensíveis)
- POST /users
  - Cria usuário. Body exemplo:
    ```json
    {
      "nome_usuario": "joao123",
      "senha": "minhasenha",
      "tipo": "admin",
      "status": "ativo",
      "cpf_cnpj": "00000000000",
      "cep": "00000-000",
      "telefone1": "(11) 99999-9999",
      "email": "joao@example.com"
    }
    ```
  - `tipo` é uma string (ex: "admin", "cliente").
  - `status` padrão é `ativo` quando não informado.
- PUT /users/:id
  - Atualiza todo o recurso (envie os campos desejados). Returns user public view.
- PATCH /users/:id
  - Atualização parcial (envie campos parciais). Returns user public view.
- DELETE /users/:id
  - Remove usuário (204 on success).

### Tipo de usuário (leitura)
- GET /users/tipo-usuario
  - Lista os valores distintos de `tipo` existentes na tabela `usuarios`.
  - Resposta exemplo:
    ```json
    [ { "tipo": "admin" }, { "tipo": "cliente" } ]
    ```
- GET /users/tipo-usuario/:tipo
  - Retorna 404 se não existir.

Nota: mutações (POST/PUT/PATCH/DELETE) em `/users/tipo-usuario` retornam 405 — para adicionar/alterar tipos, atualize/crie usuários com o campo `tipo`.

---

## Notícias
Base: `/api/noticias`

- GET /api/noticias/principal
  - Retorna a notícia principal com forma reduzida (id, titulo, resumo, imagem, data).
- GET /api/noticias/secundarias?limite=4&pagina=1
  - Lista noticias secundarias (resumo, imagem, link).
- GET /api/noticias?pagina=1&por_pagina=10
  - Lista noticias diarias/paginadas.
- POST /api/noticias
  - Cria uma noticia (diaria) — campos: titulo, resumo, banner, conteudo, categoria (opcional, default 'diaria').
- PUT/PATCH/DELETE endpoints seguem o padrão REST descrito no código.

---

## Mapa
- GET /api/mapa
  - Retorna o registro do mapa: `{ embed_url, endereco, latitude, longitude }`.
- PATCH /api/mapa
  - Atualiza (ou cria) os dados do mapa. Body ex:
    ```json
    { "embed_url": "...", "endereco": "Rua X, 123", "latitude": -23.5, "longitude": -46.6 }
    ```

---

## Prisma / Banco
- O schema Prisma atual está em `prisma/schema.prisma`.
- O client Prisma gerado fica em `src/generated/prisma` (gerado por `npx prisma generate`).
- Seed atualizado em `prisma/seed.js` para criar exemplos de usuários com `tipo`.

---

## Observações e recomendações
- Senhas (`senha`) atualmente são armazenadas como texto no banco. Recomendo fortemente adicionar hashing (bcrypt) antes de persistir. Posso adicionar isso se quiser.
- Se prefere um lookup table para `tipo` (normalização), podemos reintroduzir `tipo_usuario` como tabela e migrar valores — hoje o projeto usa uma coluna simples por sua preferência anterior.
- Posso atualizar o README com exemplos curl/postman reais, ou adicionar testes de integração para validar os endpoints.

---

## Validações e erros
Exemplos de retorno de erro:

```json
{ "message": "id de usuario invalido" }
```

---

Se quiser que eu atualize mais trechos (ex.: exemplos de request/response com formatos exatos, ou incluir instruções do Docker/CI), diga o que prefere e eu ajusto.

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
