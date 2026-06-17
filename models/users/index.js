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
        const { rows } = await pool.query(`
            SELECT
                u.id_user,
                u.nome_usuario,
                u.tipo,
                tu.tipo AS tipo_usuario,
                u.status
            FROM usuarios u
            LEFT JOIN tipo_usuario tu ON tu.id_tipo = u.tipo
            ORDER BY u.id_user ASC
        `);

        return rows;
    }

    async findById(id) {
        validarId(id);

        const { rows } = await pool.query(`
            SELECT
                u.id_user,
                u.nome_usuario,
                u.senha,
                u.tipo,
                tu.tipo AS tipo_usuario,
                u.status
            FROM usuarios u
            LEFT JOIN tipo_usuario tu ON tu.id_tipo = u.tipo
            WHERE u.id_user = $1
        `, [id]);

        return rows[0] || null;
    }

    async findPublicById(id) {
        const user = await this.findById(id);

        if (!user) {
            return null;
        }

        const { senha, ...publicUser } = user;
        return publicUser;
    }

    async findTipoId(tipo) {
        if (Number.isInteger(Number(tipo))) {
            return Number(tipo);
        }

        const { rows } = await pool.query(
            'SELECT id_tipo FROM tipo_usuario WHERE LOWER(tipo) = LOWER($1)',
            [tipo.trim()]
        );

        if (!rows[0]) {
            throw new Error('TIPO_USUARIO_NOT_FOUND');
        }

        return rows[0].id_tipo;
    }

    async create({ nome_usuario, senha, tipo, status }) {
        validarDadosUsuario({ nome_usuario, senha, tipo, status });

        const tipoId = await this.findTipoId(tipo);

        const { rows } = await pool.query(`
            INSERT INTO usuarios (nome_usuario, senha, tipo, status)
            VALUES ($1, $2, $3, $4)
            RETURNING id_user
        `, [
            nome_usuario.trim(),
            senha,
            tipoId,
            status ? status.trim() : 'ativo'
        ]);

        return this.findPublicById(rows[0].id_user);
    }

    async update(id, { nome_usuario, senha, tipo, status }) {
        validarId(id);
        validarDadosUsuario({ nome_usuario, senha, tipo, status });

        const currentUser = await this.findById(id);

        if (!currentUser) {
            return null;
        }

        const tipoId = await this.findTipoId(tipo);

        const { rows } = await pool.query(`
            UPDATE usuarios
            SET nome_usuario = $1,
                senha = $2,
                tipo = $3,
                status = $4
            WHERE id_user = $5
            RETURNING id_user
        `, [
            nome_usuario.trim(),
            senha,
            tipoId,
            status ? status.trim() : currentUser.status,
            id
        ]);

        if (!rows[0]) {
            return null;
        }

        return this.findPublicById(rows[0].id_user);
    }

    async updatePartial(id, data) {
        validarId(id);

        if (!Object.keys(data).length) {
            throw new ValidationError('Informe ao menos um campo');
        }

        validarDadosUsuario(data, true);

        const currentUser = await this.findById(id);

        if (!currentUser) {
            return null;
        }

        return this.update(id, {
            nome_usuario: data.nome_usuario ?? currentUser.nome_usuario,
            senha: data.senha ?? currentUser.senha,
            tipo: data.tipo ?? currentUser.tipo,
            status: data.status ?? currentUser.status
        });
    }

    async deletar(id) {
        validarId(id);

        const { rowCount } = await pool.query(
            'DELETE FROM usuarios WHERE id_user = $1',
            [id]
        );

        return rowCount > 0;
    }
};
