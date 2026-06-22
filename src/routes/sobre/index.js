// src/routes/sobre/index.js

const { Router } = require('express');
const ctrl = require('../../controllers/sobre');

const router = Router();

router.get   ('/trajetoria',        ctrl.getTrajetoria);
router.post  ('/trajetoria',        ctrl.createTrajetoria);
router.put   ('/trajetoria/:id',    ctrl.updateTrajetoria);
router.patch ('/trajetoria/:id',    ctrl.patchTrajetoria);
router.delete('/trajetoria/:id',    ctrl.deleteTrajetoria);

router.get   ('/equipe',            ctrl.getEquipe);
router.post  ('/equipe',            ctrl.createEquipe);
router.put   ('/equipe/:id',        ctrl.updateEquipe);
router.patch ('/equipe/:id',        ctrl.patchEquipe);
router.delete('/equipe/:id',        ctrl.deleteEquipe);

router.get   ('/cards-equipe',      ctrl.getCardsEquipe);
router.get   ('/cards-equipe/:id',  ctrl.getCardEquipeById);
router.post  ('/cards-equipe',      ctrl.createCardEquipe);
router.put   ('/cards-equipe/:id',  ctrl.updateCardEquipe);
router.patch ('/cards-equipe/:id',  ctrl.patchCardEquipe);
router.delete('/cards-equipe/:id',  ctrl.deleteCardEquipe);

module.exports = router;
