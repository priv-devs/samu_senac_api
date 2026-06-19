const { Router } = require('express');
const usersController = require('./users/');
const tipoUsuarioController = require('./tipoUsuario/');
const noticiasDiariasController = require('./noticias_diarias/');
const noticiasController = require('./noticias/');
const coursePageController = require('./course_page/');
const coursesController = require('./courses/');

const routes = Router();

routes.use('/users', usersController);
routes.use('/tipo-usuario', tipoUsuarioController);
routes.use('/api/noticias', noticiasController);
routes.use('/api/noticias-diarias', noticiasDiariasController);
routes.use('/api/course-page', coursePageController);
routes.use('/api/courses', coursesController);

module.exports = routes;
