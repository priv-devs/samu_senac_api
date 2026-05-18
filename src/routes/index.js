const { Router } = require('express');
const usersController = require('./users/');
const tipoUsuarioController = require('./tipoUsuario/');
const noticiasController = require('./noticias/');

const routes = Router();


routes.use('/users', usersController);
routes.use('/tipo-usuario', tipoUsuarioController);
routes.use('/api/noticias', noticiasController);

module.exports = routes;
