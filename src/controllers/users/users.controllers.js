const Users = require('../../models/users');
const tratarErro = require('../../utils/tratar_erros.ultils');

const usersModel = new Users();

module.exports = {
    async index(req, res, next) {
        try {
            const usuarios = await usersModel.findAll();
            return res.json(usuarios);
        } catch (error) {
            return next(error);
        }
    },

    async listar(req, res, next) {
        try {
            const { id } = req.params;

            const usuario = await usersModel.findPublicById(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async store(req, res, next) {
        try {
            const usuario = await usersModel.create(req.body);
            return res.status(201).json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const usuario = await usersModel.update(id, req.body);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async patch(req, res, next) {
        try {
            const { id } = req.params;

            const usuario = await usersModel.updatePartial(id, req.body);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async destroy(req, res, next) {
        try {
            const { id } = req.params;

            const usuarioRemovido = await usersModel.deletar(id);

            if (!usuarioRemovido) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.status(204).send();
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};
