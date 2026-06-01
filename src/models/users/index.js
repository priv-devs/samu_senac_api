const prisma = require('../../prisma/client');

class ValidationError extends Error {
    constructor(message, erros = []) {
        super(message);
        this.name = 'ValidationError';
        this.erros = erros;
    }
}

const idValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

function validarId(id) {
    if (!idValido(id)) {
        throw new ValidationError('id de usuario invalido');
    }
}

function validarDadosUsuario(dados, parcial = false) {
    const erros = [];

    if (!parcial || dados.nome_usuario !== undefined) {
        if (!dados.nome_usuario || typeof dados.nome_usuario !== 'string') {
            erros.push('nome_usuario e obrigatorio');
        } else if (dados.nome_usuario.trim().length > 100) {
            erros.push('nome_usuario deve ter no maximo 100 caracteres');
        }
    }

    if (!parcial || dados.senha !== undefined) {
        if (!dados.senha || typeof dados.senha !== 'string') {
            erros.push('senha e obrigatoria');
        }
    }

    if (!parcial || dados.tipo !== undefined) {
        if (!dados.tipo) {
            erros.push('tipo e obrigatorio');
        }
    }

    if (dados.status !== undefined && typeof dados.status !== 'string') {
        erros.push('status deve ser texto');
    }

    if (dados.status && dados.status.trim().length > 15) {
        erros.push('status deve ter no maximo 15 caracteres');
    }

    if (erros.length) {
        throw new ValidationError('Dados invalidos', erros);
    }
}

module.exports = class Users {
    async findAll() {
        const rows = await prisma.usuarios.findMany({
            orderBy: { idUser: 'asc' },
            select: {
                idUser: true,
                nomeUsuario: true,
                tipoId: true,
                tipo: { select: { tipo: true } },
                status: true
            }
        });

        return rows.map(r => ({
            id_user: r.idUser,
            nome_usuario: r.nomeUsuario,
            tipo: r.tipoId,
            tipo_usuario: r.tipo ? r.tipo.tipo : null,
            status: r.status
        }));
    }

    async findById(id) {
        validarId(id);
        const r = await prisma.usuarios.findUnique({
            where: { idUser: Number(id) },
            select: {
                idUser: true,
                nomeUsuario: true,
                senha: true,
                tipoId: true,
                tipo: { select: { tipo: true } },
                status: true
            }
        });

        if (!r) return null;
        return {
            id_user: r.idUser,
            nome_usuario: r.nomeUsuario,
            senha: r.senha,
            tipo: r.tipoId,
            tipo_usuario: r.tipo ? r.tipo.tipo : null,
            status: r.status
        };
    }

    async findPublicById(id) {
        const user = await this.findById(id);
        if (!user) return null;
        const { senha, ...publicUser } = user;
        return publicUser;
    }

    async findTipoId(tipo) {
        if (Number.isInteger(Number(tipo))) return Number(tipo);

        const r = await prisma.tipoUsuario.findFirst({ where: { tipo: { equals: tipo.trim(), mode: 'insensitive' } }, select: { idTipo: true } });
        if (!r) throw new Error('TIPO_USUARIO_NOT_FOUND');
        return r.idTipo;
    }

    async create({ nome_usuario, senha, tipo, status }) {
        validarDadosUsuario({ nome_usuario, senha, tipo, status });
        const tipoId = await this.findTipoId(tipo);

        const created = await prisma.usuarios.create({
            data: {
                nomeUsuario: nome_usuario.trim(),
                senha,
                tipoId,
                status: status ? status.trim() : 'ativo'
            },
            select: { idUser: true }
        });

        return this.findPublicById(created.idUser);
    }

    async update(id, { nome_usuario, senha, tipo, status }) {
        validarId(id);
        validarDadosUsuario({ nome_usuario, senha, tipo, status });

        const currentUser = await this.findById(id);
        if (!currentUser) return null;

        const tipoId = await this.findTipoId(tipo);

        const updated = await prisma.usuarios.updateMany({
            where: { idUser: Number(id) },
            data: {
                nomeUsuario: nome_usuario.trim(),
                senha,
                tipoId,
                status: status ? status.trim() : currentUser.status
            }
        });

        if (updated.count === 0) return null;
        return this.findPublicById(id);
    }

    async updatePartial(id, data) {
        validarId(id);
        if (!Object.keys(data).length) throw new ValidationError('Informe ao menos um campo');
        validarDadosUsuario(data, true);

        const currentUser = await this.findById(id);
        if (!currentUser) return null;

        return this.update(id, {
            nome_usuario: data.nome_usuario ?? currentUser.nome_usuario,
            senha: data.senha ?? currentUser.senha,
            tipo: data.tipo ?? currentUser.tipo,
            status: data.status ?? currentUser.status
        });
    }

    async deletar(id) {
        validarId(id);
        const deleted = await prisma.usuarios.deleteMany({ where: { idUser: Number(id) } });
        return deleted.count > 0;
    }
};
