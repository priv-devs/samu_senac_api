const pool = require('../../database');

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
        const { rows } = await pool.query(`
            SELECT
                id_tipo,
                tipo
            FROM tipo_usuario
            ORDER BY id_tipo ASC
        `);

        return rows;
    }

    async findById(id) {
        validarId(id);

        const { rows } = await pool.query(`
            SELECT
                id_tipo,
                tipo
            FROM tipo_usuario
            WHERE id_tipo = $1
        `, [id]);

        return rows[0] || null;
    }

    async create({ tipo }) {
        validarTipoUsuario({ tipo });

        const { rows } = await pool.query(`
            INSERT INTO tipo_usuario (tipo)
            VALUES ($1)
            RETURNING id_tipo, tipo
        `, [tipo.trim()]);

        return rows[0];
    }

    async update(id, { tipo }) {
        validarId(id);
        validarTipoUsuario({ tipo });

        const { rows } = await pool.query(`
            UPDATE tipo_usuario
            SET tipo = $1
            WHERE id_tipo = $2
            RETURNING id_tipo, tipo
        `, [tipo.trim(), id]);

        return rows[0] || null;
    }

    async updatePartial(id, data) {
        validarId(id);

        if (!Object.keys(data).length) {
            throw new ValidationError('Informe ao menos um campo');
        }

        validarTipoUsuario(data, true);

        const currentTipo = await this.findById(id);

        if (!currentTipo) {
            return null;
        }

        return this.update(id, {
            tipo: data.tipo ?? currentTipo.tipo
        });
    }

    async deletar(id) {
        validarId(id);

        const { rowCount } = await pool.query(
            'DELETE FROM tipo_usuario WHERE id_tipo = $1',
            [id]
        );

        return rowCount > 0;
    }
};
