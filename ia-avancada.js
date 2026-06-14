let lastProAdventure = null;

function fallbackAdventure(payload) {
  return {
    title: payload.title,
    type: 'ADVENTURE',
    contentJson: {
      title: payload.title,
      system: payload.system,
      levelRange: payload.levelRange,
      tone: payload.tone,
      partySize: payload.partySize,
      duration: payload.duration,
      location: payload.location,
      synopsis: `${payload.title} é uma aventura ${payload.tone} sobre ${payload.theme}.`,
      hook: `Em ${payload.location}, rumores sobre ${payload.theme} atraem aventureiros para uma missão perigosa.`,
      acts: [
        { name: 'Ato 1 — O Chamado', goal: 'Apresentar ameaça e contratante.', scenes: ['Taverna', 'Primeira pista', 'Emboscada'] },
        { name: 'Ato 2 — Investigação', goal: 'Revelar a verdade oculta.', scenes: ['Ruínas', 'NPC suspeito', 'Enigma'] },
        { name: 'Ato 3 — Confronto', goal: 'Resolver o conflito.', scenes: ['Covil final', 'Combate', 'Consequência'] }
      ],
      npcs: [
        { name: 'Maerla dos Sete Sinos', role: 'Contratante', secret: 'Sabe mais do que admite.' },
        { name: 'Irgor Veld', role: 'Antagonista', secret: `Está ligado ao tema: ${payload.theme}.` }
      ],
      encounters: [
        { name: 'Emboscada', difficulty: 'Média', creatures: ['Bandidos', 'Batedor'] },
        { name: 'Guardião final', difficulty: 'Difícil', creatures: ['Criatura temática', 'Aliado corrompido'] }
      ],
      loot: ['50 PO por personagem', 'Item incomum', 'Mapa para próxima aventura'],
      foundryBundle: { recommendedScenes: ['Cena inicial', 'Investigação', 'Covil final'], actors: ['Maerla', 'Irgor'], journalEntries: ['Resumo', 'Pistas', 'Recompensas'] }
    }
  };
}

function renderAdventure(saved) {
  const adventure = saved.contentJson || saved;
  const acts = (adventure.acts || []).map(act => `<li><strong>${act.name}</strong><br>${act.goal}<br><small>${(act.scenes || []).join(' • ')}</small></li>`).join('');
  const npcs = (adventure.npcs || []).map(npc => `<li><strong>${npc.name}</strong> — ${npc.role}<br><small>${npc.secret || npc.personality || ''}</small></li>`).join('');
  const encounters = (adventure.encounters || []).map(enc => `<li><strong>${enc.name}</strong> (${enc.difficulty})<br><small>${(enc.creatures || []).join(', ')}</small></li>`).join('');

  document.getElementById('proAiResult').innerHTML = `
    <h3>${adventure.title}</h3>
    <p>${adventure.synopsis}</p>
    <p><strong>Gancho:</strong> ${adventure.hook}</p>
    <h4>Atos</h4><ul>${acts}</ul>
    <h4>NPCs</h4><ul>${npcs}</ul>
    <h4>Encontros</h4><ul>${encounters}</ul>
    <h4>Loot</h4><p>${(adventure.loot || []).join(' • ')}</p>
  `;
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

document.getElementById('proAiForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: document.getElementById('proTitle').value.trim(),
    system: document.getElementById('proSystem').value.trim(),
    levelRange: document.getElementById('proLevel').value,
    theme: document.getElementById('proTheme').value.trim(),
    tone: document.getElementById('proTone').value,
    partySize: Number(document.getElementById('proParty').value || 4),
    duration: document.getElementById('proDuration').value,
    location: document.getElementById('proLocation').value.trim(),
    extraNotes: document.getElementById('proNotes').value.trim()
  };

  try {
    document.getElementById('proAiStatus').textContent = 'Gerando pela API...';
    lastProAdventure = await MestreOrcApi.post('/ai/adventures', payload);
    document.getElementById('proAiStatus').textContent = 'Aventura gerada e salva no MongoDB.';
  } catch (error) {
    lastProAdventure = fallbackAdventure(payload);
    document.getElementById('proAiStatus').textContent = `Modo local: ${error.message}`;
  }

  renderAdventure(lastProAdventure);
});

document.getElementById('downloadProJson').addEventListener('click', () => {
  if (!lastProAdventure) return alert('Gere uma aventura primeiro.');
  downloadJson('mestre-orc-aventura-pro.json', lastProAdventure);
});
