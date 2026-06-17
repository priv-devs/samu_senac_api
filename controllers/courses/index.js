const Courses = require('../../models/courses');

const coursesModel = new Courses();

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
            const cursos = await coursesModel.findAll();
            return res.json(cursos);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async listar(req, res, next) {
        try {
            const { id } = req.params;
            const curso = await coursesModel.findById(id);

            if (!curso) {
                return res.status(404).json({ message: 'Curso nao encontrado' });
            }

            return res.json(curso);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async store(req, res, next) {
        try {
            const curso = await coursesModel.create(req.body);
            return res.status(201).json(curso);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const curso = await coursesModel.update(id, req.body);

            if (!curso) {
                return res.status(404).json({ message: 'Curso nao encontrado' });
            }

            return res.json(curso);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async destroy(req, res, next) {
        try {
            const { id } = req.params;
            const cursoRemovido = await coursesModel.deletar(id);

            if (!cursoRemovido) {
                return res.status(404).json({ message: 'Curso nao encontrado' });
            }

            return res.status(204).send();
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};
