/*
  Configuração central da integração com o Foundry VTT.
  Troque FOUNDRY_JOIN_URL quando hospedar a mesa em domínio próprio.
  Exemplo recomendado: https://vtt.mestreorc.com.br/join
*/
const FOUNDRY_JOIN_URL = 'http://140.238.176.152:30000/join';
const FOUNDRY_STATUS_URL = 'http://140.238.176.152:30000';

function applyFoundryLinks() {
  const foundryLinks = document.querySelectorAll('[data-foundry-link]');
  foundryLinks.forEach((link) => {
    link.setAttribute('href', FOUNDRY_JOIN_URL);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });
}

document.addEventListener('DOMContentLoaded', applyFoundryLinks);
