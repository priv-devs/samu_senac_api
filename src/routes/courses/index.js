const { Router } = require('express');
const controller = require('../../controllers/courses');

const routes = Router();

routes.get('/', controller.index);
routes.get('/:id', controller.listar);
routes.post('/', controller.store);
routes.put('/:id', controller.update);
routes.delete('/:id', controller.destroy);

module.exports = routes;
