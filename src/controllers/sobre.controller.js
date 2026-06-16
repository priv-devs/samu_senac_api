// src/controllers/sobre.controller.js

const model = require('../models/sobre.model');

// ── Página SSR ────────────────────────────────────────────────

const renderPagina = (req, res) => {
  res.render('sobre', {
    title:      'Sobre | SAMU Dourados - MS',
    active:     'sobre',
    trajetoria: model.getTrajetoria(),
    equipe:     model.getEquipe(),
    cards:      model.getCardsEquipe(),
  });
};

// ── Trajetória ────────────────────────────────────────────────

const getTrajetoria = (req, res) => {
  const data = model.getTrajetoria();
  res.json({ success: true, data });
};

const createTrajetoria = (req, res) => {
  const { tag, titulo, descricao } = req.body;
  if (!tag || !titulo || !descricao) {
    return res.status(400).json({ success: false, message: 'tag, titulo e descricao são obrigatórios.' });
  }
  model.createTrajetoria({ tag, titulo, descricao });
  res.status(201).json({ success: true, message: 'Seção trajetória criada com sucesso' });
};

const updateTrajetoria = (req, res) => {
  const id = parseInt(req.params.id);
  const { tag, titulo, descricao } = req.body;
  const atualizado = model.updateTrajetoria(id, { tag, titulo, descricao });
  if (!atualizado) return res.status(404).json({ success: false, message: 'Trajetória não encontrada.' });
  res.json({ success: true, message: 'Trajetória atualizada com sucesso' });
};

const patchTrajetoria = (req, res) => {
  const id = parseInt(req.params.id);
  const atualizado = model.patchTrajetoria(id, req.body);
  if (!atualizado) return res.status(404).json({ success: false, message: 'Trajetória não encontrada.' });
  res.json({ success: true, message: 'Trajetória atualizada parcialmente' });
};

const deleteTrajetoria = (req, res) => {
  const id = parseInt(req.params.id);
  const removido = model.deleteTrajetoria(id);
  if (!removido) return res.status(404).json({ success: false, message: 'Trajetória não encontrada.' });
  res.json({ success: true, message: 'Trajetória removida com sucesso' });
};

// ── Equipe — seção institucional ──────────────────────────────

const getEquipe = (req, res) => {
  const data = model.getEquipe();
  res.json({ success: true, data });
};

const createEquipe = (req, res) => {
  const { tag, titulo, descricao } = req.body;
  if (!tag || !titulo || !descricao) {
    return res.status(400).json({ success: false, message: 'tag, titulo e descricao são obrigatórios.' });
  }
  model.createEquipe({ tag, titulo, descricao });
  res.status(201).json({ success: true, message: 'Seção equipe criada com sucesso' });
};

const updateEquipe = (req, res) => {
  const id = parseInt(req.params.id);
  const { tag, titulo, descricao } = req.body;
  const atualizado = model.updateEquipe(id, { tag, titulo, descricao });
  if (!atualizado) return res.status(404).json({ success: false, message: 'Seção equipe não encontrada.' });
  res.json({ success: true, message: 'Seção equipe atualizada com sucesso' });
};

const patchEquipe = (req, res) => {
  const id = parseInt(req.params.id);
  const atualizado = model.patchEquipe(id, req.body);
  if (!atualizado) return res.status(404).json({ success: false, message: 'Seção equipe não encontrada.' });
  res.json({ success: true, message: 'Equipe atualizada parcialmente' });
};

const deleteEquipe = (req, res) => {
  const id = parseInt(req.params.id);
  const removido = model.deleteEquipe(id);
  if (!removido) return res.status(404).json({ success: false, message: 'Seção equipe não encontrada.' });
  res.json({ success: true, message: 'Seção equipe removida com sucesso' });
};

// ── Cards da equipe ───────────────────────────────────────────

const getCardsEquipe = (req, res) => {
  res.json({ success: true, data: model.getCardsEquipe() });
};

const getCardEquipeById = (req, res) => {
  const id = parseInt(req.params.id);
  const card = model.getCardEquipeById(id);
  if (!card) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
  res.json({ success: true, data: card });
};

const createCardEquipe = (req, res) => {
  const { titulo, descricao } = req.body;
  if (!titulo || !descricao) {
    return res.status(400).json({ success: false, message: 'titulo e descricao são obrigatórios.' });
  }
  model.createCardEquipe({ titulo, descricao });
  res.status(201).json({ success: true, message: 'Card criado com sucesso' });
};

const updateCardEquipe = (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao } = req.body;
  const atualizado = model.updateCardEquipe(id, { titulo, descricao });
  if (!atualizado) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
  res.json({ success: true, message: 'Card atualizado com sucesso' });
};

const patchCardEquipe = (req, res) => {
  const id = parseInt(req.params.id);
  const atualizado = model.patchCardEquipe(id, req.body);
  if (!atualizado) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
  res.json({ success: true, message: 'Card atualizado parcialmente' });
};

const deleteCardEquipe = (req, res) => {
  const id = parseInt(req.params.id);
  const removido = model.deleteCardEquipe(id);
  if (!removido) return res.status(404).json({ success: false, message: 'Card não encontrado.' });
  res.json({ success: true, message: 'Card removido com sucesso' });
};

module.exports = {
  renderPagina,
  getTrajetoria,
  createTrajetoria,
  updateTrajetoria,
  patchTrajetoria,
  deleteTrajetoria,
  getEquipe,
  createEquipe,
  updateEquipe,
  patchEquipe,
  deleteEquipe,
  getCardsEquipe,
  getCardEquipeById,
  createCardEquipe,
  updateCardEquipe,
  patchCardEquipe,
  deleteCardEquipe,
};
