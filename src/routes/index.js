const { Router } = require('express');
const usersController = require('./users/');
const tipoUsuarioController = require('./tipoUsuario/');
const noticiasDiariasController = require('./noticias_diarias/');
const noticiasController = require('./noticias/');
const coursePageController = require('./course_page/');
const coursesController = require('./courses/');
const categoriasRoutes = require('./categorias/');

const routes = Router();

routes.use('/users', usersController);
routes.use('/tipo-usuario', tipoUsuarioController);
routes.use('/api/noticias', noticiasController);
routes.use('/api/noticias-diarias', noticiasDiariasController);
routes.use('/api/course-page', coursePageController);
routes.use('/api/courses', coursesController);
routes.use('/categorias', categoriasRoutes);
module.exports = routes;
