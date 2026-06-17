const { Router } = require('express');

const controller = require('../../controllers/categorias');

const routes = Router();

routes.get('/', controller.index);
routes.post('/', controller.store);

module.exports = routes;
