const Noticias = require('../../models/noticias');

const noticiasModel = new Noticias();

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
            const noticias = await noticiasModel.findAll({
                ...req.query,
                categoria: req.query.categoria || 'diaria'
            });
            return res.json(noticias);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async secundarias(req, res, next) {
        try {
            const noticias = await noticiasModel.findAll({
                ...req.query,
                categoria: 'secundaria'
            });
            return res.json(noticias);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async principal(req, res, next) {
        try {
            const noticia = await noticiasModel.findPrincipal();

            if (!noticia) {
                return res.status(404).json({ message: 'Noticia principal nao encontrada' });
            }

            return res.json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async store(req, res, next) {
        try {
            const noticia = await noticiasModel.create({ ...req.body, categoria: 'diaria' }, 'diaria');
            return res.status(201).json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async storePrincipal(req, res, next) {
        try {
            const noticia = await noticiasModel.create({ ...req.body, categoria: 'principal' }, 'principal');
            return res.status(201).json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async storeSecundaria(req, res, next) {
        try {
            const noticia = await noticiasModel.create({ ...req.body, categoria: 'secundaria' }, 'secundaria');
            return res.status(201).json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const noticia = await noticiasModel.update(id, { ...req.body, categoria: 'diaria' }, 'diaria');

            if (!noticia) {
                return res.status(404).json({ message: 'Noticia nao encontrada' });
            }

            return res.json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async updateSecundaria(req, res, next) {
        try {
            const { id } = req.params;
            const noticia = await noticiasModel.update(id, { ...req.body, categoria: 'secundaria' }, 'secundaria');

            if (!noticia) {
                return res.status(404).json({ message: 'Noticia secundaria nao encontrada' });
            }

            return res.json(noticia);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async patch(req, res, next) {
        try {
            const { id } = req.params;
            const noticia = await noticiasModel.updatePartial(id, req.body);

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
            const noticiaRemovida = await noticiasModel.deletar(id);

            if (!noticiaRemovida) {
                return res.status(404).json({ message: 'Noticia nao encontrada' });
            }

            return res.status(204).send();
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};
