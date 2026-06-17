const { Router } = require('express');
const tipoUsuarioController = require('../../controllers/tipoUsuario');

const routes = Router();

routes.get('/', tipoUsuarioController.index);
routes.get('/:id', tipoUsuarioController.listar);
routes.post('/', tipoUsuarioController.store);
routes.put('/:id', tipoUsuarioController.update);
routes.patch('/:id', tipoUsuarioController.patch);
routes.delete('/:id', tipoUsuarioController.destroy);

module.exports = routes;
