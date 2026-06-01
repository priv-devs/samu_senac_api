const { Router } = require('express');
const noticiasDiariasController = require('../../controllers/api/noticias_diarias/noticias_diarias.controllers');

const routes = Router();

routes.get('/', noticiasDiariasController.index);
routes.get('/:id', noticiasDiariasController.listar);
routes.post('/', noticiasDiariasController.store);
routes.put('/:id', noticiasDiariasController.update);
routes.patch('/:id', noticiasDiariasController.patch);
routes.delete('/:id', noticiasDiariasController.destroy);

module.exports = routes;
