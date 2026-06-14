const form = document.querySelector('#orcAiForm');
const result = document.querySelector('#aiResult');
const downloadButton = document.querySelector('#downloadAdventure');
const downloadFoundryBundle = document.querySelector('#downloadFoundryBundle');
let currentAdventure = null;

function pick(list, indexSeed = 0) {
  return list[Math.abs(indexSeed) % list.length];
}

function buildAdventure({ theme, level, tone, villain, region = 'Amn', duration = 'one-shot de 4 horas' }) {
  const seed = `${theme}${level}${tone}${villain}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const threat = villain || 'ameaça desconhecida';
  const twist = pick([
    'o contratante está manipulando os dois lados',
    'a relíquia buscada é consciente e tenta escolher um portador',
    'um aliado dos personagens trabalha para a ameaça, mas por necessidade',
    'a vitória militar piora o problema político da região'
  ], seed);

  return {
    title: `Ecos de ${theme}`,
    system: 'D&D 5e / Foundry VTT',
    levelRange: level,
    tone,
    region,
    duration,
    villain: threat,
    hook: `Em ${region}, rumores sobre ${theme.toLowerCase()} começam a afetar caravanas, nobres e aventureiros. Os personagens são contratados para investigar antes que o conflito vire guerra aberta.`,
    secret: `Reviravolta: ${twist}.`,
    scenes: [
      { name: 'A Taverna do Primeiro Sinal', type: 'social', dc: 13, notes: 'NPCs desconfiados, rumores contraditórios e um contato que sabe demais.' },
      { name: 'Ruelas e Armazéns de Amn', type: 'investigation', dc: 15, notes: 'Testes de Investigação, Percepção e Intuição revelam símbolos, rotas de contrabando e nomes falsos.' },
      { name: 'Santuário Oculto', type: 'combat', dc: 14, notes: 'Encontro tático com guardas, cultistas, terreno perigoso e uma pista física para o vilão.' },
      { name: 'Confronto Final', type: 'boss', dc: 16, notes: `O grupo enfrenta ${threat}. A cena deve permitir combate, negociação ou sabotagem.` }
    ],
    npcs: [
      { name: 'Ser Caldrim Voss', role: 'contratante', motive: 'proteger reputação e fortuna', secret: 'Está escondendo uma dívida antiga.' },
      { name: 'Mira dos Sete Véus', role: 'informante', motive: 'sobreviver vendendo segredos', secret: 'Vende informações para os dois lados.' },
      { name: 'Orven Tarsk', role: 'antagonista secundário', motive: 'subir na hierarquia criminosa', secret: 'Tem medo do verdadeiro líder.' }
    ],
    encounters: [
      { name: 'Emboscada de batedores', difficulty: 'médio', creatures: ['batedores', 'capangas', 'mastim treinado'] },
      { name: 'Ritual interrompido', difficulty: 'difícil', creatures: ['cultistas', 'acólito corrompido', 'guarda mercenário'] },
      { name: 'Chefe e guarda de elite', difficulty: 'clímax', creatures: [threat, 'dois protetores', 'perigo ambiental'] }
    ],
    loot: ['ouro por contrato', 'item mágico menor', 'favor político em Amn', 'mapa para uma próxima aventura'],
    foundryExportHint: 'Use o botão Foundry Bundle para gerar Journal, Scene Pack e metadados prontos para importador.'
  };
}

function renderAdventure(adventure) {
  result.innerHTML = `
    <h3>${adventure.title}</h3>
    <p><strong>Sistema:</strong> ${adventure.system}</p>
    <p><strong>Nível:</strong> ${adventure.levelRange} • <strong>Tom:</strong> ${adventure.tone} • <strong>Duração:</strong> ${adventure.duration}</p>
    <p><strong>Gancho:</strong> ${adventure.hook}</p>
    <p><strong>Segredo:</strong> ${adventure.secret}</p>
    <h4>Cenas para Foundry</h4>
    <ol>${adventure.scenes.map(scene => `<li><strong>${scene.name}</strong> — ${scene.notes} <em>CD sugerida: ${scene.dc}</em></li>`).join('')}</ol>
    <h4>NPCs</h4>
    <ul>${adventure.npcs.map(npc => `<li><strong>${npc.name}</strong>: ${npc.role}. Motivo: ${npc.motive}. Segredo: ${npc.secret}</li>`).join('')}</ul>
    <h4>Encontros</h4>
    <ul>${adventure.encounters.map(encounter => `<li><strong>${encounter.name}</strong> (${encounter.difficulty}): ${encounter.creatures.join(', ')}</li>`).join('')}</ul>
    <h4>Recompensas</h4>
    <p>${adventure.loot.join(' • ')}</p>
  `;
}

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  currentAdventure = buildAdventure({
    theme: document.querySelector('#aiTheme').value.trim(),
    level: document.querySelector('#aiLevel').value,
    tone: document.querySelector('#aiTone').value,
    villain: document.querySelector('#aiVillain').value.trim(),
    region: document.querySelector('#aiRegion')?.value.trim() || 'Amn',
    duration: document.querySelector('#aiDuration')?.value || 'one-shot de 4 horas'
  });
  renderAdventure(currentAdventure);
});

downloadButton?.addEventListener('click', () => {
  if (!currentAdventure) {
    currentAdventure = buildAdventure({ theme: 'Aventura do Mestre Orc', level: '5-10', tone: 'sombrio', villain: 'ameaça desconhecida' });
  }
  downloadJson(currentAdventure, 'aventura-mestre-orc.json');
});

downloadFoundryBundle?.addEventListener('click', () => {
  if (!currentAdventure) {
    currentAdventure = buildAdventure({ theme: 'Aventura do Mestre Orc', level: '5-10', tone: 'sombrio', villain: 'ameaça desconhecida' });
  }
  if (window.MestreOrcFoundryExport?.exportAdventureBundle) {
    window.MestreOrcFoundryExport.exportAdventureBundle(currentAdventure);
  } else {
    downloadJson(currentAdventure, 'aventura-mestre-orc-foundry-fallback.json');
  }
});
