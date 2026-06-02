const { Router } = require('express');
const usersController = require('../../controllers/users/users.controllers');
const tipoUsuarioController = usersController; 

const routes = Router();
 
routes.get('/tipo-usuario', tipoUsuarioController.indexTipos);
routes.get('/tipo-usuario/:id', tipoUsuarioController.listarTipo); 
routes.post('/tipo-usuario', (req, res) => res.status(405).json({ message: 'Mutations to tipo-usuario are managed via /users endpoints' }));
routes.put('/tipo-usuario/:id', (req, res) => res.status(405).json({ message: 'Mutations to tipo-usuario are managed via /users endpoints' }));
routes.patch('/tipo-usuario/:id', (req, res) => res.status(405).json({ message: 'Mutations to tipo-usuario are managed via /users endpoints' }));
routes.delete('/tipo-usuario/:id', (req, res) => res.status(405).json({ message: 'Mutations to tipo-usuario are managed via /users endpoints' }));

routes.get('/', usersController.index);
routes.get('/:id', usersController.listar);
routes.post('/', usersController.store);
routes.put('/:id', usersController.update);
routes.patch('/:id', usersController.patch);
routes.delete('/:id', usersController.destroy);

module.exports = routes;
