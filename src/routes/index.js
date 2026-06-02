const { Router } = require('express');
const usersController = require('./users/');
const noticiasDiariasController = require('./noticias_diarias/');
const noticiasController = require('./noticias/');
const mapaController = require('./mapa/');

const routes = Router();

routes.use('/users', usersController);

// rotas separadas
routes.use('/api/noticias', noticiasController);
routes.use('/api/noticias-diarias', noticiasDiariasController);
routes.use('/api/mapa', mapaController);

module.exports = routes;