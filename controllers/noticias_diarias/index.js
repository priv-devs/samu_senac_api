const NoticiasDiarias = require('../../models/noticias_diarias');

const noticiasDiariasModel = new NoticiasDiarias();

function tratarErro(error, res, next) {
    if (error.name === 'ValidationError') {
        const response = { message: error.message };

        if (error.erros.length) {
            response.erros = error.erros;
        }

        return res.status(400).json(response);
    }

    return next(error);
}

module.exports = {
    async index(req, res, next) {
        try {
            const noticias = await noticiasDiariasModel.findAll(req.query);
            return res.json(noticias);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async listar(req, res, next) {
        try {
            const { id } = req.params;
            const noticia = await noticiasDiariasModel.findById(id);

            if (!noticia) {
                return res.status(404).json({ message: 'Noticia nao encontrada' });
            }

            return res.json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async store(req, res, next) {
        try {
            const noticia = await noticiasDiariasModel.create(req.body);
            return res.status(201).json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const noticia = await noticiasDiariasModel.update(id, req.body);

            if (!noticia) {
                return res.status(404).json({ message: 'Noticia nao encontrada' });
            }

            return res.json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async patch(req, res, next) {
        try {
            const { id } = req.params;
            const noticia = await noticiasDiariasModel.updatePartial(id, req.body);

            if (!noticia) {
                return res.status(404).json({ message: 'Noticia nao encontrada' });
            }

            return res.json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async destroy(req, res, next) {
        try {
            const { id } = req.params;
            const noticiaRemovida = await noticiasDiariasModel.deletar(id);

            if (!noticiaRemovida) {
                return res.status(404).json({ message: 'Noticia nao encontrada' });
            }

            return res.status(204).send();
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};

