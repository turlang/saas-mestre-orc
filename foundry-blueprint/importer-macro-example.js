/**
 * Exemplo conceitual para Foundry VTT.
 * Cole em uma macro dentro do Foundry e adapte para ler um JSON colado/importado.
 * Este arquivo é blueprint, não roda no site estático.
 */
async function importMestreOrcJournal(bundle) {
  if (!bundle?.foundry?.journal) return ui.notifications.warn('Bundle inválido.');
  const journal = bundle.foundry.journal;
  await JournalEntry.create({
    name: journal.name,
    pages: journal.pages
  });
  ui.notifications.info(`Journal importado: ${journal.name}`);
}

async function importMestreOrcScenes(bundle) {
  const scenes = bundle?.foundry?.scenes?.scenes || [];
  for (const scene of scenes) {
    await Scene.create({
      name: scene.name,
      navigation: scene.navigation,
      grid: scene.grid,
      width: scene.dimensions.width,
      height: scene.dimensions.height,
      flags: scene.flags
    });
  }
  ui.notifications.info(`${scenes.length} cenas importadas.`);
}
