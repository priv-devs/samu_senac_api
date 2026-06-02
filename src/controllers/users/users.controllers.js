const Users = require('../../models/users');
const tratarErro = require('../../utils/tratar_erros.ultils');

const usersModel = new Users();

module.exports = {
    async index(req, res, next) {
        try {
            const usuarios = await usersModel.findAll();
            return res.json(usuarios);
        } catch (error) {
            return next(error);
        }
    },
 
    async indexTipos(req, res, next) {
        try {
            const tipos = await usersModel.findAllTipos();
            return res.json(tipos);
        } catch (error) {
            return next(error);
        }
    },

    async listarTipo(req, res, next) {
        try {
            const { id } = req.params;
            const tipo = await usersModel.findTipo(id);

            if (!tipo) {
                return res.status(404).json({ message: 'Tipo de usuario nao encontrado' });
            }

            return res.json(tipo);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async listar(req, res, next) {
        try {
            const { id } = req.params;

            const usuario = await usersModel.findPublicById(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async store(req, res, next) {
        try { 
            const payload = {
                nome_usuario: req.body.nome_usuario || req.body.name,
                senha: req.body.senha ? String(req.body.senha) : (req.body.password ? String(req.body.password) : undefined),
                tipo: req.body.tipo,
                status: req.body.status,
                cpf_cnpj: req.body.cpf_cnpj || req.body.cpfCnpj || req.body.cpf,
                cep: req.body.cep,
                telefone1: req.body.telefone1 || req.body.telefone,
                email: req.body.email
            };

            const usuario = await usersModel.create(payload);
            return res.status(201).json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const payload = {
                nome_usuario: req.body.nome_usuario || req.body.name,
                senha: req.body.senha ? String(req.body.senha) : (req.body.password ? String(req.body.password) : undefined),
                tipo: req.body.tipo,
                status: req.body.status,
                cpf_cnpj: req.body.cpf_cnpj || req.body.cpfCnpj || req.body.cpf,
                cep: req.body.cep,
                telefone1: req.body.telefone1 || req.body.telefone,
                email: req.body.email
            };

            const usuario = await usersModel.update(id, payload);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async patch(req, res, next) {
        try {
            const { id } = req.params;

            const payload = {};
            if (req.body.name) payload.nome_usuario = req.body.name;
            if (req.body.nome) payload.nome = req.body.nome;
            if (req.body.senha) payload.senha = String(req.body.senha);
            if (req.body.password) payload.senha = String(req.body.password); 
            if (req.body.tipo) payload.tipo = req.body.tipo;
            if (req.body.status) payload.status = req.body.status;
            if (req.body.cpfCnpj) payload.cpfCnpj = req.body.cpfCnpj;
            if (req.body.cep) payload.cep = req.body.cep;
            if (req.body.telefone1) payload.telefone1 = req.body.telefone1;
            if (req.body.telefone) payload.telefone1 = req.body.telefone;
            if (req.body.email) payload.email = req.body.email;

            const usuario = await usersModel.updatePartial(id, payload);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async destroy(req, res, next) {
        try {
            const { id } = req.params;

            const usuarioRemovido = await usersModel.deletar(id);

            if (!usuarioRemovido) {
                return res.status(404).json({ message: 'Usuario nao encontrado' });
            }

            return res.status(204).send();
        } catch (error) {
            return tratarErro(error, res, next);
        }
    }
};
