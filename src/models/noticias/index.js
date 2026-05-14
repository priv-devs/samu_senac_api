const pool = require('../../database');

class ValidationError extends Error {
    constructor(message, erros = []) {
        super(message);
        this.name = 'ValidationError';
        this.erros = erros;
    }
}

const CATEGORIAS = ['principal', 'secundaria', 'diaria'];
const idValido = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

function validarId(id) {
    if (!idValido(id)) {
        throw new ValidationError('id de noticia invalido');
    }
}

function validarCategoria(categoria) {
    if (!CATEGORIAS.includes(categoria)) {
        throw new ValidationError('categoria invalida');
    }
}

function normalizarPaginacao({ pagina = 1, por_pagina, limite } = {}) {
    const page = Number(pagina) > 0 ? Number(pagina) : 1;
    const perPage = Number(por_pagina || limite) > 0 ? Number(por_pagina || limite) : 10;

    return {
        limit: perPage,
        offset: (page - 1) * perPage
    };
}

function validarNoticia(dados, parcial = false) {
    const erros = [];

    if (!parcial || dados.titulo !== undefined) {
        if (dados.titulo !== undefined && dados.titulo !== null && typeof dados.titulo !== 'string') {
            erros.push('titulo deve ser texto');
        } else if (dados.titulo && dados.titulo.trim().length > 150) {
            erros.push('titulo deve ter no maximo 150 caracteres');
        }
    }

    if (!parcial || dados.resumo !== undefined) {
        if (!dados.resumo || typeof dados.resumo !== 'string') {
            erros.push('resumo e obrigatorio');
        }
    }

    ['imagem', 'banner', 'conteudo', 'link'].forEach((campo) => {
        if (dados[campo] !== undefined && dados[campo] !== null && typeof dados[campo] !== 'string') {
            erros.push(`${campo} deve ser texto`);
        }
    });

    if (dados.categoria !== undefined) {
        validarCategoria(dados.categoria);
    }

    if (erros.length) {
        throw new ValidationError('Dados invalidos', erros);
    }
}

function normalizarNoticia(dados, categoriaPadrao) {
    return {
        titulo: dados.titulo ? dados.titulo.trim() : null,
        resumo: dados.resumo.trim(),
        imagem: dados.imagem ? dados.imagem.trim() : null,
        banner: dados.banner ? dados.banner.trim() : null,
        conteudo: dados.conteudo ? dados.conteudo.trim() : null,
        link: dados.link ? dados.link.trim() : null,
        categoria: dados.categoria || categoriaPadrao || 'diaria'
    };
}

module.exports = class Noticias {
    async findAll(filtros = {}) {
        const { limit, offset } = normalizarPaginacao(filtros);
        const params = [limit, offset];
        let where = '';

        if (filtros.categoria) {
            validarCategoria(filtros.categoria);
            params.push(filtros.categoria);
            where = `WHERE categoria = $${params.length}`;
        }

        const { rows } = await pool.query(`
            SELECT
                id_noticia,
                titulo,
                resumo,
                imagem,
                banner,
                conteudo,
                link,
                categoria,
                data
            FROM noticias
            ${where}
            ORDER BY data DESC, id_noticia DESC
            LIMIT $1 OFFSET $2
        `, params);

        return rows;
    }

    async findPrincipal() {
        const { rows } = await pool.query(`
            SELECT
                id_noticia,
                titulo,
                resumo,
                COALESCE(banner, imagem) AS imagem,
                data
            FROM noticias
            WHERE categoria = 'principal'
            ORDER BY data DESC, id_noticia DESC
            LIMIT 1
        `);

        return rows[0] || null;
    }

    async findById(id) {
        validarId(id);

        const { rows } = await pool.query(`
            SELECT
                id_noticia,
                titulo,
                resumo,
                imagem,
                banner,
                conteudo,
                link,
                categoria,
                data
            FROM noticias
            WHERE id_noticia = $1
        `, [id]);

        return rows[0] || null;
    }

    async create(data, categoriaPadrao = 'diaria') {
        validarNoticia({ ...data, categoria: data.categoria || categoriaPadrao });
        const noticia = normalizarNoticia(data, categoriaPadrao);

        const { rows } = await pool.query(`
            INSERT INTO noticias (titulo, resumo, imagem, banner, conteudo, link, categoria)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_noticia
        `, [
            noticia.titulo,
            noticia.resumo,
            noticia.imagem,
            noticia.banner,
            noticia.conteudo,
            noticia.link,
            noticia.categoria
        ]);

        return this.findById(rows[0].id_noticia);
    }

    async update(id, data, categoriaPadrao = 'diaria') {
        validarId(id);
        validarNoticia({ ...data, categoria: data.categoria || categoriaPadrao });

        const currentNoticia = await this.findById(id);

        if (!currentNoticia) {
            return null;
        }

        const noticia = normalizarNoticia(data, categoriaPadrao);

        const { rows } = await pool.query(`
            UPDATE noticias
            SET titulo = $1,
                resumo = $2,
                imagem = $3,
                banner = $4,
                conteudo = $5,
                link = $6,
                categoria = $7
            WHERE id_noticia = $8
            RETURNING id_noticia
        `, [
            noticia.titulo,
            noticia.resumo,
            noticia.imagem,
            noticia.banner,
            noticia.conteudo,
            noticia.link,
            noticia.categoria,
            id
        ]);

        return this.findById(rows[0].id_noticia);
    }

    async updatePartial(id, data) {
        validarId(id);

        if (!Object.keys(data).length) {
            throw new ValidationError('Informe ao menos um campo');
        }

        validarNoticia(data, true);

        const currentNoticia = await this.findById(id);

        if (!currentNoticia) {
            return null;
        }

        return this.update(id, {
            titulo: data.titulo ?? currentNoticia.titulo,
            resumo: data.resumo ?? currentNoticia.resumo,
            imagem: data.imagem ?? currentNoticia.imagem,
            banner: data.banner ?? currentNoticia.banner,
            conteudo: data.conteudo ?? currentNoticia.conteudo,
            link: data.link ?? currentNoticia.link,
            categoria: data.categoria ?? currentNoticia.categoria
        }, currentNoticia.categoria);
    }

    async deletar(id) {
        validarId(id);

        const { rowCount } = await pool.query(
            'DELETE FROM noticias WHERE id_noticia = $1',
            [id]
        );

        return rowCount > 0;
    }
};
