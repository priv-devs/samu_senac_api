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
function isString(v) { return typeof v === 'string'; }
function isNonEmptyString(v) { return isString(v) && v.trim().length > 0; }
function trimOrNull(v) { if (!isString(v)) return null; const t = v.trim(); return t === '' ? null : t; }

function validarDadosUsuario(dados, parcial = false) {
    const erros = [];

    if (!parcial || Object.prototype.hasOwnProperty.call(dados, 'nome_usuario')) {
        if (!isNonEmptyString(dados.nome_usuario)) {
            erros.push('nome_usuario e obrigatorio');
        } else if (dados.nome_usuario.trim().length > 100) {
            erros.push('nome_usuario deve ter no maximo 100 caracteres');
        }
    }

    if (!parcial || Object.prototype.hasOwnProperty.call(dados, 'senha')) {
        if (!isNonEmptyString(dados.senha)) {
            erros.push('senha e obrigatoria');
        }
    }

    if (!parcial || Object.prototype.hasOwnProperty.call(dados, 'tipo')) {
        if (!dados.tipo || !isString(dados.tipo)) {
            erros.push('tipo e obrigatorio');
        }
    }

    if (Object.prototype.hasOwnProperty.call(dados, 'status')) {
        if (!isString(dados.status)) erros.push('status deve ser texto');
        else if (dados.status && dados.status.trim().length > 15) erros.push('status deve ter no maximo 15 caracteres');
    }

    if (Object.prototype.hasOwnProperty.call(dados, 'cpf_cnpj') && dados.cpf_cnpj !== undefined && !isString(dados.cpf_cnpj)) {
        erros.push('cpf_cnpj deve ser texto');
    }

    if (Object.prototype.hasOwnProperty.call(dados, 'cep') && dados.cep !== undefined && !isString(dados.cep)) {
        erros.push('cep deve ser texto');
    }

    if (Object.prototype.hasOwnProperty.call(dados, 'telefone1') && dados.telefone1 !== undefined && !isString(dados.telefone1)) {
        erros.push('telefone1 deve ser texto');
    }

    if (Object.prototype.hasOwnProperty.call(dados, 'email') && dados.email !== undefined && !isString(dados.email)) {
        erros.push('email deve ser texto');
    }

    if (erros.length) throw new ValidationError('Dados invalidos', erros);
}

module.exports = class Users {
    async findAll() {
        const rows = await prisma.usuarios.findMany({
            orderBy: { idUser: 'asc' },
            select: {
                idUser: true,
                nome: true,
                cpfCnpj: true,
                cep: true,
                telefone1: true,
                email: true,
                senha: true,
                tipo: true,
                status: true
            }
        });

        return rows.map(r => ({
            id: r.idUser,
            nome_usuario: r.nome,
            tipo: r.tipo,
            status: r.status
        }));
    }

    async findById(id) {
        validarId(id);
        const r = await prisma.usuarios.findUnique({
            where: { idUser: Number(id) },
            select: {
                idUser: true,
                nome: true,
                senha: true,
                cpfCnpj: true,
                cep: true,
                telefone1: true,
                email: true,
                tipo: true,
                status: true
            }
        });

        if (!r) return null;
        return {
            id: r.idUser,
            nome_usuario: r.nome,
            senha: r.senha,
            cpf_cnpj: r.cpfCnpj,
            cep: r.cep,
            telefone1: r.telefone1,
            email: r.email,
            tipo: r.tipo,
            status: r.status
        };
    }

    async findPublicById(id) {
        const user = await this.findById(id);
        if (!user) return null;
        const { senha, cpf_cnpj, cep, telefone1, email, ...publicUser } = user;
        return publicUser;
    }

    async create({ nome_usuario, senha, tipo, cpf_cnpj, cep, telefone1, email }) {
        validarDadosUsuario({ nome_usuario, senha, tipo, cpf_cnpj, cep, telefone1, email });

        const created = await prisma.usuarios.create({
            data: {
                nome: nome_usuario ? nome_usuario.trim() : null,
                senha: senha ? String(senha) : null,
                cpfCnpj: cpf_cnpj ? cpf_cnpj.trim() : null,
                cep: cep ? cep.trim() : null,
                telefone1: telefone1 ? telefone1.trim() : null,
                email: email ? email.trim() : null,
                tipo: tipo || 'user',
                status: 'ativo'
            },
            select: { idUser: true }
        });

        return this.findPublicById(created.idUser);
    }

    async update(id, { nome_usuario, senha, tipo, status, cpf_cnpj, cep, telefone1, email }) {
        validarId(id);
        validarDadosUsuario({ nome_usuario, senha, tipo, cpf_cnpj, cep, telefone1, email });

        const currentUser = await this.findById(id);
        if (!currentUser) return null;

        const data = {
            nome: Object.prototype.hasOwnProperty.call({ nome_usuario }, 'nome_usuario') ? trimOrNull(nome_usuario) : currentUser.nome_usuario,
            senha: Object.prototype.hasOwnProperty.call({ senha }, 'senha') ? (senha ? String(senha) : null) : currentUser.senha,
            cpfCnpj: Object.prototype.hasOwnProperty.call({ cpf_cnpj }, 'cpf_cnpj') ? trimOrNull(cpf_cnpj) : currentUser.cpf_cnpj,
            cep: Object.prototype.hasOwnProperty.call({ cep }, 'cep') ? trimOrNull(cep) : currentUser.cep,
            telefone1: Object.prototype.hasOwnProperty.call({ telefone1 }, 'telefone1') ? trimOrNull(telefone1) : currentUser.telefone1,
            email: Object.prototype.hasOwnProperty.call({ email }, 'email') ? trimOrNull(email) : currentUser.email,
            tipo: tipo !== undefined ? tipo : currentUser.tipo,
            status: status !== undefined ? status : currentUser.status
        };

        await prisma.usuarios.update({ where: { idUser: Number(id) }, data });
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
            status: data.status ?? currentUser.status,
            cpf_cnpj: data.cpf_cnpj ?? currentUser.cpf_cnpj,
            cep: data.cep ?? currentUser.cep,
            telefone1: data.telefone1 ?? currentUser.telefone1,
            email: data.email ?? currentUser.email
        });
    }

    async deletar(id) {
        validarId(id);
        const deleted = await prisma.usuarios.deleteMany({ where: { idUser: Number(id) } });
        return deleted.count > 0;
    }
 
    async findAllTipos() {
        const rows = await prisma.usuarios.findMany({
            where: { tipo: { not: null } },
            distinct: ['tipo'],
            select: { tipo: true }
        });
        return rows.map(r => ({ tipo: r.tipo }));
    }

    async findTipo(tipo) {
        if (!tipo || typeof tipo !== 'string') return null;
        const r = await prisma.usuarios.findFirst({ where: { tipo: tipo }, select: { tipo: true } });
        if (!r) return null;
        return { tipo: r.tipo };
    }
};
