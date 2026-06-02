const prisma = require('../../prisma/client');

class ValidationError extends Error {
  constructor(message, erros = []) {
    super(message);
    this.name = 'ValidationError';
    this.erros = erros;
  }
}

function validarCurso(dados) {
  const erros = [];
  if (!dados || typeof dados !== 'object') erros.push('dados invalidos');
  if (!dados.title || typeof dados.title !== 'string') erros.push('title e obrigatorio');
  if (dados.title && dados.title.trim().length > 150) erros.push('title deve ter no maximo 150 caracteres');
  if (dados.status && typeof dados.status !== 'string') erros.push('status deve ser texto');
  if (erros.length) throw new ValidationError('Dados invalidos', erros);
}

module.exports = class CoursesModel {
  async findAll() {
    const rows = await prisma.course.findMany({ select: { idCourse: true, title: true, status: true, createdAt: true } });
    return rows.map(r => ({ id: r.idCourse, title: r.title, status: r.status }));
  }

  async findById(id) {
    const r = await prisma.course.findUnique({ where: { idCourse: Number(id) } });
    if (!r) return null;
    return { id: r.idCourse, title: r.title, description: r.description, thumbnail: r.thumbnail, status: r.status, duration: r.duration, level: r.level };
  }

  async create(data) {
    validarCurso(data);
    const created = await prisma.course.create({ data: { title: data.title.trim(), description: data.description || null, thumbnail: data.thumbnail || null, status: data.status || 'Rascunho', duration: data.duration || null, level: data.level || null }, select: { idCourse: true } });
    return this.findById(created.idCourse);
  }

  async update(id, data) {
    validarCurso(data);
    const current = await this.findById(id);
    if (!current) return null;
    await prisma.course.update({ where: { idCourse: Number(id) }, data: { title: data.title.trim(), description: data.description || null, thumbnail: data.thumbnail || null, status: data.status || 'Rascunho', duration: data.duration || null, level: data.level || null } });
    return this.findById(id);
  }

  async deletar(id) {
    const deleted = await prisma.course.deleteMany({ where: { idCourse: Number(id) } });
    return deleted.count > 0;
  }
};
