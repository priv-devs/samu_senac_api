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

        const n = await prisma.noticia.findFirst({
            where: { idNoticia: Number(id), categoria: 'diaria' },
            select: {
                idNoticia: true,
                titulo: true,
                resumo: true,
                imagem: true,
                banner: true,
                conteudo: true,
                link: true,
                categoria: true,
                data: true
            }
        });

        if (!n) return null;
        return {
            id_noticia: n.idNoticia,
            titulo: n.titulo,
            resumo: n.resumo,
            imagem: n.imagem,
            banner: n.banner,
            conteudo: n.conteudo,
            link: n.link,
            categoria: n.categoria,
            data: n.data
        };
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
            data_desc: [{ data: 'desc' }, { idNoticia: 'desc' }],
            data_asc: [{ data: 'asc' }, { idNoticia: 'asc' }],
            titulo_asc: [{ titulo: 'asc' }],
            titulo_desc: [{ titulo: 'desc' }]
        };

        if (!ordenacoes[ordenar]) {
            throw new ValidationError('ordenar invalido');
        }

        const offset = (paginaNumero - 1) * porPaginaNumero;

        const rows = await prisma.noticia.findMany({
            where: { categoria: 'diaria' },
            orderBy: ordenacoes[ordenar],
            skip: offset,
            take: porPaginaNumero,
            select: { idNoticia: true, titulo: true, resumo: true, banner: true, data: true }
        });

        return rows.map((n) => ({
            id_noticia: n.idNoticia,
            titulo: n.titulo,
            resumo: n.resumo,
            banner: n.banner,
            data: n.data
        }));
    }

    async findById(id) {
        const noticia = await this.findRowById(id);
        return formatarNoticia(noticia);
    }

    async create({ titulo, resumo, banner, conteudo, imagem = null, link = null }) {
        validarNoticia({ titulo, resumo, banner, conteudo, imagem, link });

        const created = await prisma.noticia.create({
            data: {
                titulo: titulo.trim(),
                resumo: resumo.trim(),
                banner: banner.trim(),
                conteudo: conteudo.trim(),
                categoria: 'diaria',
                imagem: imagem ? imagem.trim() : null,
                link: link ? link.trim() : null
            },
            select: { idNoticia: true }
        });

        return this.findById(created.idNoticia);
    }

    async update(id, { titulo, resumo, banner, conteudo, imagem = null, link = null }) {
        validarId(id);
        validarNoticia({ titulo, resumo, banner, conteudo, imagem, link });

        const updated = await prisma.noticia.updateMany({
            where: { idNoticia: Number(id), categoria: 'diaria' },
            data: {
                titulo: titulo.trim(),
                resumo: resumo.trim(),
                banner: banner.trim(),
                conteudo: conteudo.trim(),
                imagem: imagem ? imagem.trim() : null,
                link: link ? link.trim() : null
            }
        });

        if (updated.count === 0) return null;
        return this.findById(id);
    }

    async updatePartial(id, data) {
        validarId(id);

        if (!Object.keys(data).length) {
            throw new ValidationError('Informe ao menos um campo');
        }

        validarNoticia(data, true);

        const currentNoticia = await this.findRowById(id);
        if (!currentNoticia) return null;

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

        const deleted = await prisma.noticia.deleteMany({ where: { idNoticia: Number(id), categoria: 'diaria' } });
        return deleted.count > 0;
    }
};
