// src/controllers/sobre/index.js

const Sobre = require('../../models/sobre');

const sobreModel = new Sobre();

module.exports = {

  // ── Trajetória ────────────────────────────────────────────────

  async getTrajetoria(req, res, next) {
    try {
      const data = await sobreModel.getTrajetoria();
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async createTrajetoria(req, res, next) {
    try {
      const { tag, titulo, descricao } = req.body;
      if (!tag || !titulo || !descricao)
        return res.status(400).json({ success: false, message: 'tag, titulo e descricao são obrigatórios.' });
      const data = await sobreModel.createTrajetoria({ tag, titulo, descricao });
      return res.status(201).json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async updateTrajetoria(req, res, next) {
    try {
      const data = await sobreModel.updateTrajetoria(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Trajetória não encontrada.' });
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async patchTrajetoria(req, res, next) {
    try {
      const data = await sobreModel.patchTrajetoria(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Trajetória não encontrada.' });
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async deleteTrajetoria(req, res, next) {
    try {
      const removido = await sobreModel.deleteTrajetoria(req.params.id);
      if (!removido) return res.status(404).json({ success: false, message: 'Trajetória não encontrada.' });
      return res.status(204).send();
    } catch (error) { return next(error); }
  },

  // ── Equipe — seção institucional ──────────────────────────────

  async getEquipe(req, res, next) {
    try {
      const data = await sobreModel.getEquipe();
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async createEquipe(req, res, next) {
    try {
      const { tag, titulo, descricao } = req.body;
      if (!tag || !titulo || !descricao)
        return res.status(400).json({ success: false, message: 'tag, titulo e descricao são obrigatórios.' });
      const data = await sobreModel.createEquipe({ tag, titulo, descricao });
      return res.status(201).json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async updateEquipe(req, res, next) {
    try {
      const data = await sobreModel.updateEquipe(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Seção equipe não encontrada.' });
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async patchEquipe(req, res, next) {
    try {
      const data = await sobreModel.patchEquipe(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Seção equipe não encontrada.' });
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async deleteEquipe(req, res, next) {
    try {
      const removido = await sobreModel.deleteEquipe(req.params.id);
      if (!removido) return res.status(404).json({ success: false, message: 'Seção equipe não encontrada.' });
      return res.status(204).send();
    } catch (error) { return next(error); }
  },

  // ── Cards da equipe ───────────────────────────────────────────

  async getCardsEquipe(req, res, next) {
    try {
      const data = await sobreModel.getCardsEquipe();
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async getCardEquipeById(req, res, next) {
    try {
      const data = await sobreModel.getCardEquipeById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async createCardEquipe(req, res, next) {
    try {
      const { titulo, descricao } = req.body;
      if (!titulo || !descricao)
        return res.status(400).json({ success: false, message: 'titulo e descricao são obrigatórios.' });
      const data = await sobreModel.createCardEquipe({ titulo, descricao });
      return res.status(201).json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async updateCardEquipe(req, res, next) {
    try {
      const data = await sobreModel.updateCardEquipe(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async patchCardEquipe(req, res, next) {
    try {
      const data = await sobreModel.patchCardEquipe(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
      return res.json({ success: true, data });
    } catch (error) { return next(error); }
  },

  async deleteCardEquipe(req, res, next) {
    try {
      const removido = await sobreModel.deleteCardEquipe(req.params.id);
      if (!removido) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
      return res.status(204).send();
    } catch (error) { return next(error); }
  },
};
