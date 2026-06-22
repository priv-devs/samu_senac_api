"use strict";
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
        throw new ValidationError('id de pagina de curso invalido');
    }
}
function validarPayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new ValidationError('Dados invalidos', ['payload da pagina deve ser um objeto']);
    }
}
function mergeDeep(base, patch) {
    return Object.keys(patch).reduce((resultado, chave) => {
        const valor = patch[chave];
        const valorAtual = resultado[chave];
        if (valor &&
            typeof valor === 'object' &&
            !Array.isArray(valor) &&
            valorAtual &&
            typeof valorAtual === 'object' &&
            !Array.isArray(valorAtual)) {
            resultado[chave] = mergeDeep(valorAtual, valor);
        }
        else {
            resultado[chave] = valor;
        }
        return resultado;
    }, { ...base });
}
function formatarPagina(row) {
    if (!row) {
        return null;
    }
    return {
        id: row.id_course_page,
        ...row.payload,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}
module.exports = class CoursePage {
    async findLatest() {
        const { rows } = await pool.query(`
            SELECT id_course_page, payload, created_at, updated_at
            FROM course_page
            ORDER BY id_course_page DESC
            LIMIT 1
        `);
        return formatarPagina(rows[0]);
    }
    async findById(id) {
        validarId(id);
        const { rows } = await pool.query(`
            SELECT id_course_page, payload, created_at, updated_at
            FROM course_page
            WHERE id_course_page = $1
        `, [id]);
        return formatarPagina(rows[0]);
    }
    async create(payload) {
        validarPayload(payload);
        const { rows } = await pool.query(`
            INSERT INTO course_page (payload)
            VALUES ($1)
            RETURNING id_course_page
        `, [payload]);
        return this.findById(rows[0].id_course_page);
    }
    async update(id, payload) {
        validarId(id);
        validarPayload(payload);
        const { rows } = await pool.query(`
            UPDATE course_page
            SET payload = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_course_page = $2
            RETURNING id_course_page
        `, [payload, id]);
        if (!rows[0]) {
            return null;
        }
        return this.findById(rows[0].id_course_page);
    }
    async updatePartial(id, patch) {
        validarId(id);
        validarPayload(patch);
        if (!Object.keys(patch).length) {
            throw new ValidationError('Informe ao menos um campo');
        }
        const currentPage = await this.findById(id);
        if (!currentPage) {
            return null;
        }
        const { id: pageId, created_at, updated_at, ...currentPayload } = currentPage;
        const payload = mergeDeep(currentPayload, patch);
        return this.update(id, payload);
    }
    async deletar(id) {
        validarId(id);
        const { rowCount } = await pool.query('DELETE FROM course_page WHERE id_course_page = $1', [id]);
        return rowCount > 0;
    }
};
