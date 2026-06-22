// src/models/sobre/index.js

const pool = require('../../database');

module.exports = class Sobre {

  // ── Trajetória ────────────────────────────────────────────────

  async getTrajetoria() {
    const { rows } = await pool.query(
      'SELECT id, tag, titulo, descricao FROM sobre_trajetoria LIMIT 1'
    );
    return rows[0] || null;
  }

  async createTrajetoria({ tag, titulo, descricao }) {
    const { rows } = await pool.query(
      'INSERT INTO sobre_trajetoria (tag, titulo, descricao) VALUES ($1, $2, $3) RETURNING *',
      [tag, titulo, descricao]
    );
    return rows[0];
  }

  async updateTrajetoria(id, { tag, titulo, descricao }) {
    const { rows } = await pool.query(
      'UPDATE sobre_trajetoria SET tag=$1, titulo=$2, descricao=$3 WHERE id=$4 RETURNING *',
      [tag, titulo, descricao, id]
    );
    return rows[0] || null;
  }

  async patchTrajetoria(id, campos) {
    const atual = await pool.query('SELECT * FROM sobre_trajetoria WHERE id=$1', [id]);
    if (!atual.rows[0]) return null;
    const base = atual.rows[0];
    return this.updateTrajetoria(id, {
      tag:      campos.tag      ?? base.tag,
      titulo:   campos.titulo   ?? base.titulo,
      descricao: campos.descricao ?? base.descricao,
    });
  }

  async deleteTrajetoria(id) {
    const { rowCount } = await pool.query('DELETE FROM sobre_trajetoria WHERE id=$1', [id]);
    return rowCount > 0;
  }

  // ── Equipe — seção institucional ──────────────────────────────

  async getEquipe() {
    const { rows } = await pool.query(
      'SELECT id, tag, titulo, descricao FROM sobre_equipe LIMIT 1'
    );
    return rows[0] || null;
  }

  async createEquipe({ tag, titulo, descricao }) {
    const { rows } = await pool.query(
      'INSERT INTO sobre_equipe (tag, titulo, descricao) VALUES ($1, $2, $3) RETURNING *',
      [tag, titulo, descricao]
    );
    return rows[0];
  }

  async updateEquipe(id, { tag, titulo, descricao }) {
    const { rows } = await pool.query(
      'UPDATE sobre_equipe SET tag=$1, titulo=$2, descricao=$3 WHERE id=$4 RETURNING *',
      [tag, titulo, descricao, id]
    );
    return rows[0] || null;
  }

  async patchEquipe(id, campos) {
    const atual = await pool.query('SELECT * FROM sobre_equipe WHERE id=$1', [id]);
    if (!atual.rows[0]) return null;
    const base = atual.rows[0];
    return this.updateEquipe(id, {
      tag:      campos.tag      ?? base.tag,
      titulo:   campos.titulo   ?? base.titulo,
      descricao: campos.descricao ?? base.descricao,
    });
  }

  async deleteEquipe(id) {
    const { rowCount } = await pool.query('DELETE FROM sobre_equipe WHERE id=$1', [id]);
    return rowCount > 0;
  }

  // ── Cards da equipe ───────────────────────────────────────────

  async getCardsEquipe() {
    const { rows } = await pool.query(
      'SELECT id, titulo, descricao FROM sobre_cards_equipe ORDER BY id'
    );
    return rows;
  }

  async getCardEquipeById(id) {
    const { rows } = await pool.query(
      'SELECT id, titulo, descricao FROM sobre_cards_equipe WHERE id=$1',
      [id]
    );
    return rows[0] || null;
  }

  async createCardEquipe({ titulo, descricao }) {
    const { rows } = await pool.query(
      'INSERT INTO sobre_cards_equipe (titulo, descricao) VALUES ($1, $2) RETURNING *',
      [titulo, descricao]
    );
    return rows[0];
  }

  async updateCardEquipe(id, { titulo, descricao }) {
    const { rows } = await pool.query(
      'UPDATE sobre_cards_equipe SET titulo=$1, descricao=$2 WHERE id=$3 RETURNING *',
      [titulo, descricao, id]
    );
    return rows[0] || null;
  }

  async patchCardEquipe(id, campos) {
    const card = await this.getCardEquipeById(id);
    if (!card) return null;
    return this.updateCardEquipe(id, {
      titulo:   campos.titulo   ?? card.titulo,
      descricao: campos.descricao ?? card.descricao,
    });
  }

  async deleteCardEquipe(id) {
    const { rowCount } = await pool.query('DELETE FROM sobre_cards_equipe WHERE id=$1', [id]);
    return rowCount > 0;
  }
};
