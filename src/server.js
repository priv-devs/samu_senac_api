require('dotenv').config();
const app = require('./src/app/');
const usersRoutes = require('./src/routes/');

const PORT = process.env.PORT || 8080;

app.use(usersRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log("HAHAHAHAHA")
});
