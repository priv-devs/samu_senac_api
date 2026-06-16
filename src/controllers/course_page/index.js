const CoursePage = require('../../models/course_page');

const coursePageModel = new CoursePage();

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
            const pagina = await coursePageModel.findLatest();

            if (!pagina) {
                return res.status(404).json({
                    success: false,
                    message: 'Pagina de cursos nao encontrada'
                });
            }

            return res.json({ success: true, data: pagina });
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async store(req, res, next) {
        try {
            const pagina = await coursePageModel.create(req.body);
            return res.status(201).json({ success: true, data: pagina });
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const pagina = await coursePageModel.update(id, req.body);

            if (!pagina) {
                return res.status(404).json({
                    success: false,
                    message: 'Pagina de cursos nao encontrada'
                });
            }

            return res.json({ success: true, data: pagina });
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async patch(req, res, next) {
        try {
            const { id } = req.params;
            const pagina = await coursePageModel.updatePartial(id, req.body);

            if (!pagina) {
                return res.status(404).json({
                    success: false,
                    message: 'Pagina de cursos nao encontrada'
                });
            }

            return res.json({ success: true, data: pagina });
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async destroy(req, res, next) {
        try {
            const { id } = req.params;
            const paginaRemovida = await coursePageModel.deletar(id);

            if (!paginaRemovida) {
                return res.status(404).json({
                    success: false,
                    message: 'Pagina de cursos nao encontrada'
                });
            }

            return res.json({
                success: true,
                message: 'Pagina removida com sucesso'
            });
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};
