const Courses = require('../../models/courses');
const tratarErro = require('../../utils/tratar_erros.ultils');

const model = new Courses();

module.exports = {
  async index(req, res, next) {
    try {
      const cursos = await model.findAll();
      return res.json(cursos);
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async listar(req, res, next) {
    try {
      const { id } = req.params;
      const curso = await model.findById(id);
      if (!curso) return res.status(404).json({ message: 'Curso nao encontrado' });
      return res.json(curso);
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async store(req, res, next) {
    try {
      const created = await model.create(req.body);
      return res.status(201).json(created);
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await model.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Curso nao encontrado' });
      return res.json(updated);
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const ok = await model.deletar(id);
      if (!ok) return res.status(404).json({ message: 'Curso nao encontrado' });
      return res.status(204).send();
    } catch (error) {
      return tratarErro(error, res, next);
    }
  }
};
