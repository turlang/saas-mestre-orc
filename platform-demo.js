/*
 * Fase 1 - Simulação de plataforma
 * Este arquivo não substitui backend real. Ele cria uma experiência de produto
 * com localStorage e deixa o front preparado para integração futura com API.
 */
const MestreOrcPlatform = (() => {
  const storageKey = 'mestreOrcDemoUser';

  const demoData = {
    revenue: 1850,
    players: 18,
    openSlots: 7,
    activeCampaigns: 4,
    sessionsThisMonth: 9,
    pendingSheets: 3,
    campaigns: [
      { name: 'Sombras Sobre Corval', status: 'Em andamento', players: 5, revenue: 750, day: 'Quintas', foundry: 'Preparado' },
      { name: 'A Fúria Verde', status: 'Captando jogadores', players: 2, revenue: 300, day: 'Domingo', foundry: 'Pendente' },
      { name: 'Intrigas em Amn', status: 'Preparação', players: 4, revenue: 500, day: 'Segundas', foundry: 'Preparado' },
      { name: 'Contrabando nos Esgotos', status: 'Vagas abertas', players: 3, revenue: 300, day: 'Sábado', foundry: 'Pendente' }
    ],
    playersList: [
      { name: 'Rafael', character: 'Guerreiro nível 5', payment: 'Confirmado', sheet: 'Ok' },
      { name: 'Marina', character: 'Clériga nível 4', payment: 'Confirmado', sheet: 'Pendente' },
      { name: 'Bruno', character: 'Ladino nível 5', payment: 'Pendente', sheet: 'Ajustar história' },
      { name: 'Camila', character: 'Maga nível 3', payment: 'Confirmado', sheet: 'Ok' }
    ]
  };

  function saveUser(user) {
    localStorage.setItem(storageKey, JSON.stringify(user));
  }

  function getUser() {
    try { return JSON.parse(localStorage.getItem(storageKey)); }
    catch { return null; }
  }

  function bindAuthForms() {
    document.querySelectorAll('[data-auth-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const user = {
          name: formData.get('name') || 'Mestre Orc',
          email: formData.get('email'),
          role: formData.get('role') || 'master',
          createdAt: new Date().toISOString()
        };
        saveUser(user);
        window.location.href = './dashboard-mestre.html';
      });
    });
  }

  function renderDashboard() {
    const root = document.querySelector('[data-dashboard-root]');
    if (!root) return;

    const user = getUser() || { name: 'Mestre Orc', role: 'master', email: 'demo@mestreorc.com' };
    const roleLabel = { master: 'Mestre', player: 'Jogador', admin: 'Administrador' }[user.role] || 'Mestre';

    root.innerHTML = `
      <section class="dashboard-welcome glass-panel">
        <div>
          <p class="eyebrow">Sessão demo ativa</p>
          <h2>Bem-vindo, ${user.name}</h2>
          <p>Perfil: <strong>${roleLabel}</strong> • ${user.email || 'sem e-mail informado'}</p>
        </div>
        <a href="./auth.html" class="btn-cta btn-cta-secondary">Trocar Conta</a>
      </section>

      <section class="stats-grid phase1-stats">
        <article class="stat-card"><strong>${demoData.activeCampaigns}</strong><span>campanhas ativas</span></article>
        <article class="stat-card"><strong>${demoData.players}</strong><span>jogadores cadastrados</span></article>
        <article class="stat-card"><strong>${demoData.openSlots}</strong><span>vagas abertas</span></article>
        <article class="stat-card"><strong>R$ ${demoData.revenue.toLocaleString('pt-BR')}</strong><span>previsão mensal</span></article>
        <article class="stat-card"><strong>${demoData.sessionsThisMonth}</strong><span>sessões no mês</span></article>
        <article class="stat-card"><strong>${demoData.pendingSheets}</strong><span>fichas pendentes</span></article>
      </section>

      <section class="dashboard-grid">
        <div class="board-column">
          <h2>Campanhas</h2>
          ${demoData.campaigns.map(campaign => `
            <article class="manager-card">
              <h3>${campaign.name}</h3>
              <p>${campaign.day} • ${campaign.players} jogadores • R$ ${campaign.revenue}</p>
              <p>Foundry: ${campaign.foundry}</p>
              <span class="badge ${campaign.status.includes('Captando') || campaign.status.includes('Vagas') ? 'warning' : ''}">${campaign.status}</span>
            </article>
          `).join('')}
        </div>

        <div class="board-column">
          <h2>Jogadores</h2>
          ${demoData.playersList.map(player => `
            <article class="manager-card">
              <h3>${player.name}</h3>
              <p>${player.character}</p>
              <p>Pagamento: ${player.payment} • Ficha: ${player.sheet}</p>
              <span class="badge ${player.payment === 'Pendente' || player.sheet !== 'Ok' ? 'warning' : ''}">${player.payment === 'Pendente' || player.sheet !== 'Ok' ? 'Atenção' : 'Confirmado'}</span>
            </article>
          `).join('')}
        </div>

        <div class="board-column action-panel">
          <h2>Próximas ações</h2>
          <article class="manager-card"><h3>Conectar API</h3><p>Substituir localStorage por autenticação JWT e rotas protegidas.</p></article>
          <article class="manager-card"><h3>Criar coleções MongoDB</h3><p>Users, Campaigns, Sessions, Payments, Characters e Reviews.</p></article>
          <article class="manager-card"><h3>Finalizar reservas</h3><p>Salvar solicitação, pagamento e vaga em banco de dados real.</p></article>
          <article class="manager-card"><h3>Exportar para Foundry</h3><p>Enviar personagens, cenas e NPCs para a mesa configurada.</p></article>
        </div>
      </section>
    `;
  }

  function init() {
    bindAuthForms();
    renderDashboard();
  }

  return { init, demoData };
})();

document.addEventListener('DOMContentLoaded', MestreOrcPlatform.init);
