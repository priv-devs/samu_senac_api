const { Router } = require('express');
const noticiasController = require('../../controllers/noticias');

const routes = Router();

routes.get('/principal', noticiasController.principal);
routes.post('/principal', noticiasController.storePrincipal);

routes.get('/secundarias', noticiasController.secundarias);
routes.post('/secundarias', noticiasController.storeSecundaria);
routes.put('/secundarias/:id', noticiasController.updateSecundaria);
routes.delete('/secundarias/:id', noticiasController.destroy);

routes.get('/', noticiasController.index);
routes.post('/', noticiasController.store);
routes.put('/:id', noticiasController.update);
routes.patch('/:id', noticiasController.patch);
routes.delete('/:id', noticiasController.destroy);

module.exports = routes;
