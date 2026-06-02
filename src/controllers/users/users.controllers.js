const Users = require('../../models/users');
const tratarErro = require('../../utils/tratar_erros.ultils');

const usersModel = new Users();

function buildUserPayload(body, parcial = false) {
    const payload = {};

    const has = (keys) => keys.some(k => Object.prototype.hasOwnProperty.call(body, k));

    if (!parcial || has(['nome_usuario', 'name', 'nome'])) {
        payload.nome_usuario = body.nome_usuario ?? body.name ?? body.nome;
    }

    if (!parcial || has(['senha', 'password'])) {
        if (Object.prototype.hasOwnProperty.call(body, 'senha')) payload.senha = body.senha ? String(body.senha) : null;
        else if (Object.prototype.hasOwnProperty.call(body, 'password')) payload.senha = body.password ? String(body.password) : null;
    }

    if (!parcial || Object.prototype.hasOwnProperty.call(body, 'tipo')) payload.tipo = body.tipo;
    if (!parcial || Object.prototype.hasOwnProperty.call(body, 'status')) payload.status = body.status;

    if (!parcial || has(['cpf_cnpj', 'cpfCnpj', 'cpf'])) payload.cpf_cnpj = body.cpf_cnpj ?? body.cpfCnpj ?? body.cpf;
    if (!parcial || Object.prototype.hasOwnProperty.call(body, 'cep')) payload.cep = body.cep;
    if (!parcial || has(['telefone1', 'telefone'])) payload.telefone1 = body.telefone1 ?? body.telefone;
    if (!parcial || Object.prototype.hasOwnProperty.call(body, 'email')) payload.email = body.email;

    return payload;
}

module.exports = {
    async index(req, res, next) {
        try {
            const usuarios = await usersModel.findAll();
            return res.json(usuarios);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },
 
    async indexTipos(req, res, next) {
        try {
            const tipos = await usersModel.findAllTipos();
            return res.json(tipos);
        } catch (error) {
            return tratarErro(error, res, next);
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
            const payload = buildUserPayload(req.body, false);
            const usuario = await usersModel.create(payload);
            return res.status(201).json(usuario);
        } catch (error) {
            return tratarErro(error, res, next);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const payload = buildUserPayload(req.body, false);
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

            const payload = buildUserPayload(req.body, true);
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
