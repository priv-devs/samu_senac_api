const { Router } = require('express');
const controller = require('../../controllers/coursePage');

const routes = Router();

routes.get('/', controller.find);
routes.post('/', controller.create);
routes.put('/:id', controller.update);
routes.patch('/:id', controller.patch);
routes.delete('/:id', controller.destroy);

module.exports = routes;
