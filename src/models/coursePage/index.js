const prisma = require('../../prisma/client');

class ValidationError extends Error {
  constructor(message, erros = []) {
    super(message);
    this.name = 'ValidationError';
    this.erros = erros;
  }
}

function validarPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('payload invalido');
  }
}

module.exports = class CoursePageModel {
  async find() {
    const r = await prisma.coursePage.findFirst({ select: { idCoursePage: true, payload: true, createdAt: true, updatedAt: true } });
    if (!r) return null;
    return { id: r.idCoursePage, payload: r.payload, created_at: r.createdAt, updated_at: r.updatedAt };
  }

  async create(payload) {
    validarPayload(payload);
    const created = await prisma.coursePage.create({ data: { payload }, select: { idCoursePage: true } });
    return this.find();
  }

  async update(id, payload) {
    validarPayload(payload);
    const existing = await prisma.coursePage.findUnique({ where: { idCoursePage: Number(id) } });
    if (!existing) return null;
    await prisma.coursePage.update({ where: { idCoursePage: Number(id) }, data: { payload } });
    return this.find();
  }

  async updatePartial(id, partialPayload) {
    if (!partialPayload || typeof partialPayload !== 'object') throw new ValidationError('payload invalido');
    const existing = await prisma.coursePage.findUnique({ where: { idCoursePage: Number(id) } });
    if (!existing) return null;
    const merged = { ...existing.payload, ...partialPayload };
    await prisma.coursePage.update({ where: { idCoursePage: Number(id) }, data: { payload: merged } });
    return this.find();
  }

  async deletar(id) {
    const deleted = await prisma.coursePage.deleteMany({ where: { idCoursePage: Number(id) } });
    return deleted.count > 0;
  }
};
