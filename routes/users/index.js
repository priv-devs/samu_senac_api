const { Router } = require('express');
const usersController = require('../../controllers/users');

const routes = Router();

routes.get('/', usersController.index);
routes.get('/:id', usersController.listar);
routes.post('/', usersController.store);
routes.put('/:id', usersController.update);
routes.patch('/:id', usersController.patch);
routes.delete('/:id', usersController.destroy);

module.exports = routes;
