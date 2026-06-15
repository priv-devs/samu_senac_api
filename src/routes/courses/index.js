const { Router } = require('express');
const coursesController = require('../../controllers/courses');

const routes = Router();

routes.get('/', coursesController.listar);
routes.get('/:id', coursesController.index);
routes.post('/', coursesController.store);
routes.put('/:id', coursesController.update);
routes.delete('/:id', coursesController.destroy);

module.exports = routes;
