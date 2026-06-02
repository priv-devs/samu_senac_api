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
        } else if (typeof dados.embed_url === 'string' && dados.embed_url.trim() !== '') {
            try {
                new URL(dados.embed_url);
            } catch (e) {
                erros.push('embed_url deve ser uma URL valida');
            }
        }
    }
    
    if (!parcial || dados.endereco !== undefined) {
        if (dados.endereco !== undefined && typeof dados.endereco !== 'string') {
            erros.push('endereco deve ser texto');
        } else if (typeof dados.endereco === 'string' && dados.endereco.trim().length > 200) {
            erros.push('endereco deve ter no maximo 200 caracteres');
        }
    }
    
    if (dados.latitude !== undefined) {
        if (typeof dados.latitude !== 'number' || Number.isNaN(dados.latitude)) {
            erros.push('latitude deve ser numerico');
        } else if (dados.latitude < -90 || dados.latitude > 90) {
            erros.push('latitude deve estar entre -90 e 90');
        }
    }

    if (dados.longitude !== undefined) {
        if (typeof dados.longitude !== 'number' || Number.isNaN(dados.longitude)) {
            erros.push('longitude deve ser numerico');
        } else if (dados.longitude < -180 || dados.longitude > 180) {
            erros.push('longitude deve estar entre -180 e 180');
        }
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

        
        const payload = {};
        if (Object.prototype.hasOwnProperty.call(data, 'embed_url')) payload.embedUrl = data.embed_url && data.embed_url.trim() !== '' ? data.embed_url.trim() : null;
        if (Object.prototype.hasOwnProperty.call(data, 'endereco')) payload.endereco = data.endereco && data.endereco.trim() !== '' ? data.endereco.trim() : null;
        if (Object.prototype.hasOwnProperty.call(data, 'latitude')) payload.latitude = data.latitude !== undefined ? data.latitude : null;
        if (Object.prototype.hasOwnProperty.call(data, 'longitude')) payload.longitude = data.longitude !== undefined ? data.longitude : null;

        const existing = await prisma.mapa.findFirst({ select: { id: true } });
        if (existing) {
            await prisma.mapa.update({ where: { id: existing.id }, data: payload });
            return this.get();
        }

        await prisma.mapa.create({ data: payload, select: { id: true } });
        return this.get();
    }
};
