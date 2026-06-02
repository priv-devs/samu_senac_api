const { Router } = require('express');
const router = Router();
const mapaController = require('../../controllers/mapa/mapa.controllers');

router.get('/', mapaController.get);
router.patch('/', mapaController.patch);

module.exports = router;
