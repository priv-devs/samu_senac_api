const Mapa = require('../../models/mapa');
const tratarErro = require('../../utils/tratar_erros.ultils');

const mapaModel = new Mapa();

module.exports = {
    async get(req, res, next) {
        try {
            const mapa = await mapaModel.get();
            if (!mapa) return res.status(404).json({ message: 'Mapa nao encontrado' });
            return res.json(mapa);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async patch(req, res, next) {
        try {
            const data = req.body;
            const mapa = await mapaModel.upsert(data);
            return res.json(mapa);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};
