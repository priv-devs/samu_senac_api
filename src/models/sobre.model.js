// src/models/sobre.model.js

// ── Dados mockados (substitua por queries reais ao conectar o banco) ──
const db = {
  trajetoria: [
    {
      id: 1,
      tag: 'Nossa trajetória',
      titulo: 'Breve histórico',
      descricao:
        'O SAMU de Dourados atua há anos no atendimento à população de Dourados e região, integrando redes de saúde e atendendo casos clínicos, traumáticos e pediátricos.',
    },
  ],
  equipe: [
    {
      id: 1,
      tag: 'Equipe',
      titulo: 'Profissionais em campo',
      descricao:
        'Equipes compostas por condutor socorrista, técnico de enfermagem e enfermeiro, treinadas para atendimento de urgência e reanimação.',
    },
  ],
  cardsEquipe: [
    { id: 1, titulo: 'Coordenação', descricao: 'Responsável pela gestão e integração com a rede de saúde local.' },
    { id: 2, titulo: 'Enfermagem',  descricao: 'Enfermeiros especializados em emergência e suporte avançado.' },
    { id: 3, titulo: 'Técnicos',    descricao: 'Técnicos em enfermagem e condutores socorristas capacitados.' },
    { id: 4, titulo: 'Comunicação', descricao: 'Central de regulação médica e recepção das chamadas 192.' },
  ],
};

// ── Trajetória ────────────────────────────────────────────────

const getTrajetoria = () => db.trajetoria[0] ?? null;

const createTrajetoria = ({ tag, titulo, descricao }) => {
  const novo = { id: db.trajetoria.length + 1, tag, titulo, descricao };
  db.trajetoria.push(novo);
  return novo;
};

const updateTrajetoria = (id, { tag, titulo, descricao }) => {
  const item = db.trajetoria.find((t) => t.id === id);
  if (!item) return null;
  item.tag       = tag;
  item.titulo    = titulo;
  item.descricao = descricao;
  return item;
};

const patchTrajetoria = (id, campos) => {
  const item = db.trajetoria.find((t) => t.id === id);
  if (!item) return null;
  Object.assign(item, campos);
  return item;
};

const deleteTrajetoria = (id) => {
  const index = db.trajetoria.findIndex((t) => t.id === id);
  if (index === -1) return false;
  db.trajetoria.splice(index, 1);
  return true;
};

// ── Equipe — seção institucional ──────────────────────────────

const getEquipe = () => db.equipe[0] ?? null;

const createEquipe = ({ tag, titulo, descricao }) => {
  const novo = { id: db.equipe.length + 1, tag, titulo, descricao };
  db.equipe.push(novo);
  return novo;
};

const updateEquipe = (id, { tag, titulo, descricao }) => {
  const item = db.equipe.find((e) => e.id === id);
  if (!item) return null;
  item.tag       = tag;
  item.titulo    = titulo;
  item.descricao = descricao;
  return item;
};

const patchEquipe = (id, campos) => {
  const item = db.equipe.find((e) => e.id === id);
  if (!item) return null;
  Object.assign(item, campos);
  return item;
};

const deleteEquipe = (id) => {
  const index = db.equipe.findIndex((e) => e.id === id);
  if (index === -1) return false;
  db.equipe.splice(index, 1);
  return true;
};

// ── Cards da equipe ───────────────────────────────────────────

const getCardsEquipe = () => db.cardsEquipe;

const getCardEquipeById = (id) => db.cardsEquipe.find((c) => c.id === id) ?? null;

const createCardEquipe = ({ titulo, descricao }) => {
  const nextId = db.cardsEquipe.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  const novo = { id: nextId, titulo, descricao };
  db.cardsEquipe.push(novo);
  return novo;
};

const updateCardEquipe = (id, { titulo, descricao }) => {
  const card = db.cardsEquipe.find((c) => c.id === id);
  if (!card) return null;
  card.titulo    = titulo;
  card.descricao = descricao;
  return card;
};

const patchCardEquipe = (id, campos) => {
  const card = db.cardsEquipe.find((c) => c.id === id);
  if (!card) return null;
  Object.assign(card, campos);
  return card;
};

const deleteCardEquipe = (id) => {
  const index = db.cardsEquipe.findIndex((c) => c.id === id);
  if (index === -1) return false;
  db.cardsEquipe.splice(index, 1);
  return true;
};

module.exports = {
  getTrajetoria,
  createTrajetoria,
  updateTrajetoria,
  patchTrajetoria,
  deleteTrajetoria,
  getEquipe,
  createEquipe,
  updateEquipe,
  patchEquipe,
  deleteEquipe,
  getCardsEquipe,
  getCardEquipeById,
  createCardEquipe,
  updateCardEquipe,
  patchCardEquipe,
  deleteCardEquipe,
};
