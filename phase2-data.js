/*
 * Fase 2 - Campanhas, Personagens e Reservas
 * Camada front-end com localStorage. A estrutura foi escrita para ser trocada
 * depois por chamadas REST/GraphQL sem alterar a experiência visual.
 */
const MestreOrcPhase2 = (() => {
  const key = 'mestreOrcPhase2Data';

  const seed = {
    campaigns: [
      {
        id: 'camp-corval',
        name: 'Sombras Sobre Corval',
        system: 'D&D 5e',
        levelRange: '3 ao 6',
        day: 'Quintas, 20h às 23h',
        seats: 5,
        filled: 4,
        price: 150,
        status: 'Em andamento',
        foundryWorld: 'sombras-corval',
        pitch: 'Mistério, horror medieval e investigação em uma cidade tomada por segredos.'
      },
      {
        id: 'camp-amn',
        name: 'Intrigas em Amn',
        system: 'D&D 5e',
        levelRange: '5 ao 8',
        day: 'Segundas, 20h às 23h',
        seats: 6,
        filled: 3,
        price: 180,
        status: 'Vagas abertas',
        foundryWorld: 'intrigas-amn',
        pitch: 'Política, guildas mercantes, assassinatos e escolhas difíceis na Costa da Espada.'
      },
      {
        id: 'camp-furia',
        name: 'A Fúria Verde',
        system: 'D&D 5e',
        levelRange: '1 ao 4',
        day: 'Domingos, 13h30 às 17h30',
        seats: 5,
        filled: 2,
        price: 120,
        status: 'Captando jogadores',
        foundryWorld: 'furia-verde',
        pitch: 'Aventura introdutória com exploração, combate tático e mistério em terras selvagens.'
      }
    ],
    characters: [
      { id: 'char-turlang', player: 'Rafael', name: 'Turlang', className: 'Ladino Fantasma', level: 5, campaign: 'Sombras Sobre Corval', status: 'Aprovado', notes: 'História vinculada a espíritos e dívidas antigas.' },
      { id: 'char-lyra', player: 'Marina', name: 'Lyra', className: 'Clériga da Luz', level: 4, campaign: 'Sombras Sobre Corval', status: 'Revisar ficha', notes: 'Falta revisar equipamentos e magias preparadas.' },
      { id: 'char-borin', player: 'Bruno', name: 'Borin', className: 'Guerreiro', level: 5, campaign: 'Intrigas em Amn', status: 'História pendente', notes: 'Precisa conectar origem ao conflito de Amn.' }
    ],
    reservations: [
      { id: 'res-001', player: 'Camila', contact: 'WhatsApp', campaign: 'Intrigas em Amn', seatType: 'Campanha mensal', payment: 'Sinal pendente', status: 'Aguardando pagamento' },
      { id: 'res-002', player: 'João', contact: 'Discord', campaign: 'A Fúria Verde', seatType: 'One-shot', payment: 'Confirmado', status: 'Confirmada' },
      { id: 'res-003', player: 'Fernanda', contact: 'WhatsApp', campaign: 'Sombras Sobre Corval', seatType: 'Campanha mensal', payment: 'Confirmado', status: 'Confirmada' }
    ]
  };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved && saved.campaigns ? saved : seed;
    } catch {
      return seed;
    }
  }

  function save(data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getData() {
    const data = load();
    save(data);
    return data;
  }

  function createId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  }

  function addCampaign(payload) {
    const data = getData();
    data.campaigns.unshift({ id: createId('camp'), filled: Number(payload.filled || 0), seats: Number(payload.seats || 5), price: Number(payload.price || 0), ...payload });
    save(data);
  }

  function addCharacter(payload) {
    const data = getData();
    data.characters.unshift({ id: createId('char'), level: Number(payload.level || 1), ...payload });
    save(data);
  }

  function addReservation(payload) {
    const data = getData();
    data.reservations.unshift({ id: createId('res'), ...payload });
    save(data);
  }

  function bindForm(selector, handler) {
    const form = document.querySelector(selector);
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(form).entries());
      handler(payload);
      form.reset();
      renderAll();
    });
  }

  function renderCampaigns() {
    const root = document.querySelector('[data-campaign-manager]');
    if (!root) return;
    const { campaigns } = getData();
    root.innerHTML = campaigns.map(campaign => {
      const available = Number(campaign.seats) - Number(campaign.filled);
      return `
        <article class="manager-card phase2-card">
          <div class="card-topline">
            <span class="badge ${available <= 1 ? 'warning' : ''}">${campaign.status}</span>
            <strong>${available} vagas</strong>
          </div>
          <h3>${campaign.name}</h3>
          <p>${campaign.pitch}</p>
          <div class="phase2-meta">
            <span>${campaign.system}</span>
            <span>Nível ${campaign.levelRange}</span>
            <span>${campaign.day}</span>
            <span>R$ ${Number(campaign.price).toLocaleString('pt-BR')}</span>
          </div>
          <p class="foundry-tag">Mundo Foundry: <strong>${campaign.foundryWorld}</strong></p>
        </article>`;
    }).join('');
  }

  function renderCharacters() {
    const root = document.querySelector('[data-character-manager]');
    if (!root) return;
    const { characters } = getData();
    root.innerHTML = characters.map(character => `
      <article class="manager-card phase2-card">
        <div class="card-topline">
          <span class="badge ${character.status !== 'Aprovado' ? 'warning' : ''}">${character.status}</span>
          <strong>Nível ${character.level}</strong>
        </div>
        <h3>${character.name}</h3>
        <p>${character.player} • ${character.className}</p>
        <p>Campanha: <strong>${character.campaign}</strong></p>
        <p>${character.notes}</p>
        <button class="btn-cta btn-cta-secondary small-action" type="button" data-export-character='${JSON.stringify(character).replace(/'/g, '&apos;')}'>Exportar JSON</button>
      </article>`).join('');
  }

  function renderReservations() {
    const root = document.querySelector('[data-reservation-manager]');
    if (!root) return;
    const { reservations } = getData();
    root.innerHTML = reservations.map(reservation => `
      <article class="manager-card phase2-card">
        <div class="card-topline">
          <span class="badge ${reservation.status !== 'Confirmada' ? 'warning' : ''}">${reservation.status}</span>
          <strong>${reservation.payment}</strong>
        </div>
        <h3>${reservation.player}</h3>
        <p>${reservation.campaign}</p>
        <p>${reservation.seatType} • Contato: ${reservation.contact}</p>
      </article>`).join('');
  }

  function renderDashboardSummary() {
    const root = document.querySelector('[data-phase2-summary]');
    if (!root) return;
    const data = getData();
    const seats = data.campaigns.reduce((sum, item) => sum + Number(item.seats || 0), 0);
    const filled = data.campaigns.reduce((sum, item) => sum + Number(item.filled || 0), 0);
    const revenue = data.campaigns.reduce((sum, item) => sum + (Number(item.filled || 0) * Number(item.price || 0)), 0);
    const confirmed = data.reservations.filter(item => item.status === 'Confirmada').length;
    root.innerHTML = `
      <article class="stat-card"><strong>${data.campaigns.length}</strong><span>campanhas gerenciadas</span></article>
      <article class="stat-card"><strong>${data.characters.length}</strong><span>personagens cadastrados</span></article>
      <article class="stat-card"><strong>${confirmed}/${data.reservations.length}</strong><span>reservas confirmadas</span></article>
      <article class="stat-card"><strong>${filled}/${seats}</strong><span>vagas preenchidas</span></article>
      <article class="stat-card"><strong>R$ ${revenue.toLocaleString('pt-BR')}</strong><span>receita por campanhas</span></article>
      <article class="stat-card"><strong>${seats - filled}</strong><span>vagas disponíveis</span></article>`;
  }

  function exportJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function bindExports() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-export-character]');
      if (!button) return;
      const data = JSON.parse(button.dataset.exportCharacter.replace(/&apos;/g, "'"));
      exportJson(data, `${data.name.toLowerCase().replace(/\s+/g, '-')}-foundry-ready.json`);
    });
  }

  function renderAll() {
    renderCampaigns();
    renderCharacters();
    renderReservations();
    renderDashboardSummary();
  }

  function init() {
    bindForm('[data-campaign-form]', addCampaign);
    bindForm('[data-character-form]', addCharacter);
    bindForm('[data-reservation-form]', addReservation);
    bindExports();
    renderAll();
  }

  return { init, getData, renderAll };
})();

window.MestreOrcPhase2 = MestreOrcPhase2;
document.addEventListener('DOMContentLoaded', MestreOrcPhase2.init);
