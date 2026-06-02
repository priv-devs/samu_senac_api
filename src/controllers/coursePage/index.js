const CoursePage = require('../../models/coursePage');
const tratarErro = require('../../utils/tratar_erros.ultils');

const model = new CoursePage();

module.exports = {
  async find(req, res, next) {
    try {
      const page = await model.find();
      return res.json({ success: true, data: page ? page.payload : null });
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async create(req, res, next) {
    try {
      const created = await model.create(req.body);
      return res.status(201).json({ success: true, data: created.payload });
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await model.update(id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: 'Página nao encontrada' });
      return res.json({ success: true, data: updated.payload });
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async patch(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await model.updatePartial(id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: 'Página nao encontrada' });
      return res.json({ success: true, data: updated.payload });
    } catch (error) {
      return tratarErro(error, res, next);
    }
  },

  async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const ok = await model.deletar(id);
      if (!ok) return res.status(404).json({ success: false, message: 'Página nao encontrada' });
      return res.json({ success: true, message: 'Página removida com sucesso' });
    } catch (error) {
      return tratarErro(error, res, next);
    }
  }
};
