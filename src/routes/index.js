const { Router } = require('express');
const usersController = require('./users/');
const noticiasDiariasController = require('./noticias_diarias/');
const noticiasController = require('./noticias/');
const mapaController = require('./mapa/');
const coursePageRoutes = require('./coursePage/');
const coursesRoutes = require('./courses/');

const routes = Router();

routes.use('/users', usersController);

// rotas separadas
routes.use('/api/noticias', noticiasController);
routes.use('/api/noticias-diarias', noticiasDiariasController);
routes.use('/api/mapa', mapaController);
routes.use('/api/course-page', coursePageRoutes);
routes.use('/api/courses', coursesRoutes);

module.exports = routes;