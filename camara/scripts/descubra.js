// descubra.js - Modulo ES | Pagina Descubra Salvador
// WDD 231 - Camara de Comercio de Salvador | Douglas Silva

import { atrativos } from '../data/atrativos.mjs';

// ============================================================
// 1. RENDERIZAR CARTOES DE ATRATIVOS
// ============================================================
const galeria = document.getElementById('galeria-atrativos');

if (galeria) {
  atrativos.forEach((atrativo, index) => {
    const cartao = document.createElement('article');
    cartao.classList.add('card-atrativo');
    cartao.style.gridArea = `card${index + 1}`;

    cartao.innerHTML = `
      <h2>${atrativo.nome}</h2>
      <figure>
        <img
          src="${atrativo.imagem}"
          alt="${atrativo.alt}"
          width="300"
          height="200"
          loading="lazy"
        >
      </figure>
      <address>${atrativo.endereco}</address>
      <p>${atrativo.descricao}</p>
      <button
        type="button"
        class="botao-saiba-mais"
        data-index="${index}"
        aria-label="Saiba mais sobre ${atrativo.nome}"
      >Saiba Mais</button>
    `;

    galeria.appendChild(cartao);
  });

  // Delegacao de eventos para os botoes "Saiba Mais"
  galeria.addEventListener('click', (e) => {
    if (e.target.classList.contains('botao-saiba-mais')) {
      const idx = Number(e.target.dataset.index);
      const item = atrativos[idx];
      alert(`${item.nome}\n\n${item.descricao}\n\nEndereco: ${item.endereco}`);
    }
  });
}

// ============================================================
// 2. LOCALSTORAGE - MENSAGEM DE ULTIMA VISITA
// ============================================================
const mensagemVisita = document.getElementById('mensagem-visita');

if (mensagemVisita) {
  const agora = Date.now();
  const chave = 'ultima-visita-descubra';
  const ultimaVisita = localStorage.getItem(chave);

  if (!ultimaVisita) {
    // Primeiro acesso
    mensagemVisita.textContent = 'Boas-vindas! Entre em contato conosco caso tenha alguma duvida.';
  } else {
    const diasDecorridos = Math.floor((agora - Number(ultimaVisita)) / (1000 * 60 * 60 * 24));

    if (diasDecorridos < 1) {
      mensagemVisita.textContent = 'Ja voltou? Que legal!';
    } else {
      const unidade = diasDecorridos === 1 ? 'dia' : 'dias';
      mensagemVisita.textContent = `Seu ultimo acesso foi ha ${diasDecorridos} ${unidade}.`;
    }
  }

  // Atualiza data do ultimo acesso
  localStorage.setItem(chave, agora);
}

// ============================================================
// 3. MENU DE NAVEGACAO HAMBURGUER
// ============================================================
const botaoMenu = document.getElementById('botao-menu-hamburguer');
const menuNav = document.getElementById('menu-navegacao');

if (botaoMenu && menuNav) {
  botaoMenu.addEventListener('click', () => {
    menuNav.classList.toggle('aberto');
    const estaAberto = menuNav.classList.contains('aberto');
    botaoMenu.setAttribute('aria-expanded', String(estaAberto));
  });
}

// ============================================================
// 4. RODAPE - ANO ATUAL E ULTIMA MODIFICACAO
// ============================================================
const spanAno = document.getElementById('anoAtual');
if (spanAno) {
  spanAno.textContent = new Date().getFullYear();
}

const spanMod = document.getElementById('ultimaModificacao');
if (spanMod) {
  spanMod.textContent = `Ultima modificacao: ${new Date(document.lastModified).toLocaleDateString('pt-BR')}`;
}
