/*
 * Fase 3 — Camada de exportação Foundry Ready
 * Não usa API interna do Foundry no navegador. Gera JSONs compatíveis como base
 * para importador, macro ou módulo futuro dentro do Foundry VTT.
 */
const MestreOrcFoundryExport = (() => {
  const moduleId = 'mestre-orc-foundry-bridge';

  function slugify(text = 'mestre-orc') {
    return String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'mestre-orc';
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

  function actorFromCharacter(character) {
    return {
      foundryType: 'Actor',
      importTarget: 'actors',
      name: character.name,
      type: 'character',
      system: {
        details: {
          level: Number(character.level || 1),
          biography: { value: character.notes || 'Personagem criado no portal Mestre Orc.' },
          originalClass: character.className || 'Classe a definir'
        },
        attributes: {
          hp: { value: 10 + Number(character.level || 1) * 6, max: 10 + Number(character.level || 1) * 6 },
          ac: { value: 12 }
        }
      },
      flags: {
        [moduleId]: {
          source: 'Mestre Orc SaaS',
          player: character.player,
          campaign: character.campaign,
          status: character.status
        }
      }
    };
  }

  function journalFromAdventure(adventure) {
    return {
      foundryType: 'JournalEntry',
      importTarget: 'journal',
      name: adventure.title,
      pages: [
        {
          name: 'Resumo da aventura',
          type: 'text',
          text: {
            content: `<h1>${adventure.title}</h1><p><strong>Tom:</strong> ${adventure.tone}</p><p>${adventure.hook}</p>`
          }
        },
        {
          name: 'Cenas',
          type: 'text',
          text: {
            content: `<ol>${(adventure.scenes || []).map(scene => `<li><strong>${scene.name}</strong> — ${scene.notes}</li>`).join('')}</ol>`
          }
        },
        {
          name: 'NPCs',
          type: 'text',
          text: {
            content: `<ul>${(adventure.npcs || []).map(npc => `<li><strong>${npc.name}</strong>: ${npc.role}. ${npc.secret ? `Segredo: ${npc.secret}` : ''}</li>`).join('')}</ul>`
          }
        }
      ],
      flags: {
        [moduleId]: {
          source: 'IA do Mestre Orc',
          levelRange: adventure.levelRange,
          villain: adventure.villain
        }
      }
    };
  }

  function scenePackFromAdventure(adventure) {
    return {
      foundryType: 'ScenePack',
      importTarget: 'scenes',
      world: slugify(adventure.title),
      scenes: (adventure.scenes || []).map((scene, index) => ({
        name: scene.name,
        sort: index + 1,
        navigation: true,
        notes: scene.notes,
        type: scene.type,
        grid: { type: 1, size: 100 },
        dimensions: { width: 2400, height: 1600 },
        flags: { [moduleId]: { source: 'Mestre Orc', aiGenerated: true } }
      }))
    };
  }

  function compendiumPack(adventure) {
    return {
      packName: slugify(adventure.title),
      label: adventure.title,
      system: 'dnd5e',
      minimumCoreVersion: '12',
      recommendedCoreVersion: '14',
      documents: [journalFromAdventure(adventure), scenePackFromAdventure(adventure)]
    };
  }

  function exportAdventureBundle(adventure) {
    const bundle = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      moduleId,
      adventure,
      foundry: {
        journal: journalFromAdventure(adventure),
        scenes: scenePackFromAdventure(adventure),
        compendium: compendiumPack(adventure)
      },
      nextStep: 'Importar este JSON em uma macro/módulo Foundry que crie JournalEntry, Scene e compendium a partir dos dados.'
    };
    downloadJson(bundle, `${slugify(adventure.title)}-foundry-bundle.json`);
  }

  function renderPanel() {
    const root = document.querySelector('[data-foundry-export-panel]');
    if (!root) return;
    const data = window.MestreOrcPhase2?.getData?.() || { campaigns: [], characters: [] };
    root.innerHTML = `
      <div class="foundry-tools-grid">
        <article class="manager-card">
          <h3>Exportar mundo de campanha</h3>
          <p>Gera um manifesto com campanha, jogadores, reservas e metadados para um futuro módulo Foundry.</p>
          <select id="foundryCampaignSelect">
            ${data.campaigns.map(camp => `<option value="${camp.id}">${camp.name}</option>`).join('')}
          </select>
          <button class="btn-cta btn-cta-primary full-btn" type="button" data-export-campaign-world>Exportar World JSON</button>
        </article>
        <article class="manager-card">
          <h3>Exportar personagem como Actor</h3>
          <p>Converte o personagem cadastrado em um JSON pensado para Actor do sistema D&D5e.</p>
          <select id="foundryCharacterSelect">
            ${data.characters.map(char => `<option value="${char.id}">${char.name} — ${char.player}</option>`).join('')}
          </select>
          <button class="btn-cta btn-cta-secondary full-btn" type="button" data-export-actor>Exportar Actor JSON</button>
        </article>
      </div>
    `;
  }

  function bindPanel() {
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-export-campaign-world]')) {
        const data = window.MestreOrcPhase2?.getData?.();
        const id = document.querySelector('#foundryCampaignSelect')?.value;
        const campaign = data?.campaigns.find(item => item.id === id);
        if (!campaign) return;
        const payload = {
          foundryType: 'WorldManifest',
          name: slugify(campaign.name),
          title: campaign.name,
          system: 'dnd5e',
          coreVersion: '14',
          campaign,
          characters: data.characters.filter(char => char.campaign === campaign.name).map(actorFromCharacter),
          reservations: data.reservations.filter(res => res.campaign === campaign.name),
          flags: { [moduleId]: { source: 'Mestre Orc SaaS' } }
        };
        downloadJson(payload, `${slugify(campaign.name)}-world-foundry.json`);
      }

      if (event.target.closest('[data-export-actor]')) {
        const data = window.MestreOrcPhase2?.getData?.();
        const id = document.querySelector('#foundryCharacterSelect')?.value;
        const character = data?.characters.find(item => item.id === id);
        if (!character) return;
        downloadJson(actorFromCharacter(character), `${slugify(character.name)}-actor-foundry.json`);
      }
    });
  }

  function init() {
    renderPanel();
    bindPanel();
  }

  return { init, exportAdventureBundle, actorFromCharacter, journalFromAdventure, scenePackFromAdventure };
})();

document.addEventListener('DOMContentLoaded', MestreOrcFoundryExport.init);
