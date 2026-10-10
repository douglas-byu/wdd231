// ==========================================================================
//  ALUGAFÁCIL - MÓDULO PRINCIPAL (ES MODULE)
//  principal.js | WDD 231 - Projeto Final
// ==========================================================================

// --- CHAVE DO LOCALSTORAGE ---
const CHAVE_FAVORITOS = 'alugafacil_favoritos';

// --- GERENCIAMENTO DE FAVORITOS (LOCALSTORAGE) ---
export function obterFavoritos() {
  try {
    const dados = localStorage.getItem(CHAVE_FAVORITOS);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error('Erro ao ler favoritos do localStorage:', erro);
    return [];
  }
}

export function salvarFavoritos(listaIds) {
  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(listaIds));
    atualizarBadgeFavoritos();
  } catch (erro) {
    console.error('Erro ao salvar favoritos no localStorage:', erro);
  }
}

export function alternarFavorito(id) {
  const favoritos = obterFavoritos();
  const index = favoritos.indexOf(id);
  let adicionado = false;

  if (index >= 0) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(id);
    adicionado = true;
  }

  salvarFavoritos(favoritos);
  return adicionado;
}

export function atualizarBadgeFavoritos() {
  const badges = document.querySelectorAll('.nav-favoritos-badge');
  const total = obterFavoritos().length;
  badges.forEach(badge => {
    badge.textContent = total;
    badge.classList.toggle('oculto', total === 0);
  });
}

// --- MENU HAMBÚRGUER RESPONSIVO ---
function configurarMenuHamburguer() {
  const botaoMenu = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!botaoMenu || !navMenu) return;

  botaoMenu.addEventListener('click', () => {
    const aberto = navMenu.classList.toggle('ativo');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
  });

  // Fechar menu ao clicar fora em telas pequenas
  document.addEventListener('click', (evento) => {
    if (!botaoMenu.contains(evento.target) && !navMenu.contains(evento.target)) {
      navMenu.classList.remove('ativo');
      botaoMenu.setAttribute('aria-expanded', 'false');
    }
  });
}

// --- ATUALIZAÇÃO DO RODAPÉ (DATA E ANO DINÂMICOS) ---
function configurarRodape() {
  const anoElemento = document.getElementById('ano-atual');
  if (anoElemento) {
    anoElemento.textContent = new Date().getFullYear();
  }

  const modifElemento = document.getElementById('ultima-modificacao');
  if (modifElemento) {
    modifElemento.textContent = `Última Modificação: ${document.lastModified}`;
  }
}

// --- INICIALIZAÇÃO GLOBAL ---
document.addEventListener('DOMContentLoaded', () => {
  configurarMenuHamburguer();
  configurarRodape();
  atualizarBadgeFavoritos();
});
