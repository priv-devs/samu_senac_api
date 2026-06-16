const Users = require('../../models/users');

const usersModel = new Users();

function tratarErro(error, res, next) {
    if (error.name === 'ValidationError') {
        const response = { message: error.message };

        if (error.erros.length) {
            response.erros = error.erros;
        }

        return res.status(400).json(response);
    }

    if (error.code === '23503' || error.message === 'TIPO_USUARIO_NOT_FOUND') {
        return res.status(400).json({ message: 'tipo informado nao existe' });
    }

    return next(error);
}

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
