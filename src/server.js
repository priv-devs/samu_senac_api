require('dotenv').config();
const app = require('./app');
const routes = require('./routes');

const PORT = process.env.PORT || 8080;

app.use(routes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
