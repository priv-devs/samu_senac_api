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
        throw new ValidationError('id de noticia invalido');
    }
}

function validarTexto(dados, campo, limite, erros, parcial) {
    if (!parcial || dados[campo] !== undefined) {
        if (!dados[campo] || typeof dados[campo] !== 'string') {
            erros.push(`${campo} e obrigatorio`);
        } else if (limite && dados[campo].trim().length > limite) {
            erros.push(`${campo} deve ter no maximo ${limite} caracteres`);
        }
    }
}

function validarNoticia(dados, parcial = false) {
    const erros = [];
    const camposPermitidos = ['titulo', 'resumo', 'banner', 'conteudo', 'imagem', 'link'];

    Object.keys(dados).forEach((campo) => {
        if (!camposPermitidos.includes(campo)) {
            erros.push(`${campo} nao e um campo permitido`);
        }
    });

    validarTexto(dados, 'titulo', 150, erros, parcial);
    validarTexto(dados, 'resumo', null, erros, parcial);
    validarTexto(dados, 'banner', null, erros, parcial);
    validarTexto(dados, 'conteudo', null, erros, parcial);

    if (dados.imagem !== undefined && dados.imagem !== null && typeof dados.imagem !== 'string') {
        erros.push('imagem deve ser texto');
    }

    if (dados.link !== undefined && dados.link !== null && typeof dados.link !== 'string') {
        erros.push('link deve ser texto');
    }

    if (erros.length) {
        throw new ValidationError('Dados invalidos', erros);
    }
}

function formatarNoticia(noticia) {
    if (!noticia) {
        return null;
    }

    return {
        id: noticia.id_noticia,
        titulo: noticia.titulo,
        resumo: noticia.resumo,
        banner: noticia.banner,
        conteudo: noticia.conteudo,
        categoria: noticia.categoria,
        data: noticia.data
    };
}

function formatarResumoNoticia(noticia) {
    if (!noticia) {
        return null;
    }

    return {
        id: noticia.id_noticia,
        titulo: noticia.titulo,
        resumo: noticia.resumo,
        banner: noticia.banner,
        data: noticia.data
    };
}

module.exports = class NoticiasDiarias {
    async findRowById(id) {
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
              AND categoria = 'diaria'
        `, [id]);

        return rows[0] || null;
    }

    async findAll({ pagina = 1, por_pagina = 10, ordenar = 'data_desc' } = {}) {
        const paginaNumero = Number(pagina);
        const porPaginaNumero = Number(por_pagina);

        if (!Number.isInteger(paginaNumero) || paginaNumero < 1) {
            throw new ValidationError('pagina invalida');
        }

        if (!Number.isInteger(porPaginaNumero) || porPaginaNumero < 1 || porPaginaNumero > 100) {
            throw new ValidationError('por_pagina invalido');
        }

        const ordenacoes = {
            data_desc: 'data DESC, id_noticia DESC',
            data_asc: 'data ASC, id_noticia ASC',
            titulo_asc: 'titulo ASC',
            titulo_desc: 'titulo DESC'
        };

        if (!ordenacoes[ordenar]) {
            throw new ValidationError('ordenar invalido');
        }

        const offset = (paginaNumero - 1) * porPaginaNumero;
        const { rows } = await pool.query(`
            SELECT
                id_noticia,
                titulo,
                resumo,
                banner,
                data
            FROM noticias
            WHERE categoria = 'diaria'
            ORDER BY ${ordenacoes[ordenar]}
            LIMIT $1 OFFSET $2
        `, [porPaginaNumero, offset]);

        return rows.map(formatarResumoNoticia);
    }

    async findById(id) {
        const noticia = await this.findRowById(id);
        return formatarNoticia(noticia);
    }

    async create({ titulo, resumo, banner, conteudo, imagem = null, link = null }) {
        validarNoticia({ titulo, resumo, banner, conteudo, imagem, link });

        const { rows } = await pool.query(`
            INSERT INTO noticias (titulo, resumo, banner, conteudo, categoria, imagem, link)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_noticia
        `, [
            titulo.trim(),
            resumo.trim(),
            banner.trim(),
            conteudo.trim(),
            'diaria',
            imagem ? imagem.trim() : null,
            link ? link.trim() : null
        ]);

        return this.findById(rows[0].id_noticia);
    }

    async update(id, { titulo, resumo, banner, conteudo, imagem = null, link = null }) {
        validarId(id);
        validarNoticia({ titulo, resumo, banner, conteudo, imagem, link });

        const { rows } = await pool.query(`
            UPDATE noticias
            SET titulo = $1,
                resumo = $2,
                banner = $3,
                conteudo = $4,
                imagem = $5,
                link = $6
            WHERE id_noticia = $7
              AND categoria = 'diaria'
            RETURNING id_noticia
        `, [
            titulo.trim(),
            resumo.trim(),
            banner.trim(),
            conteudo.trim(),
            imagem ? imagem.trim() : null,
            link ? link.trim() : null,
            id
        ]);

        if (!rows[0]) {
            return null;
        }

        return this.findById(rows[0].id_noticia);
    }

    async updatePartial(id, data) {
        validarId(id);

        if (!Object.keys(data).length) {
            throw new ValidationError('Informe ao menos um campo');
        }

        validarNoticia(data, true);

        const currentNoticia = await this.findRowById(id);

        if (!currentNoticia) {
            return null;
        }

        return this.update(id, {
            titulo: data.titulo ?? currentNoticia.titulo,
            resumo: data.resumo ?? currentNoticia.resumo,
            banner: data.banner ?? currentNoticia.banner,
            conteudo: data.conteudo ?? currentNoticia.conteudo,
            imagem: data.imagem ?? currentNoticia.imagem,
            link: data.link ?? currentNoticia.link
        });
    }

    async deletar(id) {
        validarId(id);

        const { rowCount } = await pool.query(
            "DELETE FROM noticias WHERE id_noticia = $1 AND categoria = 'diaria'",
            [id]
        );

        return rowCount > 0;
    }
};
