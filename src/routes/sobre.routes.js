// src/routes/sobre.routes.js

const { Router } = require('express');
const ctrl = require('../controllers/sobre.controller');

const router = Router();

// ── Página SSR ────────────────────────────────────────────────
// GET /sobre
router.get('/sobre', ctrl.renderPagina);

// ── Trajetória ────────────────────────────────────────────────
// GET    /api/sobre/trajetoria
// POST   /api/sobre/trajetoria
// PUT    /api/sobre/trajetoria/:id
// PATCH  /api/sobre/trajetoria/:id
// DELETE /api/sobre/trajetoria/:id
router.get   ('/api/sobre/trajetoria',      ctrl.getTrajetoria);
router.post  ('/api/sobre/trajetoria',      ctrl.createTrajetoria);
router.put   ('/api/sobre/trajetoria/:id',  ctrl.updateTrajetoria);
router.patch ('/api/sobre/trajetoria/:id',  ctrl.patchTrajetoria);
router.delete('/api/sobre/trajetoria/:id',  ctrl.deleteTrajetoria);

// ── Equipe — seção institucional ──────────────────────────────
// GET    /api/sobre/equipe
// POST   /api/sobre/equipe
// PUT    /api/sobre/equipe/:id
// PATCH  /api/sobre/equipe/:id
// DELETE /api/sobre/equipe/:id
router.get   ('/api/sobre/equipe',      ctrl.getEquipe);
router.post  ('/api/sobre/equipe',      ctrl.createEquipe);
router.put   ('/api/sobre/equipe/:id',  ctrl.updateEquipe);
router.patch ('/api/sobre/equipe/:id',  ctrl.patchEquipe);
router.delete('/api/sobre/equipe/:id',  ctrl.deleteEquipe);

// ── Cards da equipe ───────────────────────────────────────────
// GET    /api/sobre/cards-equipe
// GET    /api/sobre/cards-equipe/:id
// POST   /api/sobre/cards-equipe
// PUT    /api/sobre/cards-equipe/:id
// PATCH  /api/sobre/cards-equipe/:id
// DELETE /api/sobre/cards-equipe/:id
router.get   ('/api/sobre/cards-equipe',      ctrl.getCardsEquipe);
router.get   ('/api/sobre/cards-equipe/:id',  ctrl.getCardEquipeById);
router.post  ('/api/sobre/cards-equipe',      ctrl.createCardEquipe);
router.put   ('/api/sobre/cards-equipe/:id',  ctrl.updateCardEquipe);
router.patch ('/api/sobre/cards-equipe/:id',  ctrl.patchCardEquipe);
router.delete('/api/sobre/cards-equipe/:id',  ctrl.deleteCardEquipe);

module.exports = router;
