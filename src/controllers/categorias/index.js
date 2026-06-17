const Categorias = require('../../models/categorias');

const categoriasModel = new Categorias();

module.exports = {

    async index(req, res) {
        const categorias = 
            await categoriasModel.findAll()
        return res.json(categorias);
    },

    async store(req, res){
        console.log(req.body);
        const categoria =
            await categoriasModel.create(req.body.nome);
        return res.status(201).json(categoria);
    },

}
