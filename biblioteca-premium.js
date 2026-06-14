const fallbackItems = [
  {
    title: 'A Cripta dos Sete Juramentos',
    type: 'ADVENTURE',
    system: 'D&D 5e',
    levelRange: '3-5',
    theme: 'Dungeon sombria',
    description: 'One-shot premium com cenas, NPCs, armadilhas, encontros e estrutura pronta para Foundry.',
    tags: ['one-shot', 'dungeon', 'foundry'],
    isPremium: true,
    price: 29.9
  },
  {
    title: 'Mercador de Relíquias de Amn',
    type: 'NPC',
    system: 'D&D 5e',
    levelRange: '1-10',
    theme: 'Intriga urbana',
    description: 'NPC com personalidade, segredo, falas prontas e ganchos para campanhas urbanas.',
    tags: ['npc', 'amn', 'intriga'],
    isPremium: false,
    price: 0
  },
  {
    title: 'Bundle Ruínas Esquecidas',
    type: 'FOUNDRY_BUNDLE',
    system: 'D&D 5e',
    levelRange: '5-10',
    theme: 'Exploração',
    description: 'Pacote com cenas, journal entries e metadados para importação futura no Foundry.',
    tags: ['foundry', 'mapas', 'journal'],
    isPremium: true,
    price: 49.9
  }
];

function typeLabel(type) {
  const labels = {
    ADVENTURE: 'Aventura', NPC: 'NPC', MAP: 'Mapa', TOKEN: 'Token', LOOT: 'Loot', FOUNDRY_BUNDLE: 'Foundry Bundle', COURSE: 'Curso'
  };
  return labels[type] || type;
}

function renderLibrary(items) {
  const grid = document.getElementById('libraryGrid');
  if (!items.length) {
    grid.innerHTML = '<div class="notice-card">Nenhum item encontrado.</div>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <article class="premium-card">
      <span class="pill">${typeLabel(item.type)}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="premium-meta">
        <span>${item.system || 'D&D 5e'}</span>
        <span>${item.levelRange || 'Todos os níveis'}</span>
        <span>${item.theme || 'Fantasia'}</span>
      </div>
      <div class="premium-tags">${(item.tags || []).map(tag => `<small>#${tag}</small>`).join('')}</div>
      <strong>${item.isPremium ? `R$ ${Number(item.price || 0).toFixed(2)}` : 'Grátis'}</strong>
    </article>
  `).join('');
}

async function loadLibrary() {
  const params = new URLSearchParams();
  const search = document.getElementById('librarySearch').value.trim();
  const type = document.getElementById('libraryType').value;
  const premium = document.getElementById('libraryPremium').value;
  if (search) params.set('search', search);
  if (type) params.set('type', type);
  if (premium) params.set('premium', premium);

  try {
    const query = params.toString() ? `?${params.toString()}` : '';
    const items = await MestreOrcApi.get(`/library${query}`);
    document.getElementById('libraryStatus').textContent = 'Biblioteca carregada pela API.';
    renderLibrary(items);
  } catch (error) {
    document.getElementById('libraryStatus').textContent = `Modo local: ${error.message}`;
    let items = fallbackItems;
    if (search) items = items.filter(item => `${item.title} ${item.description}`.toLowerCase().includes(search.toLowerCase()));
    if (type) items = items.filter(item => item.type === type);
    if (premium) items = items.filter(item => String(item.isPremium) === premium);
    renderLibrary(items);
  }
}

document.getElementById('libraryFilters').addEventListener('submit', (event) => {
  event.preventDefault();
  loadLibrary();
});

loadLibrary();
