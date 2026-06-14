/* ==========================================================
   MÓDULO DND 5.5 - CRIADOR DE FICHA
   O botão usado é o já existente:
   <a href="#" id="montarPersonagem" class="btn-cta">Montar Personagem</a>
   ========================================================== */

(() => {
  "use strict";

  const Ability = Object.freeze({
    STR: "Força",
    DEX: "Destreza",
    CON: "Constituição",
    INT: "Inteligência",
    WIS: "Sabedoria",
    CHA: "Carisma"
  });

  const STORAGE_KEY = "mestre-orc-dnd55-character-sheet";

  const state = {
    name: "",
    className: "",
    species: "",
    background: "",
    level: 1,
    armorClass: 10,
    initiative: 0,
    speed: 9,
    hitPoints: 10,
    abilities: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10
    },
    personality: "",
    ideal: "",
    bond: "",
    flaw: "",
    objective: "",
    appearance: "",
    story: ""
  };

  function modifier(score) {
    return Math.floor((Number(score) - 10) / 2);
  }

  function formatModifier(value) {
    return value >= 0 ? `+${value}` : `${value}`;
  }

  function readForm() {
    const form = document.querySelector("#dndForm");
    if (!form) return;

    const data = new FormData(form);

    state.name = data.get("name") || "";
    state.className = data.get("className") || "";
    state.species = data.get("species") || "";
    state.background = data.get("background") || "";
    state.level = Number(data.get("level") || 1);
    state.armorClass = Number(data.get("armorClass") || 10);
    state.initiative = Number(data.get("initiative") || 0);
    state.speed = Number(data.get("speed") || 9);
    state.hitPoints = Number(data.get("hitPoints") || 10);

    Object.keys(Ability).forEach(key => {
      state.abilities[key] = Number(data.get(key) || 10);
    });

    state.personality = data.get("personality") || "";
    state.ideal = data.get("ideal") || "";
    state.bond = data.get("bond") || "";
    state.flaw = data.get("flaw") || "";
    state.objective = data.get("objective") || "";
    state.appearance = data.get("appearance") || "";
  }

  function saveLocal() {
    readForm();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    alert("Ficha salva neste navegador.");
  }

  function loadLocal() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      Object.assign(state, JSON.parse(saved));
    } catch {
      console.warn("Não foi possível carregar a ficha salva.");
    }
  }

  function generateStory() {
    readForm();

    const name = state.name || "Este personagem";
    const className = state.className || "aventureiro";
    const species = state.species || "origem misteriosa";
    const background = state.background || "passado pouco conhecido";

    const story = `${name} é um(a) ${className} de ${species}, marcado(a) por um passado ligado a ${background}.

Personalidade: ${state.personality || "reservado(a), observador(a) e sempre atento(a) ao perigo."}

Ideal: ${state.ideal || "provar seu valor e proteger aqueles que não conseguem se defender."}

Vínculo: ${state.bond || "carrega uma lembrança importante que guia suas escolhas."}

Defeito: ${state.flaw || "às vezes confia demais na própria coragem."}

Objetivo: ${state.objective || "descobrir seu verdadeiro lugar no mundo e deixar um legado."}

Aparência: ${state.appearance || "possui presença marcante, olhar determinado e sinais de muitas jornadas."}

Gancho para o mestre: algo do passado de ${name} pode retornar durante a campanha, colocando suas escolhas à prova.`;

    state.story = story;

    const storyBox = document.querySelector("#dndStoryResult");
    if (storyBox) storyBox.textContent = story;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function exportAsPdf() {
    readForm();
    if (!state.story) generateStory();

    const jsPDF = window.jspdf?.jsPDF;

    if (!jsPDF) {
      alert("Biblioteca jsPDF não encontrada. Verifique sua conexão ou o CDN do jsPDF.");
      return;
    }

    const doc = new jsPDF();
    let y = 14;

    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("Ficha de Personagem - Mestre Orc", 14, y);

    y += 10;
    doc.setFontSize(11);
    doc.setFont("times", "normal");

    const lines = [
      `Nome: ${state.name}`,
      `Classe: ${state.className}`,
      `Espécie: ${state.species}`,
      `Antecedente: ${state.background}`,
      `Nível: ${state.level}`,
      `CA: ${state.armorClass} | Iniciativa: ${state.initiative} | Deslocamento: ${state.speed}m | PV: ${state.hitPoints}`,
      "",
      "Atributos:"
    ];

    Object.entries(state.abilities).forEach(([key, value]) => {
      lines.push(`${Ability[key]}: ${value} (${formatModifier(modifier(value))})`);
    });

    lines.push("", "História:");
    lines.push(...doc.splitTextToSize(state.story || "", 180));

    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 14;
      }

      doc.text(String(line), 14, y);
      y += 7;
    });

    doc.save(`${state.name || "personagem"}-ficha.pdf`);
  }

  function exportAsJs() {
    readForm();
    if (!state.story) generateStory();

    const content = `window.MestreOrcPersonagem = ${JSON.stringify(state, null, 2)};`;
    const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.name || "personagem"}-ficha.js`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function updateModifiers() {
    Object.keys(Ability).forEach(key => {
      const input = document.querySelector(`[name="${key}"]`);
      const output = document.querySelector(`[data-mod="${key}"]`);

      if (input && output) {
        output.textContent = formatModifier(modifier(input.value));
      }
    });
  }

  function createModal() {
    if (document.querySelector("#dndSheetModal")) return;

    const modal = document.createElement("section");
    modal.className = "dnd-modal";
    modal.id = "dndSheetModal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="dnd-app" role="dialog" aria-modal="true" aria-labelledby="dndSheetTitle">
        <header class="dnd-header">
          <div class="dnd-title">
            <h2 id="dndSheetTitle">Montar Personagem</h2>
            <p>Construa sua ficha, personalize a história e exporte o personagem.</p>
          </div>

          <div class="dnd-actions">
            <button class="dnd-btn" type="button" data-action="save">Salvar</button>
            <button class="dnd-btn" type="button" data-action="story">Gerar história</button>
            <button class="dnd-btn primary" type="button" data-action="pdf">Exportar PDF</button>
            <button class="dnd-btn dark" type="button" data-action="js">Exportar JS</button>
            <button class="dnd-btn" type="button" data-action="close">Fechar</button>
          </div>
        </header>

        <main class="dnd-body">
          <form id="dndForm" class="dnd-grid">
            <section class="dnd-card">
              <h3>Identidade</h3>

              <div class="dnd-form">
                <div class="dnd-field half">
                  <label>Nome</label>
                  <input name="name" placeholder="Ex: Kael, o Errante">
                </div>

                <div class="dnd-field half">
                  <label>Classe</label>
                  <input name="className" placeholder="Ex: Guerreiro, Mago, Ladino">
                </div>

                <div class="dnd-field half">
                  <label>Espécie</label>
                  <input name="species" placeholder="Ex: Humano, Elfo, Anão">
                </div>

                <div class="dnd-field half">
                  <label>Antecedente</label>
                  <input name="background" placeholder="Ex: Soldado, Artesão, Órfão">
                </div>

                <div class="dnd-field small">
                  <label>Nível</label>
                  <input name="level" type="number" min="1" max="20" value="1">
                </div>

                <div class="dnd-field small">
                  <label>CA</label>
                  <input name="armorClass" type="number" value="10">
                </div>

                <div class="dnd-field small">
                  <label>Iniciativa</label>
                  <input name="initiative" type="number" value="0">
                </div>

                <div class="dnd-field small">
                  <label>Desloc.</label>
                  <input name="speed" type="number" value="9">
                </div>

                <div class="dnd-field small">
                  <label>PV</label>
                  <input name="hitPoints" type="number" value="10">
                </div>
              </div>

              <h3 style="margin-top:18px">Atributos</h3>
              <div class="dnd-abilities">
                ${Object.keys(Ability).map(key => `
                  <div class="dnd-ability">
                    <strong>${Ability[key]}</strong>
                    <input name="${key}" type="number" min="1" max="30" value="10">
                    <span class="dnd-mod" data-mod="${key}">+0</span>
                  </div>
                `).join("")}
              </div>
            </section>

            <section class="dnd-card">
              <h3>Persona e história</h3>

              <div class="dnd-form">
                <div class="dnd-field wide">
                  <label>Personalidade</label>
                  <textarea name="personality" placeholder="Como ele age, fala e reage?"></textarea>
                </div>

                <div class="dnd-field half">
                  <label>Ideal</label>
                  <textarea name="ideal" placeholder="No que acredita?"></textarea>
                </div>

                <div class="dnd-field half">
                  <label>Vínculo</label>
                  <textarea name="bond" placeholder="Quem ou o que importa?"></textarea>
                </div>

                <div class="dnd-field half">
                  <label>Defeito</label>
                  <textarea name="flaw" placeholder="Qual fraqueza complica sua vida?"></textarea>
                </div>

                <div class="dnd-field half">
                  <label>Objetivo</label>
                  <textarea name="objective" placeholder="O que busca na campanha?"></textarea>
                </div>

                <div class="dnd-field wide">
                  <label>Aparência</label>
                  <textarea name="appearance" placeholder="Roupa, marcas, postura, voz, símbolos..."></textarea>
                </div>
              </div>
            </section>

            <section class="dnd-card" style="grid-column:1 / -1">
              <h3>História gerada</h3>
              <div id="dndStoryResult" class="dnd-card dnd-storybox">
                Preencha os campos e clique em “Gerar história”.
              </div>
            </section>
          </form>
        </main>

        <footer class="dnd-footer">
          Sistema integrado ao portal Mestre Orc. Visual inspirado em fichas clássicas de RPG de fantasia.
        </footer>
      </div>
    `;

    document.body.appendChild(modal);
  }

  function fillFormFromState() {
    const form = document.querySelector("#dndForm");
    if (!form) return;

    Object.entries(state).forEach(([key, value]) => {
      if (key === "abilities") return;
      const field = form.elements[key];
      if (field) field.value = value;
    });

    Object.entries(state.abilities).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });

    if (state.story) {
      document.querySelector("#dndStoryResult").textContent = state.story;
    }

    updateModifiers();
  }

  function openModal(event) {
    if (event) event.preventDefault();

    const modal = document.querySelector("#dndSheetModal");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    const modal = document.querySelector("#dndSheetModal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function bindEvents() {
    const button = document.querySelector("#montarPersonagem") || document.querySelector(".btn-cta");

    if (button) {
      button.addEventListener("click", openModal);
    } else {
      console.warn("Botão Montar Personagem não encontrado.");
    }

    document.addEventListener("input", event => {
      if (event.target.matches(".dnd-ability input")) {
        updateModifiers();
      }
    });

    document.addEventListener("click", event => {
      const action = event.target.dataset.action;
      if (!action) return;

      const actions = {
        save: saveLocal,
        story: generateStory,
        pdf: exportAsPdf,
        js: exportAsJs,
        close: closeModal
      };

      actions[action]?.();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeModal();
    });
  }

  function init() {
    createModal();
    loadLocal();
    fillFormFromState();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
