const FoundryBridge = (() => {
  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function exportFromApi(path, fallbackData, filename) {
    try {
      if (!window.MestreOrcApi) throw new Error('API indisponível.');
      const data = await MestreOrcApi.get(path);
      downloadJson(filename, data);
      return { ok: true, source: 'api' };
    } catch (error) {
      downloadJson(filename, fallbackData);
      return { ok: true, source: 'local', warning: error.message };
    }
  }

  function render() {
    const panel = document.querySelector('[data-foundry-real-bridge]');
    if (!panel) return;

    panel.innerHTML = `
      <div class="premium-panel">
        <h3>Bridge realista com API</h3>
        <p>Use os IDs do MongoDB para exportar campanhas, personagens ou bundles gerados pela IA em formato Foundry Ready.</p>
        <form id="foundryApiExportForm" class="phase2-form">
          <label>Tipo
            <select name="type">
              <option value="campaign">Campanha / World</option>
              <option value="character">Personagem / Actor</option>
              <option value="generated">IA / Bundle</option>
            </select>
          </label>
          <label>ID no banco MongoDB<input name="id" placeholder="Cole o ID retornado pela API" required></label>
          <button class="btn-cta btn-cta-primary" type="submit">Exportar via API</button>
        </form>
        <p class="muted-note">Sem backend rodando, o botão baixa um JSON local de demonstração para você testar o fluxo.</p>
      </div>`;

    document.getElementById('foundryApiExportForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const type = form.get('type');
      const id = form.get('id');
      const paths = {
        campaign: `/foundry/campaigns/${id}/export`,
        character: `/foundry/characters/${id}/export`,
        generated: `/foundry/generated/${id}/bundle`
      };
      const fallback = {
        name: `mestre-orc-${type}-demo`,
        type,
        exportedAt: new Date().toISOString(),
        instructions: 'Arquivo local gerado sem API. Rode o backend para exportar dados reais do MongoDB.'
      };
      const result = await exportFromApi(paths[type], fallback, `mestre-orc-${type}-${id}.json`);
      alert(result.source === 'api' ? 'Exportação real concluída.' : 'API indisponível. JSON demo baixado.');
    });
  }

  document.addEventListener('DOMContentLoaded', render);
  return { downloadJson, exportFromApi };
})();
