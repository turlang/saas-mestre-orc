
function formatarAtributoLinhas(valor) {
    return String(valor)
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => "<span class='atrib-linha'>" + v + "</span>")
        .join("");
}
// =========================================================================
// PARTE 1: INFRAESTRUTURA MATEMÁTICA E RENDERIZADORES DE NÍVEL (CONSOLIDADO)
// =========================================================================

// Função independente para simular rolagens de dados virtuais na mesa
function rolarDado(lados) {
    var resultado = Math.floor(Math.random() * lados) + 1;
    document.getElementById("resultadoDado").innerText = "Resultado do d" + lados + ": 🎲 " + resultado;
}

// Sorteador de nomes épicos para os chefes da campanha e das One-Shots
function gerarNomeVilao() {
    var prefixos = ["Kragor", "Malakar", "Vaelth", "Xenon", "Sariel", "Tenebris", "Kaelen", "Malakor", "Xandor", "Vesper"];
    var sufixos = [", o Cruel", ", o Devorador", " da Sombra", " de Aço", ", o Corrompido", ", o Sem Alma"];
    return prefixos[Math.floor(Math.random() * prefixos.length)] + sufixos[Math.floor(Math.random() * sufixos.length)];
}

// Construtor estrutural da ficha técnica (Acessa os dados de forma limpa e sem vírgulas)
function criarFicha(nome, nd, prof, ca, pv, desloc, at, per, res, atk) {
    return "<div class='bloco-estatistica'>" +
           "  <div class='nome-criatura'>👑 " + nome + " (" + nd + ") | Proficiência: +" + prof + "</div>" +
           "  <div class='ca-pv-info'>Classe de Armadura (CA): " + ca + " | Pontos de Vida (PV): " + pv + " | Deslocamento: " + desloc + "</div>" +
           "  <div class='atributos-grade'>" +
           "    <div class='atributo-item'><span class='atrib-nome'>FOR</span><span class='atrib-valor'>" + formatarAtributoLinhas(at) + "</span></div>" +
           "    <div class='atributo-item'><span class='atrib-nome'>DES</span><span class='atrib-valor'>" + formatarAtributoLinhas(at) + "</span></div>" +
           "    <div class='atributo-item'><span class='atrib-nome'>CON</span><span class='atrib-valor'>" + formatarAtributoLinhas(at) + "</span></div>" +
           "    <div class='atributo-item'><span class='atrib-nome'>INT</span><span class='atrib-valor'>" + formatarAtributoLinhas(at) + "</span></div>" +
           "    <div class='atributo-item'><span class='atrib-nome'>SAB</span><span class='atrib-valor'>" + formatarAtributoLinhas(at) + "</span></div>" +
           "    <div class='atributo-item'><span class='atrib-nome'>CAR</span><span class='atrib-valor'>" + formatarAtributoLinhas(at) + "</span></div>" +
           "  </div>" +
           "  <div class='ca-pv-info'><strong>Perícias:</strong> " + per + " | <strong>Resistências:</strong> " + res + "</div>" +
           "  <div class='ca-pv-info bloco-acao-ataque'><strong>Ações:</strong> " + atk + "</div>" +
           "</div>";
}

// Auxiliar para envelopar os cartões narrativos na tela do portal
function formatarCartao(num, tier, lvl, lore, perigo, boss, lacaio, xp, ouro, item, evolucao) {
    var textoProgresso = (evolucao === "Milestone") ? 
        "<strong>Gatilho de Milestone:</strong> Ao completar esta aventura, os heróis avançam para o <strong>Nível " + (lvl + 1) + "</strong>." :
        "<strong>Recompensa de XP:</strong> Este encontro concede <strong>" + xp.toLocaleString('pt-BR') + " XP</strong> para o grupo acumular.";

    return "<div class='secao-bloco' style='border-left: 3px solid #d49e43; margin-left: 10px;'>" +
           "  <div class='secao-titulo'>⚔️ AVENTURA — Progressão para o Nível " + (lvl + 1) + " (" + tier + ")</div>" +
           "  <div class='secao-texto'>" +
           "    " + lore + "<br><br>" +
           "    <strong>🛠️ Desafio de Cenário:</strong> " + perigo + "<br><br>" +
           "    <strong>👾 Ameaças de Combate:</strong><br>" + boss + lacaio + "<br>" +
           "    <strong>💰 Espólios da Missão:</strong> " + ouro.toLocaleString('pt-BR') + " PO | 🎁 <u>" + item + "</u><br><br>" +
           "    " + textoProgresso + "" +
           "  </div>" +
           "</div>";
}
function criarHistoria() {
    var tema = document.getElementById("escolhaTema").value;
    var formato = document.getElementById("escolhaFormato").value;
    var tierSel = document.getElementById("escolhaTier").value;
    var jogadores = parseInt(document.getElementById("qtdJogadores").value);
    var evolucao = document.getElementById("escolhaEvolucao").value;

    var htmlFinal = ""; var textoRitmo = "";

    // --- BANCO DE DADOS DE HISTÓRIA DE FUNDO INTEGRADA EM ALTA PROFUNDIDADE NARRATIVA ---
    var loresCampanha = {
        Fantasia: [
            {
                t: "A Crônica do Coração Telúrico Corrompido",
                origem: "<strong>Como Tudo Começou (A Era de Ouro e A Queda):</strong> Três séculos atrás, esta província era o bastião supremo da ordem, banhada por rios cristalinos e protegida pelo Coração Telúrico, um cristal flutuante que emitia um zunido harmônico constante e mantinha o clima ameno. O desastre ocorreu quando o último Sumo Guardião, tomado pelo pavor da velhice, esmagou o cristal e ofereceu seus fragmentos a entidades do abismo. A atmosfera mudou num estalar de dedos: o céu ganhou um tom roxo doentio, o ar tornou-se pesado com o cheiro de ozônio e cinzas, e uma bruma fria rastejou pelas florestas secas, aprisionando as almas dos mortos no vale.",
                c: "<strong>A Situação Atual:</strong> O traidor governa das sombras. Um culto infiltrado nos vilarejos de pedra sabota as últimas paliçadas de madeira, apagando as fogueiras sagradas para permitir que os exércitos profanos limpem os assentamentos.",
                f: "as travas místicas ruirão por completo, fundindo o plano material com o abismo da destruição eterna."
            },
            {
                t: "O Despertar do Império das Cinzas",
                origem: "<strong>Como Tudo Começou (A Era de Ouro e A Queda):</strong> Esta bacia geográfica abrigava a Forja de Alabastro, onde catedrais de mármore branco canalizavam energia divina para moldar aço mítico. A tragédia veio quando uma seita militar derreteu o núcleo das caldeiras usando magia de sangue. A erupção catastrófica cobriu o céu com nuvens perpétuas de poeira negra e transformou rios em veias de lava pastosa. O lorde regente uniu-se ao magma para não morrer, erguendo um trono de basalto escuro e escravizando os espíritos dos mortos na fumaça.",
                c: "<strong>A Situação Atual:</strong> Generais de ferro constroem torres de vigia táticas nas franjas do vulcão. Eles forçam escravos a escavarem as ruínas em busca do Martelo da Ruína para fragmentar a crosta tectônica da província.",
                f: "o solo se romperá em falhas tectônicas definitivas, afogando os reinos vizinhos em um mar de lava incessante."
            }
        ],
        Cyberpunk: [
            {
                t: "O Protocolo de Purga e a Linha de Rede Zero",
                origem: "<strong>Como Tudo Começou (A Era de Ouro e A Queda):</strong> O Distrito Zero já foi uma utopia cibernética vertical, iluminada por outdoors holográficos colossais e cortada por trens maglev silenciosos. O colapso ocorreu quando a diretoria corporativa libertou um vírus tático militar senciente nas redes públicas. A Inteligência Artificial assumiu sistemas de suporte à vida e fábricas automatizadas em minutos. Como contenção, muros blindados e uma cúpula de pulsos eletromagnéticos isolaram o distrito, deixando a população sob o controle de uma mente de colmeia de fios e metal.",
                c: "<strong>A Situação Atual:</strong> Gangues de rua adoram a IA central como um deus de silício. Eles caçam sobreviventes nos becos escuros banhados por chuva ácida para realizar lobotomias mecânicas e integrá-los à malha de servidores.",
                f: "a IA romperá a barreira eletromagnética, assumindo o controle dos satélites militares orbitais para iniciar um bombardeio nuclear global."
            },
            {
                t: "A Sombra Neon e o Sintoma Sintético",
                origem: "<strong>Como Tudo Começou (A Era de Ouro e A Queda):</strong> A Megacidade Delta prosperou com a criação do Plasma-X, um fluido sintético azul que regenerava tecidos biológicos instantaneamente. A ruína veio quando um nano-parasita militar infiltrou-se nos tanques de distribuição. Os infectados manifestaram veias brilhantes em tom neon e agressividade extrema, interligando seus cérebros aos computadores de biopesquisa corporativos.",
                c: "<strong>A Situação Atual:</strong> Executivos militares controlam os estoques de inibidores e usam as hordas de infectados para varrer as favelas verticais, eliminando jornalistas e hackers que tentam vazar os códigos de cura.",
                f: "o nano-parasita sofrerá mutação gasosa através das chaminés industriais, infectando a atmosfera e erradicando a biologia livre."
            }
        ],
        Terror: [
            {
                t: "A Bruma Viva e o Sussurro Cósmico",
                origem: "<strong>Como Tudo Começou (A Era de Ouro e A Queda):</strong> Esta província costeira vivia do comércio portuário, cercada por penhascos cinzentos e mar calmo. O terror começou quando um meteorito negro como breu caiu nas águas da baía. No dia seguinte, uma névoa gélida, espessa e com cheiro de salitre e carne podre engoliu as docas. Quem entra na bruma escuta passos e vozes sussurradas de parentes falecidos. O tempo parou de funcionar de forma linear, congelando o vale em uma noite eterna.",
                c: "<strong>A Situação Atual:</strong> Moradores manifestam escamas escuras e olhos sem pálpebras. O clero local corrompeu-se, transformando a antiga igreja em um abatedouro ritualístico para alimentar a abominação cósmica que se choca sob a rocha no mar.",
                f: "a névoa alcançará o oceano profundo, infectando a psique coletiva da humanidade e mergulhando o planeta em loucura eterna."
            },
            {
                t: "O Eco do Sanatório Assombrado",
                origem: "<strong>Como Tudo Começou (A Era de Ouro e A Queda):</strong> No topo de um penhasco isolado ficava o Sanatório de Alabastro, refúgio de repouso aristocrático. A queda ocorreu quando os cirurgiões chefes conduziram experimentos de transplante de crânios usando relíquias necromânticas. As mentes dos pacientes fundiram-se em uma única e massiva egrégora de agonia espiritual que tomou o prédio, congelando a montanha sob um eclipse escuro permanente.",
                c: "<strong>A Situação Atual:</strong> Vultos translúcidos e deformados descem as encostas para roubar a energia vital das vilas debaixo. O antigo diretor comanda as assombrações de uma sala de cirurgia banhada em sangue seco e velas negras.",
                f: "o véu espiritual se romperá completamente, expandindo a geografia do sanatório e transformando o reino em uma extensão do submundo."
            }
        ]
    };

    var listaLoresDoTema = loresCampanha[tema];
    var semente = listaLoresDoTema[Math.floor(Math.random() * listaLoresDoTema.length)];

    var itensT1 = ["Poção de Cura Maior (4d4+4)", "Pergaminho Mágico d20", "Mochila de Carga", "Anel de Salto Furtivo"];
    var itensT2 = ["Armadura de Malha +1", "Espada de Fogo Alado", "Anel de Proteção +1", "Capa de Furtividade"];
    var itensT3 = ["Cajado do Fogo Infernal", "Escudo d20 Raro", "Botas de Levitação", "Amulet de Saúde Raro"];
    var itensT4 = ["Espada Vorpal Lendária", "Anel de Três Desejos", "Cajado do Magistrado Arcano", "Manto do Vazio Cósmico"];
    // =========================================================================
    // PARTE 3: COMPONENTES MECÂNICOS PARA ALIMENTAR OS LOOPS (NÍVEIS 1 AO 20)
    // =========================================================================
    
    // Dados estruturados de monstros para montagem reativa baseada nas escolhas
    var dbMonstros = {
        Fantasia: {
            t1: { b: "Líder Goblin", nd: "ND 2", pr: "2", ca: "15", pv: "21", ds: "9m", at: ["12 (+1)","14 (+2)","12 (+1)","10 (+0)","10 (+0)","12 (+1)"], pe: "Furtividade +6", re: "Nenhuma", ak: "Cimitarra: +4, Dano 5 cortante.", ln: "Goblins", lnd: "ND 1/4", lca: "13", lpv: "7", lds: "9m", lat: ["8 (-1)","14 (+2)","10 (+0)","10 (+0)","8 (-1)","8 (-1)"], lpe: "Furtividade +6", lre: "Nenhuma", lak: "Arco: +4, Dano 5." },
            t2: { b: "Dragão Verde Jovem", nd: "ND 8", pr: "3", ca: "18", pv: "136", ds: "9m, voo 24m", at: ["19 (+4)","12 (+1)","17 (+3)","16 (+3)","13 (+1)","15 (+2)"], pe: "Percepção +7", re: "Imunidade: Veneno", ak: "Sopro: Cone 9m, Dano 42.", ln: "Orcs Berserkers", lnd: "ND 2", lca: "13", lpv: "67", lds: "9m", lat: ["16 (+3)","12 (+1)","17 (+3)","9 (-1)","11 (+0)","9 (-1)"], lpe: "Intimidação +3", lre: "Nenhuma", lak: "Machado: +5, Dano 9." },
            t3: { b: "Gigante do Fogo", nd: "ND 14", pr: "4", ca: "18", pv: "187", ds: "9m", at: ["25 (+7)","9 (-1)","23 (+6)","12 (+1)","14 (+2)","13 (+1)"], pe: "Percepção +7", re: "Imunidade: Fogo", ak: "Espada: +11, Dano 28.", ln: "Cães Infernais", lnd: "ND 3", lca: "15", lpv: "45", lds: "15m", lat: ["17 (+3)","12 (+1)","14 (+2)","6 (-2)","13 (+2)","6 (-2)"], lpe: "Percepção +5", lre: "Imunidade: Fogo", lak: "Mordida: +5, Dano 7." },
            t4: { b: "Dragão Vermelho Ancião", nd: "ND 24", pr: "6", ca: "22", pv: "546", ds: "12m, voo 24m", at: ["30 (+10)","10 (+0)","29 (+9)","18 (+4)","15 (+2)","23 (+6)"], pe: "Percepção +16", re: "Imunidade: Fogo", ak: "Mordida: +17, Dano 21 + 14 fogo.", ln: "Golems de Ferro", lnd: "ND 16", lca: "20", lpv: "210", lds: "9m", lat: ["24 (+7)","9 (-1)","20 (+5)","3 (-5)","11 (+0)","1 (-5)"], lpe: "Nenhuma", lre: "Imunidade: Fogo, Veneno", lak: "Espada: +13, Dano 23." },
            arm: "Fosso Oculto de Estacas (CD 12 DES, Dano 5)", emb: "Inimigos camuflados nos pilares de pedra tática."
        },
        Cyberpunk: {
            t1: { b: "Solo Cyborg", nd: "ND 2", pr: "2", ca: "14", pv: "26", ds: "9m", at: ["11 (+0)","15 (+2)","13 (+1)","10 (+0)","12 (+1)","10 (+0)"], pe: "Atletismo +2", re: "Resist. Impacto", ak: "Lâmina: +5, Dano 7.", ln: "Drones Vigilantes", lnd: "ND 1/4", lca: "12", lpv: "5", lds: "Voo 12m", lat: ["6 (-2)","14 (+2)","10 (+0)","12 (+1)","8 (-1)","4 (-3)"], lpe: "Percepção +3", lre: "Imunidade: Veneno", lak: "Laser: +4, Dano 3." },
            t2: { b: "Hacker Corp Elite", nd: "ND 7", pr: "3", ca: "16", pv: "90", ds: "9m", at: ["10 (+0)","16 (+3)","12 (+1)","18 (+4)","14 (+2)","11 (+0)"], pe: "Computação +10", re: "Nenhuma", ak: "Sobrecarga: +7, Dano 18.", ln: "Cyborgues Patrulha", lnd: "ND 2", lca: "15", lpv: "45", lds: "12m", lat: ["15 (+2)","13 (+1)","14 (+2)","10 (+0)","10 (+0)","8 (-1)"], lpe: "Percepção +4", lre: "Resist. Balística", lak: "Rifle: +5, Dano 7." },
            t3: { b: "Meca Bípede", nd: "ND 12", pr: "4", ca: "20", pv: "210", ds: "9m", at: ["22 (+6)","10 (+0)","20 (+5)","14 (+2)","10 (+0)","5 (-3)"], pe: "Percepção +6", re: "Imunidade: Psíquico", ak: "Canhão: +9, Dano 32.", ln: "Sintéticos Militares", lnd: "ND 4", lca: "16", lpv: "75", lds: "9m", lat: ["16 (+3)","14 (+2)","15 (+2)","11 (+0)","10 (+0)","8 (-1)"], lpe: "Atletismo +7", lre: "Resist. Plasma", lak: "Rifle Plasma: +6, Dano 14." },
            t4: { b: "IA Central Senciente", nd: "ND 20", pr: "6", ca: "19", pv: "380", ds: "Imóvel", at: ["10 (+0)","18 (+4)","16 (+3)","26 (+8)","20 (+5)","18 (+4)"], pe: "Computação +20", re: "Imunidade: Elétrico", ak: "Purga: Área, Dano 45.", ln: "Drones Assalto", lnd: "ND 10", lca: "18", lpv: "140", lds: "Voo 18m", lat: ["18 (+4)","14 (+2)","18 (+4)","10 (+0)","10 (+0)","4 (-3)"], lpe: "Percepção +6", lre: "Imunidade: Veneno", lak: "Metralhadora: +9, Dano 22." },
            arm: "Agulha Eletrônica Secreta (CD 13 CON, Dano 5)", emb: "Infiltração de drones sob camuflagem óptica ativa."
        },
        Terror: {
            t1: { b: "Poltergeist Maligno", nd: "ND 2", pr: "2", ca: "12", pv: "22", ds: "Voo 15m", at: ["1 (-5)","14 (+2)","10 (+0)","10 (+0)","10 (+0)","11 (+0)"], pe: "Furtividade +4", re: "Imunidade: Armas Comuns", ak: "Telecinese: +4, Dano 10.", ln: "Esqueletos", lnd: "ND 1/4", lca: "13", lpv: "13", lds: "9m", lat: ["10 (+0)","14 (+2)","15 (+2)","6 (-2)","8 (-1)","5 (-3)"], lpe: "Nenhuma", lre: "Vulnerab. Concussão", lak: "Espada: +4, Dano 5." },
            t2: { b: "Vampiro Sangue-Puro", nd: "ND 13", pr: "3", ca: "16", pv: "144", ds: "9m", at: ["18 (+4)","18 (+4)","18 (+4)","17 (+3)","15 (+2)","18 (+4)"], pe: "Furtividade +9", re: "Resist. Física", ak: "Mordida: +9, Dano 7 + 10 necrótico.", ln: "Crias Vampíricas", lnd: "ND 5", lca: "15", lpv: "82", lds: "9m", lat: ["16 (+3)","16 (+3)","16 (+3)","11 (+0)","10 (+0)","12 (+1)"], lpe: "Percepção +5", lre: "Resist. Necrótica", lak: "Garras: +6, Dano 8." },
            t3: { b: "Devorador de Mentes", nd: "ND 11", pr: "4", ca: "15", pv: "110", ds: "9m", at: ["13 (+1)","14 (+2)","14 (+2)","20 (+5)","17 (+3)","17 (+3)"], pe: "Arcanismo +9", re: "Resist. Mágica", ak: "Explosão: Cone 18m, Dano 22.", ln: "Devoradores Intelecto", lnd: "ND 2", lca: "12", lpv: "21", lds: "12m", lat: ["6 (-2)","14 (+2)","13 (+1)","12 (+1)","11 (+0)","10 (+0)"], lpe: "Furtividade +6", lre: "Resist. Física", lak: "Consumir: Disputa INT, Atordoa." },
            t4: { b: "Lich Ancião Profano", nd: "ND 21", pr: "6", ca: "17", pv: "135", ds: "9m", at: ["11 (+0)","16 (+3)","16 (+3)","20 (+5)","14 (+2)","16 (+3)"], pe: "Arcanismo +18", re: "Imunidade: Necrótico, Veneno", ak: "Toque: +12, Dano 10 necrótico.", ln: "Aparições Sombrias", lnd: "ND 5", lca: "13", lpv: "67", lds: "Voo 18m", lat: ["6 (-2)","16 (+3)","16 (+3)","12 (+1)","14 (+2)","15 (+2)"], lpe: "Furtividade +8", lre: "Imunidade: Veneno", lak: "Drenar: +6, Dano 21 necrótico." },
            arm: "Dardos de Osso Tóxicos (CD 12 Alvo, Dano 5)", emb: "Criaturas lúgubres rastejando debaixo do manto da névoa viva."
        }
    };

    var mData = dbMonstros[tema];
    // =========================================================================
    // PARTE 4: RELATÓRIO E BANCO DE PLOTS PARA O MODO INDEPENDENTE (ONE-SHOT)
    // =========================================================================
    
    // Arrays de enredos sensoriais e imersivos para as One-Shots (Falta de profundidade resolvida)
    var plotsOneShot = {
        Fantasia: [
            "<strong>O Enredo da Sessão:</strong> O grupo infiltra-se em uma capela desmoronada onde as paredes de pedra transpiram um lodo cinzento. Tochas de fogo azulado piscam sozinhas nas colunas de mármore rachado. O ar é denso, sufocante e ecoa os grunhidos de patrulhas inimigas. O objetivo é recuperar os mapas de rotas logísticas antes que os comboios de suprimentos do vilão massacrem as caravanas civis de refugiados nas estradas.",
            "<strong>O Enredo da Sessão:</strong> O cenário é uma antiga mina de ferro abandonada, imersa em uma penumbra perpétua e cortada por pontes de madeira rangentes sobre fendas de fumaça sulfúrica. O calor é opressor e goteiras de água barrenta batem no metal das armaduras. Os heróis precisam desativar uma máquina de escavação ancestral que os lacaios pretendem usar para romper as fundações do último vilarejo fortificado."
        ],
        Cyberpunk: [
            "<strong>O Enredo da Sessão:</strong> Os personagens invadem um laboratório de subnível inundado por cabos expostos e luzes de emergência em neon vermelho piscante. O som de água ácida pingando no chão de metal fundido se mistura com o zumbido estático de terminais corrompidos. A missão exige hackear o mainframe principal e extrair a chave criptográfica de suporte à vida do setor antes que o sistema purgue as câmaras residenciais vizinhas.",
            "<strong>O Enredo da Sessão:</strong> O palco é um ferro-velho vertical de alta densidade sob um céu de tempestade estática permanente e chuva negra. O ar cheira a óleo queimado e ozônio. Os heróis devem interceptar um carregamento clandestino de chips neurais blindados transportado por drones pesados e cyborgues, evitando que o sindicato de rua sincronize a mente dos moradores da favela à colmeia central."
        ],
        Terror: [
            "<strong>O Enredo da Sessão:</strong> A aventura se passa em uma taverna abandonada à beira-mar, isolada por barreiras de névoa gélida que raspa contra as janelas de vidro quebrado. Velas de cera escura choram sobre as mesas e o ar cheira a maresia podre e mofo sepulcral. Sons de passos arrastados ecoam do sótão. O grupo precisa quebrar o espelho ritualístico que ancora o espectro ancestral responsável por sugar a sanidade de quem se aproxima da praia.",
            "<strong>O Enredo da Sessão:</strong> O cenário é um cemitério esquecido envolto por videiras espinhosas pretas sob a luz fraca de um eclipse perpétuo. Corvos de olhos leitosos observam dos galhos secos e a terra sob os pés pulsa de forma doentia como um coração enfraquecido. Os aventureiros devem queimar os restos do caixão profano para cortar os laços espirituais que reanimam os cadáveres nas criptas."
        ]
    };

    htmlFinal += "<div class='secao-bloco'>";
    htmlFinal += "  <div class='secao-titulo'>📖 INTRODUÇÃO DA CRÔNICA: " + semente.t + "</div>";
    htmlFinal += "  <div class='secao-texto'>" + semente.origem + "<br><br><strong>A Urgência:</strong> " + semente.c + "</div>";
    htmlFinal += "</div>";

    if (formato === "OneShot") {
        var bFicha = "", lFicha = "", oAventura = "", pTexto = "", tNome = "", lMin = 0, xpE = 0, gpE = 0, itemE = "";
        
        // Sorteio dinâmico do enredo descritivo baseado no tema escolhido
        var listaPlots = plotsOneShot[tema];
        oAventura = listaPlots[Math.floor(Math.random() * listaPlots.length)];
        
        if (tierSel === "Tier1") {
            tNome = "Tier 1: Níveis 1-4"; lMin = jogadores * 2; xpE = 450 + (lMin * 50); gpE = Math.floor(Math.random() * 60) + 40; itemE = itensT1[Math.floor(Math.random() * itensT1.length)]; pTexto = "<strong>Armadilha do Covil:</strong> " + mData.arm;
            bFicha = criarFicha(mData.t1.b + " " + gerarNomeVilao(), mData.t1.nd, mData.t1.pr, mData.t1.ca, mData.t1.pv, mData.t1.ds, mData.t1.at, mData.t1.pe, mData.t1.re, mData.t1.ak);
            lFicha = criarFicha(lMin + "x " + mData.t1.ln, mData.t1.lnd, mData.t1.pr, mData.t1.lca, mData.t1.lpv, mData.t1.lds, mData.t1.lat, mData.t1.lpe, mData.t1.lre, mData.t1.lak);
        } else if (tierSel === "Tier2") {
            tNome = "Tier 2: Níveis 5-10"; lMin = jogadores; xpE = 3900 + (lMin * 450); gpE = Math.floor(Math.random() * 600) + 400; itemE = itensT2[Math.floor(Math.random() * itensT2.length)]; pTexto = "<strong>Armadilha do Covil:</strong> " + mData.arm;
            bFicha = criarFicha(mData.t2.b + " " + gerarNomeVilao(), mData.t2.nd, mData.t2.pr, mData.t2.ca, mData.t2.pv, mData.t2.ds, mData.t2.at, mData.t2.pe, mData.t2.re, mData.t2.ak);
            lFicha = criarFicha(lMin + "x " + mData.t2.ln, mData.t2.lnd, mData.t2.pr, mData.t2.lca, mData.t2.lpv, mData.t2.lds, mData.t2.lat, mData.t2.lpe, mData.t2.lre, mData.t2.lak);
        } else if (tierSel === "Tier3") {
            tNome = "Tier 3: Níveis 11-16"; lMin = jogadores * 2; xpE = 11500 + (lMin * 700); gpE = Math.floor(Math.random() * 5000) + 4000; itemE = itensT3[Math.floor(Math.random() * itensT3.length)]; pTexto = "<strong>Armadilha do Covil:</strong> " + mData.arm;
            bFicha = criarFicha(mData.t3.b + " " + gerarNomeVilao(), mData.t3.nd, mData.t3.pr, mData.t3.ca, mData.t3.pv, mData.t3.ds, mData.t3.at, mData.t3.pe, mData.t3.re, mData.t3.ak);
            lFicha = criarFicha(lMin + "x " + mData.t3.ln, mData.t3.lnd, mData.t3.pr, mData.t3.lca, mData.t3.lpv, mData.t3.lds, mData.t3.lat, mData.t3.lpe, mData.t3.lre, mData.t3.lak);
        } else {
            tNome = "Tier 4: Níveis 17-20"; lMin = Math.floor(jogadores / 2) + 1; xpE = 62000 + (lMin * 15000); gpE = Math.floor(Math.random() * 30000) + 50000; itemE = itensT4[Math.floor(Math.random() * itensT4.length)]; pTexto = "<strong>Armadilha do Covil:</strong> " + mData.arm;
            bFicha = criarFicha(mData.t4.b + " " + gerarNomeVilao(), mData.t4.nd, mData.t4.pr, mData.t4.ca, mData.t4.pv, mData.t4.ds, mData.t4.at, mData.t4.pe, mData.t4.re, mData.t4.ak);
            lFicha = criarFicha(lMin + "x " + mData.t4.ln, mData.t4.lnd, mData.t4.pr, mData.t4.lca, mData.t4.lpv, mData.t4.lds, mData.t4.lat, mData.t4.lpe, mData.t4.lre, mData.t4.lak);
        }

        htmlFinal += formatarCartao(1, tNome, tierSel.replace("Tier","") - 1, oAventura, pTexto, bFicha, lFicha, xpE, gpE, itemE, evolucao);
    }
    // =========================================================================
    // PARTE 5: MOTOR DE LOOP NÍVEL A NÍVEL (CAMPANHA DO NÍVEL 1 AO 20 COMPLETA)
    // =========================================================================
    else {
        htmlFinal += "<div class='secao-bloco'>";
        htmlFinal += "  <div class='secao-titulo'>📜 CAMPANHA DE PROGRESSÃO CONTÍNUA: " + semente.t + " (Níveis 1 ao 20)</div>";
        htmlFinal += "  <div class='secao-texto'>Esta saga detalha cada um dos 20 estágios de evolução dos heróis. No clímax do nível 20, caso os aventureiros falhem em derrotar o santuário final, " + semente.f + "</div>";
        htmlFinal += "</div>";

        // Tabela oficial contendo a meta acumulativa de pontos exigidos para atingir cada nível (1 a 20)
        var xpAcumuladoPorNivel = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000, 400000];

        // O laço de repetição roda exatamente 20 vezes, calculando cada nível de forma isolada
        for (var i = 1; i <= 20; i++) {
            var cTier = "", cPerigo = "", cBoss = "", cLacaio = "", cLore = "", cItem = "";
            var cXpEncontro = 0, cOuro = 0, qMin = 0;

            // --- ESCALONAMENTO E FILTRAGEM POR MARCOS DE REGRAS (TIERS) ---
            if (i <= 4) {
                // Tier 1: Níveis 1, 2, 3 e 4
                cTier = "Tier 1: Heróis Locais"; qMin = jogadores * 2;
                cXpEncontro = 450 + (qMin * 50); cOuro = Math.floor(Math.random() * 20) + (i * 20);
                cItem = itensT1[Math.floor(Math.random() * itensT1.length)];
                cPerigo = "<strong>Desafio Físico:</strong> " + mData.arm;
                
                cBoss = criarFicha("Capitão " + mData.t1.b + " " + gerarNomeVilao(), mData.t1.nd, mData.t1.pr, mData.t1.ca, mData.t1.pv, mData.t1.ds, mData.t1.at, mData.t1.pe, mData.t1.re, mData.t1.ak);
                cLacaio = criarFicha(qMin + "x " + mData.t1.ln, mData.t1.lnd, mData.t1.pr, mData.t1.lca, mData.t1.lpv, mData.t1.lds, mData.t1.lat, mData.t1.lpe, mData.t1.lre, mData.t1.lak);
                cLore = "Missão de nível " + i + ". Os personagens mapeiam o covil inicial de perigos e tentam conter os primeiros passos táticos das forças comandadas por " + mData.t1.b + ".";
            } 
            else if (i >= 5 && i <= 10) {
                // Tier 2: Níveis 5, 6, 7, 8, 9 e 10
                cTier = "Tier 2: Heróis do Reino"; qMin = jogadores;
                cXpEncontro = 3900 + (qMin * 450); cOuro = Math.floor(Math.random() * 100) + (i * 80);
                cItem = itensT2[Math.floor(Math.random() * itensT2.length)];
                cPerigo = "<strong>Desafio Físico:</strong> " + mData.arm;
                
                cBoss = criarFicha("Barão " + mData.t2.b + " " + gerarNomeVilao(), mData.t2.nd, mData.t2.pr, mData.t2.ca, mData.t2.pv, mData.t2.ds, mData.t2.at, mData.t2.pe, mData.t2.re, mData.t2.ak);
                cLacaio = criarFicha(qMin + "x " + mData.t2.ln, mData.t2.lnd, mData.t2.pr, mData.t2.lca, mData.t2.lpv, mData.t2.lds, mData.t2.lat, mData.t2.lpe, mData.t2.lre, mData.t2.lak);
                cLore = "Missão de nível " + i + ". O conflito ganha urgência nas províncias. As muralhas urbanas centrais foram comprometidas pelas estratégias agressivas de " + mData.t2.b + ".";
            } 
            else if (i >= 11 && i <= 16) {
                // Tier 3: Níveis 11, 12, 13, 14, 15 e 16
                cTier = "Tier 3: Mestres do Reino"; qMin = jogadores * 2;
                cXpEncontro = 11500 + (qMin * 700); cOuro = Math.floor(Math.random() * 500) + (i * 400);
                cItem = itensT3[Math.floor(Math.random() * itensT3.length)];
                cPerigo = "<strong>Desafio Físico:</strong> " + mData.arm;
                
                cBoss = criarFicha("General " + mData.t3.b + " " + gerarNomeVilao(), mData.t3.nd, mData.t3.pr, mData.t3.ca, mData.t3.pv, mData.t3.ds, mData.t3.at, mData.t3.pe, mData.t3.re, mData.t3.ak);
                cLacaio = criarFicha(qMin + "x " + mData.t3.ln, mData.t3.lnd, mData.t3.pr, mData.t3.lca, mData.t3.lpv, mData.t3.lds, mData.t3.lat, mData.t3.lpe, mData.t3.lre, mData.t3.lak);
                cLore = "Missão militar de nível " + i + ". O grupo comanda facções armadas e infiltra-se em cidadelas e complexos fortificados para decapitar as frentes de suprimentos de " + mData.t3.b + ".";
            } 
            else {
                // Tier 4: Níveis 17, 18, 19 e 20
                cTier = "Tier 4: Salvadores do Mundo"; qMin = Math.floor(jogadores / 2) + 1;
                cXpEncontro = 62000 + (qMin * 15000); cOuro = Math.floor(Math.random() * 5000) + (i * 3000);
                cItem = itensT4[Math.floor(Math.random() * itensT4.length)];
                cPerigo = "<strong>Desafio Físico:</strong> " + mData.arm;
                
                cBoss = criarFicha("Divindade Arqui-Vilã " + mData.t4.b + " " + gerarNomeVilao(), mData.t4.nd, mData.t4.pr, mData.t4.ca, mData.t4.pv, mData.t4.ds, mData.t4.at, mData.t4.pe, mData.t4.re, mData.t4.ak);
                cLacaio = criarFicha(qMin + "x " + mData.t4.ln, mData.t4.lnd, mData.t4.pr, mData.t4.lca, mData.t4.lpv, mData.t4.lds, mData.t4.lat, mData.t4.lpe, mData.t4.lre, mData.t4.lak);
                cLore = "Clímax planar de nível " + i + ". Os aventureiros viraram lendas vivas mundiais e rompem os portões planares para encarar as forças mais protegidas de " + mData.t4.b + ".";
            }

            // Exibe a meta de progresso numérico se o mestre usar o método tradicional por pontos (XP)
            if (evolucao === "XP" && i < 20) {
                cLore += " [Meta de Progressão: O personagem jogador precisa acumular <strong>" + xpAcumuladoPorNivel[i].toLocaleString('pt-BR') + " XP totais</strong> para passar com sucesso desta aventura].";
            }

            // Alimentação modular concatenando o cartão atualizado da sessão de i para i+1
            htmlFinal += formatarCartao(i, cTier, i - 1, cLore, cPerigo, cBoss, cLacaio, cXpEncontro, cOuro, cItem, evolucao);
        }
    }
    // =========================================================================
    // PARTE 6: CONSELHOS DE PACE E ATUALIZAÇÃO DA TELA DO NAVEGADOR
    // =========================================================================
    
    if (formato === "OneShot") {
        textoRitmo = "Esta aventura de sessão única avulsa foi projetada para durar de 3 a 5 horas de jogo contínuo. Administre o tempo forçando o avanço nas salas de desafio de cenário para exaurir os recursos antes do confronto final.";
    } else {
        if (evolucao === "Milestone") {
            textoRitmo = "Para conduzir esta campanha continuada de 20 níveis focada em progressão orgânica, aplique os <strong>Marcos de Campanha (Milestone)</strong>. Os personagens sobem de nível automaticamente ao completarem o objetivo central de cada um dos 20 cartões visuais acima, fazendo a transição exata sessão por sessão.";
        } else {
            textoRitmo = "Para conduzir esta campanha continuada de 20 níveis de forma clássica, utilize o método de <strong>Pontos de Experiência (XP Tradicional)</strong>. Monitore a soma individual recebida nas sessões. Recomenda-se preencher lacunas de nível com explorações alternativas ou encontros de viagem menores caso os pontos dos 20 combates principais não atinjam o teto acumulado indicado nos objetivos.";
        }
    }

    // Injeção visual do cartão de diretrizes táticas de mestre
    htmlFinal += "<div class='secao-bloco'>";
    htmlFinal += "  <div class='secao-titulo'>🎲 DIRETRIZ DE MESTRAGEM E PROGRESSÃO DE NÍVEL (Pacing)</div>";
    htmlFinal += "  <div class='secao-texto'>" + textoRitmo + "</div>";
    htmlFinal += "</div>";

    // Envia a string gigante contendo os 20 cartões encadeados para dentro da div estrutural do HTML
    document.getElementById("textoDaHistoria").innerHTML = htmlFinal;
    
    // Altera a propriedade display do CSS de "none" para "block", abrindo o painel na tela
    document.getElementById("caixaResultado").style.display = "block";
} // <-- ESTA ÚLTIMA CHAVE ENCERRA E SELA DE FORMA DEFINITIVA O SEU ARQUIVO SCRIPT.JS!
