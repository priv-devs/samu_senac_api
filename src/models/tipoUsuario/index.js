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
        throw new ValidationError('id de tipo_usuario invalido');
    }
}

function validarTipoUsuario(dados, parcial = false) {
    const erros = [];

    if (!parcial || dados.tipo !== undefined) {
        if (!dados.tipo || typeof dados.tipo !== 'string') {
            erros.push('tipo e obrigatorio');
        } else if (dados.tipo.trim().length > 15) {
            erros.push('tipo deve ter no maximo 15 caracteres');
        }
    }

    if (erros.length) {
        throw new ValidationError('Dados invalidos', erros);
    }
}

module.exports = class TipoUsuario {
    async findAll() {
        const rows = await prisma.tipoUsuario.findMany({ orderBy: { idTipo: 'asc' }, select: { idTipo: true, tipo: true } });
        return rows.map(r => ({ id_tipo: r.idTipo, tipo: r.tipo }));
    }

    async findById(id) {
        validarId(id);
        const r = await prisma.tipoUsuario.findUnique({ where: { idTipo: Number(id) }, select: { idTipo: true, tipo: true } });
        if (!r) return null;
        return { id_tipo: r.idTipo, tipo: r.tipo };
    }

    async create({ tipo }) {
        validarTipoUsuario({ tipo });
        const r = await prisma.tipoUsuario.create({ data: { tipo: tipo.trim() }, select: { idTipo: true, tipo: true } });
        return { id_tipo: r.idTipo, tipo: r.tipo };
    }

    async update(id, { tipo }) {
        validarId(id);
        validarTipoUsuario({ tipo });
        try {
            const r = await prisma.tipoUsuario.update({ where: { idTipo: Number(id) }, data: { tipo: tipo.trim() }, select: { idTipo: true, tipo: true } });
            return { id_tipo: r.idTipo, tipo: r.tipo };
        } catch (e) {
            return null;
        }
    }

    async updatePartial(id, data) {
        validarId(id);

        if (!Object.keys(data).length) {
            throw new ValidationError('Informe ao menos um campo');
        }

        validarTipoUsuario(data, true);

        const currentTipo = await this.findById(id);
        if (!currentTipo) return null;

        return this.update(id, { tipo: data.tipo ?? currentTipo.tipo });
    }

    async deletar(id) {
        validarId(id);
        try {
            await prisma.tipoUsuario.delete({ where: { idTipo: Number(id) } });
            return true;
        } catch (e) {
            return false;
        }
    }
};
