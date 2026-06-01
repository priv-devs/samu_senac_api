const prisma = require('../../prisma/client');

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

        const where = {};
        if (filtros.categoria) {
            validarCategoria(filtros.categoria);
            where.categoria = filtros.categoria;
        }

        const noticias = await prisma.noticia.findMany({
            where,
            orderBy: [{ data: 'desc' }, { idNoticia: 'desc' }],
            skip: offset,
            take: limit,
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

        // map to old snake_case keys
        return noticias.map((n) => ({
            id_noticia: n.idNoticia,
            titulo: n.titulo,
            resumo: n.resumo,
            imagem: n.imagem,
            banner: n.banner,
            conteudo: n.conteudo,
            link: n.link,
            categoria: n.categoria,
            data: n.data
        }));
    }

    async findPrincipal() {
        const n = await prisma.noticia.findFirst({
            where: { categoria: 'principal' },
            orderBy: [{ data: 'desc' }, { idNoticia: 'desc' }],
            select: {
                idNoticia: true,
                titulo: true,
                resumo: true,
                imagem: true,
                banner: true,
                data: true
            }
        });

        if (!n) return null;

        return {
            id_noticia: n.idNoticia,
            titulo: n.titulo,
            resumo: n.resumo,
            imagem: n.banner || n.imagem,
            data: n.data
        };
    }

    async findById(id) {
        validarId(id);

        const n = await prisma.noticia.findUnique({
            where: { idNoticia: Number(id) },
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

    async create(data, categoriaPadrao = 'diaria') {
        validarNoticia({ ...data, categoria: data.categoria || categoriaPadrao });
        const noticia = normalizarNoticia(data, categoriaPadrao);

        const created = await prisma.noticia.create({
            data: {
                titulo: noticia.titulo,
                resumo: noticia.resumo,
                imagem: noticia.imagem,
                banner: noticia.banner,
                conteudo: noticia.conteudo,
                link: noticia.link,
                categoria: noticia.categoria
            },
            select: { idNoticia: true }
        });

        return this.findById(created.idNoticia);
    }

    async update(id, data, categoriaPadrao = 'diaria') {
        validarId(id);
        validarNoticia({ ...data, categoria: data.categoria || categoriaPadrao });

        const currentNoticia = await this.findById(id);
        if (!currentNoticia) return null;

        const noticia = normalizarNoticia(data, categoriaPadrao);

        const updated = await prisma.noticia.updateMany({
            where: { idNoticia: Number(id) },
            data: {
                titulo: noticia.titulo,
                resumo: noticia.resumo,
                imagem: noticia.imagem,
                banner: noticia.banner,
                conteudo: noticia.conteudo,
                link: noticia.link,
                categoria: noticia.categoria
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

        const currentNoticia = await this.findById(id);
        if (!currentNoticia) return null;

        const merged = {
            titulo: data.titulo ?? currentNoticia.titulo,
            resumo: data.resumo ?? currentNoticia.resumo,
            imagem: data.imagem ?? currentNoticia.imagem,
            banner: data.banner ?? currentNoticia.banner,
            conteudo: data.conteudo ?? currentNoticia.conteudo,
            link: data.link ?? currentNoticia.link,
            categoria: data.categoria ?? currentNoticia.categoria
        };

        return this.update(id, merged, currentNoticia.categoria);
    }

    async deletar(id) {
        validarId(id);

        const deleted = await prisma.noticia.deleteMany({ where: { idNoticia: Number(id) } });
        return deleted.count > 0;
    }
};
