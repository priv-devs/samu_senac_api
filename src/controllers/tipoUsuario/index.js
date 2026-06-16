const TipoUsuario = require('../../models/tipoUsuario');

const tipoUsuarioModel = new TipoUsuario();

function tratarErro(error, res, next) {
    if (error.name === 'ValidationError') {
        const response = { message: error.message };

        if (error.erros.length) {
            response.erros = error.erros;
        }

        return res.status(400).json(response);
    }

    if (error.code === '23503') {
        return res.status(400).json({ message: 'tipo_usuario esta sendo usado por usuarios' });
    }

    return next(error);
}

module.exports = {
    async index(req, res, next) {
        try {
            const tipos = await tipoUsuarioModel.findAll();
            return res.json(tipos);
        } catch (error) {
            return next(error);
        }
    },

    async listar(req, res, next) {
        try {
            const { id } = req.params;
            const tipo = await tipoUsuarioModel.findById(id);

            if (!tipo) {
                return res.status(404).json({ message: 'Tipo de usuario nao encontrado' });
            }

            return res.json(tipo);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async store(req, res, next) {
        try {
            const tipo = await tipoUsuarioModel.create(req.body);
            return res.status(201).json(tipo);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const tipo = await tipoUsuarioModel.update(id, req.body);

            if (!tipo) {
                return res.status(404).json({ message: 'Tipo de usuario nao encontrado' });
            }

            return res.json(tipo);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async patch(req, res, next) {
        try {
            const { id } = req.params;
            const tipo = await tipoUsuarioModel.updatePartial(id, req.body);

            if (!tipo) {
                return res.status(404).json({ message: 'Tipo de usuario nao encontrado' });
            }

            return res.json(tipo);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async destroy(req, res, next) {
        try {
            const { id } = req.params;
            const tipoRemovido = await tipoUsuarioModel.deletar(id);

            if (!tipoRemovido) {
                return res.status(404).json({ message: 'Tipo de usuario nao encontrado' });
            }

            return res.status(204).send();
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};
