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
        throw new ValidationError('id de curso invalido');
    }
}

function validarCurso(dados, parcial = false) {
    const erros = [];
    const camposPermitidos = ['title', 'description', 'thumbnail', 'status', 'duration', 'level'];

    Object.keys(dados).forEach((campo) => {
        if (!camposPermitidos.includes(campo)) {
            erros.push(`${campo} nao e um campo permitido`);
        }
    });

    if (!parcial || dados.title !== undefined) {
        if (!dados.title || typeof dados.title !== 'string') {
            erros.push('title e obrigatorio');
        } else if (dados.title.trim().length > 150) {
            erros.push('title deve ter no maximo 150 caracteres');
        }
    }

    ['description', 'thumbnail', 'status', 'duration', 'level'].forEach((campo) => {
        if (dados[campo] !== undefined && dados[campo] !== null && typeof dados[campo] !== 'string') {
            erros.push(`${campo} deve ser texto`);
        }
    });

    if (dados.status && dados.status.trim().length > 30) {
        erros.push('status deve ter no maximo 30 caracteres');
    }

    if (erros.length) {
        throw new ValidationError('Dados invalidos', erros);
    }
}

function limparTexto(valor) {
    return typeof valor === 'string' ? valor.trim() : valor;
}

function formatarCurso(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id_course,
        title: row.title,
        description: row.description,
        thumbnail: row.thumbnail,
        status: row.status,
        duration: row.duration,
        level: row.level,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

module.exports = class Courses {
    async findAll() {
        const { rows } = await pool.query(`
            SELECT id_course, title, description, thumbnail, status, duration, level, created_at, updated_at
            FROM courses
            ORDER BY id_course ASC
        `);

        return rows.map(formatarCurso);
    }

    async findById(id) {
        validarId(id);

        const { rows } = await pool.query(`
            SELECT id_course, title, description, thumbnail, status, duration, level, created_at, updated_at
            FROM courses
            WHERE id_course = $1
        `, [id]);

        return formatarCurso(rows[0]);
    }

    async create(data) {
        validarCurso(data);

        const { rows } = await pool.query(`
            INSERT INTO courses (title, description, thumbnail, status, duration, level)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_course
        `, [
            limparTexto(data.title),
            limparTexto(data.description) || null,
            limparTexto(data.thumbnail) || null,
            limparTexto(data.status) || 'Rascunho',
            limparTexto(data.duration) || null,
            limparTexto(data.level) || null
        ]);

        return this.findById(rows[0].id_course);
    }

    async update(id, data) {
        validarId(id);

        if (!Object.keys(data).length) {
            throw new ValidationError('Informe ao menos um campo');
        }

        validarCurso(data, true);

        const currentCourse = await this.findById(id);

        if (!currentCourse) {
            return null;
        }

        const curso = {
            title: data.title ?? currentCourse.title,
            description: data.description ?? currentCourse.description,
            thumbnail: data.thumbnail ?? currentCourse.thumbnail,
            status: data.status ?? currentCourse.status,
            duration: data.duration ?? currentCourse.duration,
            level: data.level ?? currentCourse.level
        };

        const { rows } = await pool.query(`
            UPDATE courses
            SET title = $1,
                description = $2,
                thumbnail = $3,
                status = $4,
                duration = $5,
                level = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_course = $7
            RETURNING id_course
        `, [
            limparTexto(curso.title),
            limparTexto(curso.description),
            limparTexto(curso.thumbnail),
            limparTexto(curso.status),
            limparTexto(curso.duration),
            limparTexto(curso.level),
            id
        ]);

        return this.findById(rows[0].id_course);
    }

    async deletar(id) {
        validarId(id);

        const { rowCount } = await pool.query(
            'DELETE FROM courses WHERE id_course = $1',
            [id]
        );

        return rowCount > 0;
    }
};
