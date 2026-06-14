(() => {
  "use strict";

  const STORAGE_KEY = "mestre-orc-ficha-original-com-builder";
  const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];
  const semanticIndex = new Map();
  const form = () => document.querySelector("#sheetForm");

  const DATA = {
    classes: {
      "Guerreiro": {
        hitDie: "d10",
        saves: ["strSave", "conSave"],
        skills: ["athletics", "intimidation"],
        armor: ["lightArmor", "mediumArmor", "heavyArmor", "shieldsTraining"],
        priority: ["str", "con", "dex", "wis", "cha", "int"],
        features: "Estilo de Luta; Retomar Fôlego; Maestria com Armas.",
        weapons: "Armas simples e marciais.",
        equipment: "Armadura, arma marcial, escudo ou segunda arma, pacote de explorador."
      },
      "Ladino": {
        hitDie: "d8",
        saves: ["dexSave", "intSave"],
        skills: ["stealth", "sleight", "acrobatics", "deception"],
        armor: ["lightArmor"],
        priority: ["dex", "cha", "int", "wis", "con", "str"],
        features: "Especialização; Ataque Furtivo; Gíria de Ladrão; Maestria com Armas.",
        weapons: "Armas simples, armas leves e armas de precisão.",
        equipment: "Armadura leve, armas leves, ferramentas de ladrão, pacote de assaltante."
      },
      "Mago": {
        hitDie: "d6",
        saves: ["intSave", "wisSave"],
        skills: ["arcana", "history"],
        armor: [],
        priority: ["int", "con", "dex", "wis", "cha", "str"],
        features: "Conjuração; Recuperação Arcana; Grimório.",
        weapons: "Adagas, bordões e armas simples selecionadas.",
        equipment: "Grimório, foco arcano, pacote de estudioso.",
        spellAbility: "Inteligência",
        spells: ["Luz", "Mãos Mágicas", "Raio de Fogo", "Mísseis Mágicos", "Escudo Arcano", "Sono"]
      },
      "Clérigo": {
        hitDie: "d8",
        saves: ["wisSave", "chaSave"],
        skills: ["religion", "medicine", "insight"],
        armor: ["lightArmor", "mediumArmor", "shieldsTraining"],
        priority: ["wis", "con", "str", "cha", "dex", "int"],
        features: "Conjuração; Canalizar Divindade; Ordem Divina.",
        weapons: "Armas simples.",
        equipment: "Símbolo sagrado, armadura média, escudo, arma simples, pacote de sacerdote.",
        spellAbility: "Sabedoria",
        spells: ["Luz", "Orientação", "Chama Sagrada", "Curar Ferimentos", "Benção", "Escudo da Fé"]
      },
      "Bardo": {
        hitDie: "d8",
        saves: ["dexSave", "chaSave"],
        skills: ["performance", "persuasion", "deception"],
        armor: ["lightArmor"],
        priority: ["cha", "dex", "con", "wis", "int", "str"],
        features: "Inspiração de Bardo; Conjuração; Especialização.",
        weapons: "Armas simples e armas leves selecionadas.",
        equipment: "Instrumento musical, armadura leve, arma leve, pacote de artista.",
        spellAbility: "Carisma",
        spells: ["Zombaria Viciosa", "Luz", "Curar Ferimentos", "Onda Trovejante", "Sono"]
      }
    },
    species: {
      "Humano": { traits: "Versátil; talento extra; perícia adicional.", size: "Médio", speed: "9m" },
      "Elfo": { traits: "Visão no Escuro; Ancestral Feérico; Transe; sentidos aguçados.", size: "Médio", speed: "9m" },
      "Anão": { traits: "Resiliência Anã; Visão no Escuro; treinamento com ferramentas; robustez.", size: "Médio", speed: "9m" },
      "Halfling": { traits: "Sortudo; Bravo; Agilidade Halfling.", size: "Pequeno", speed: "9m" },
      "Orc": { traits: "Investida Agressiva; Resistência Implacável; constituição poderosa.", size: "Médio", speed: "9m" }
    },
    backgrounds: {
      "Acólito": { skills: ["religion", "insight"], tools: "Caligrafia ou suprimentos religiosos", feat: "Iniciado em Magia", languages: "Comum e dois idiomas à escolha" },
      "Criminoso": { skills: ["stealth", "deception"], tools: "Ferramentas de ladrão, jogo", feat: "Alerta", languages: "Comum e um idioma à escolha" },
      "Sábio": { skills: ["arcana", "history"], tools: "Caligrafia", feat: "Iniciado em Magia", languages: "Comum e dois idiomas à escolha" },
      "Soldado": { skills: ["athletics", "intimidation"], tools: "Jogo ou veículos", feat: "Atacante Selvagem", languages: "Comum e um idioma à escolha" },
      "Artista": { skills: ["performance", "acrobatics"], tools: "Instrumento musical", feat: "Músico", languages: "Comum e um idioma à escolha" }
    },
    arrays: {
      standard: [15, 14, 13, 12, 10, 8],
      balanced: [14, 14, 13, 12, 10, 10],
      heroic: [16, 15, 14, 12, 10, 8]
    }
  };

  function setZoom(px) {
    document.documentElement.style.setProperty("--sheet-width", `${px}px`);
    localStorage.setItem(`${STORAGE_KEY}:zoom`, String(px));
  }

  function getCurrentZoom() {
    return Number(localStorage.getItem(`${STORAGE_KEY}:zoom`)) || 980;
  }

  async function loadFields() {
    const response = await fetch("./assets/fields.json");
    const fields = await response.json();

    fields.forEach(field => {
      const layer = document.querySelector(`#fieldsPage${field.page}`);
      const element = createField(field);

      element.style.left = `${field.x}%`;
      element.style.top = `${field.y}%`;
      element.style.width = `${field.w}%`;
      element.style.height = `${field.h}%`;

      layer.appendChild(element);

      if (field.semantic) {
        semanticIndex.set(field.semantic, element);
      }

      if (field.semantic && ["str","dex","con","int","wis","cha"].includes(field.semantic)) {
        element.classList.add("field-ability");
      }
      if (field.semantic && field.semantic.endsWith("Mod")) {
        element.classList.add("field-modifier");
      }
      if (field.semantic==="characterName") {
        element.classList.add("field-character-name");
      }
      if (["className","species","background","level","armorClass"].includes(field.semantic)) {
        element.classList.add("field-main");
      }

    });

    loadData();
    updateDerived();
  }

  function createField(field) {
    const element = document.createElement(field.type === "checkbox" ? "input" : field.multiline ? "textarea" : "input");

    element.className = "sheet-field";
    element.name = field.id;
    element.dataset.pdfName = field.pdfName;
    element.dataset.semantic = field.semantic || "";

    if (field.type === "checkbox") {
      element.type = "checkbox";
    } else if (element.tagName === "INPUT") {
      element.type = "text";
      element.value = field.value || "";
    } else {
      element.value = field.value || "";
    }

    return element;
  }

  function field(semantic) {
    return semanticIndex.get(semantic);
  }

  function setSemantic(semantic, value) {
    const element = field(semantic);
    if (!element) return;

    if (element.type === "checkbox") {
      element.checked = Boolean(value);
    } else {
      element.value = value ?? "";
    }
  }

  function getSemantic(semantic) {
    const element = field(semantic);
    if (!element) return "";
    return element.type === "checkbox" ? element.checked : element.value;
  }

  function clearCheckboxes() {
    document.querySelectorAll("input[type='checkbox'].sheet-field").forEach(input => {
      input.checked = false;
    });
  }

  function modifier(score) {
    return Math.floor((Number(score || 10) - 10) / 2);
  }

  function fmt(value) {
    return value >= 0 ? `+${value}` : `${value}`;
  }

  function updateDerived() {
    ABILITIES.forEach(key => {
      const value = Number(getSemantic(key) || 10);
      setSemantic(`${key}Mod`, fmt(modifier(value)));
    });

    const dexMod = modifier(getSemantic("dex"));
    const wisMod = modifier(getSemantic("wis"));

    if (field("initiative") && !field("initiative").dataset.manual) {
      setSemantic("initiative", fmt(dexMod));
    }

    if (field("passivePerception") && !field("passivePerception").dataset.manual) {
      setSemantic("passivePerception", 10 + wisMod);
    }

    const cls = DATA.classes[getSemantic("className")];
    if (cls?.spellAbility) {
      const map = { "Inteligência": "int", "Sabedoria": "wis", "Carisma": "cha" };
      const abilityKey = map[cls.spellAbility];
      const prof = Number(String(getSemantic("proficiency") || "+2").replace("+", "")) || 2;
      const spellMod = modifier(getSemantic(abilityKey));

      setSemantic("spellAbility", cls.spellAbility);
      setSemantic("spellModifier", fmt(spellMod));
      setSemantic("spellAttack", fmt(spellMod + prof));
      setSemantic("spellSaveDc", 8 + prof + spellMod);
    }
  }

  function applyArray(priority, arrayName) {
    const values = DATA.arrays[arrayName] || DATA.arrays.standard;
    priority.forEach((ability, index) => setSemantic(ability, values[index]));
  }

  function quickBuild() {
    clearCheckboxes();

    const name = document.querySelector("#quickName").value.trim();
    const className = document.querySelector("#quickClass").value;
    const speciesName = document.querySelector("#quickSpecies").value;
    const backgroundName = document.querySelector("#quickBackground").value;
    const arrayName = document.querySelector("#quickArray").value;
    const level = Number(document.querySelector("#quickLevel").value || 1);

    const cls = DATA.classes[className];
    const species = DATA.species[speciesName];
    const bg = DATA.backgrounds[backgroundName];

    setSemantic("characterName", name);
    setSemantic("className", className);
    setSemantic("species", speciesName);
    setSemantic("background", backgroundName);
    setSemantic("subclass", "");
    setSemantic("level", level);
    setSemantic("xp", 0);
    setSemantic("proficiency", level >= 17 ? "+6" : level >= 13 ? "+5" : level >= 9 ? "+4" : level >= 5 ? "+3" : "+2");

    applyArray(cls.priority, arrayName);

    [...cls.saves, ...cls.skills, ...cls.armor, ...bg.skills].forEach(item => setSemantic(item, true));

    const hp = Math.max(1, Number(cls.hitDie.replace("d", "")) + modifier(getSemantic("con")));
    setSemantic("hpCurrent", hp);
    setSemantic("hpMax", hp);
    setSemantic("hpTemp", 0);
    setSemantic("hitDiceMax", `${level}${cls.hitDie}`);
    setSemantic("hitDiceSpent", "0");
    setSemantic("speed", species.speed);
    setSemantic("size", species.size);
    setSemantic("armorClass", className === "Guerreiro" ? 16 : className === "Ladino" ? 13 : className === "Clérigo" ? 16 : 10);

    setSemantic("weaponTraining", cls.weapons);
    setSemantic("toolTraining", bg.tools);
    setSemantic("classFeatures", cls.features);
    setSemantic("classFeatures2", cls.equipment);
    setSemantic("speciesTraits", species.traits);
    setSemantic("feats", bg.feat);
    setSemantic("languages", bg.languages);
    setSemantic("equipment", cls.equipment);

    setSemantic("weapon1Name", className === "Mago" ? "Bordão" : className === "Clérigo" ? "Maça" : "Espada curta");
    setSemantic("weapon1Bonus", "+0");
    setSemantic("weapon1Damage", className === "Mago" ? "1d6 concussão" : "1d6 perfurante");
    setSemantic("weapon1Notes", "Ajuste bônus conforme proficiência.");
    setSemantic("weapon2Name", "Ataque reserva");

    if (cls.spells) {
      cls.spells.forEach((spell, index) => {
        setSemantic(`spell${index + 1}_circle`, index < 3 ? "Truque" : "1º");
        setSemantic(`spell${index + 1}_name`, spell);
      });
    }

    generateStory(false);
    updateDerived();
    saveData(false);
    alert("Personagem criado automaticamente. Revise os detalhes na ficha.");
  }

  function generateStory(showAlert = true) {
    const name = getSemantic("characterName") || "Este personagem";
    const cls = getSemantic("className") || "aventureiro";
    const species = getSemantic("species") || "origem misteriosa";
    const background = getSemantic("background") || "passado pouco conhecido";

    const story = `${name} é um(a) ${cls} de origem ${species}, moldado(a) por uma vida como ${background}.

Personalidade: observa o ambiente antes de agir, mas não recua quando alguém precisa de ajuda.

Ideal: transformar dor, perda ou ambição em propósito.

Vínculo: carrega uma promessa antiga que ainda guia seus passos.

Defeito: pode insistir demais em resolver tudo sozinho(a).

Objetivo de campanha: encontrar reconhecimento, poder ou redenção enquanto encara perigos maiores que si.

Gancho para o mestre: alguém do passado de ${name} conhece um segredo capaz de mudar seu destino.`;

    setSemantic("personality", story);
    saveData(false);

    if (showAlert) alert("História gerada.");
  }

  function getData() {
    const data = {};
    [...form().elements].forEach(element => {
      if (!element.name) return;
      data[element.name] = {
        pdfName: element.dataset.pdfName || element.name,
        semantic: element.dataset.semantic || "",
        value: element.type === "checkbox" ? element.checked : element.value
      };
    });
    return data;
  }

  function saveData(showAlert = true) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getData()));
    if (showAlert) alert("Ficha salva neste navegador.");
  }

  function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      [...form().elements].forEach(element => {
        if (!element.name || !data[element.name]) return;
        if (element.type === "checkbox") {
          element.checked = Boolean(data[element.name].value);
        } else {
          element.value = data[element.name].value ?? "";
        }
      });
    } catch {
      console.warn("Não foi possível carregar a ficha salva.");
    }
  }

  function clearData() {
    if (!confirm("Limpar todos os campos da ficha?")) return;

    [...form().elements].forEach(element => {
      if (element.type === "checkbox") element.checked = false;
      else element.value = "";
    });

    localStorage.removeItem(STORAGE_KEY);
  }

  function exportJs() {
    const content = `window.MestreOrcFichaComBuilder = ${JSON.stringify(getData(), null, 2)};`;
    const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "mestre-orc-ficha-com-builder.js";
    link.click();

    URL.revokeObjectURL(url);
  }

  function populateBuilder() {
    const fill = (selector, values) => {
      document.querySelector(selector).innerHTML = values.map(value => `<option value="${value}">${value}</option>`).join("");
    };

    fill("#quickClass", Object.keys(DATA.classes));
    fill("#quickSpecies", Object.keys(DATA.species));
    fill("#quickBackground", Object.keys(DATA.backgrounds));
  }

  function bind() {
    document.querySelector("#btnQuick").addEventListener("click", quickBuild);
    document.querySelector("#btnStory").addEventListener("click", () => generateStory(true));
    document.querySelector("#btnSave").addEventListener("click", () => saveData(true));
    document.querySelector("#btnClear").addEventListener("click", clearData);
    document.querySelector("#btnExport").addEventListener("click", exportJs);
    document.querySelector("#btnPrint").addEventListener("click", () => window.print());

    document.querySelector("#btnZoomIn").addEventListener("click", () => setZoom(Math.min(1300, getCurrentZoom() + 60)));
    document.querySelector("#btnZoomOut").addEventListener("click", () => setZoom(Math.max(720, getCurrentZoom() - 60)));

    document.addEventListener("input", event => {
      if (event.target.dataset.semantic && ABILITIES.includes(event.target.dataset.semantic)) {
        updateDerived();
      }

      if (["initiative", "passivePerception"].includes(event.target.dataset.semantic)) {
        event.target.dataset.manual = "true";
      }

      saveData(false);
    });

    document.addEventListener("change", () => saveData(false));
  }

  document.addEventListener("DOMContentLoaded", () => {
    setZoom(getCurrentZoom());
    populateBuilder();
    bind();
    loadFields();
  });
})();
