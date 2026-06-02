const prisma = require('../../prisma/client');

class ValidationError extends Error {
    constructor(message, erros = []) {
        super(message);
        this.name = 'ValidationError';
        this.erros = erros;
    }
}

function validarDados(dados, parcial = false) {
    const erros = [];

    if (!parcial || dados.embed_url !== undefined) {
        if (dados.embed_url !== undefined && typeof dados.embed_url !== 'string') {
            erros.push('embed_url deve ser texto');
        }
    }

    if (!parcial || dados.endereco !== undefined) {
        if (dados.endereco !== undefined && typeof dados.endereco !== 'string') {
            erros.push('endereco deve ser texto');
        }
    }

    if (dados.latitude !== undefined && typeof dados.latitude !== 'number') {
        erros.push('latitude deve ser numerico');
    }

    if (dados.longitude !== undefined && typeof dados.longitude !== 'number') {
        erros.push('longitude deve ser numerico');
    }

    if (erros.length) throw new ValidationError('Dados invalidos', erros);
}

module.exports = class MapaModel {
    async get() {
        const r = await prisma.mapa.findFirst({ select: { id: true, embedUrl: true, endereco: true, latitude: true, longitude: true } });
        if (!r) return null;
        return {
            embed_url: r.embedUrl,
            endereco: r.endereco,
            latitude: r.latitude,
            longitude: r.longitude
        };
    }

    async upsert(data) {
        validarDados(data, true);
 
        const existing = await prisma.mapa.findFirst({ select: { id: true } });
        if (existing) {
            const updated = await prisma.mapa.updateMany({ where: { id: existing.id }, data: {
                embedUrl: data.embed_url !== undefined ? data.embed_url : undefined,
                endereco: data.endereco !== undefined ? data.endereco : undefined,
                latitude: data.latitude !== undefined ? data.latitude : undefined,
                longitude: data.longitude !== undefined ? data.longitude : undefined
            }});
            return this.get();
        }

        const created = await prisma.mapa.create({ data: {
            embedUrl: data.embed_url || null,
            endereco: data.endereco || null,
            latitude: data.latitude !== undefined ? data.latitude : null,
            longitude: data.longitude !== undefined ? data.longitude : null
        }, select: { id: true } });

        return this.get();
    }
};
