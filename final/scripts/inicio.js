// ==========================================================================
//  ALUGAFÁCIL - MÓDULO DA PÁGINA INICIAL (ES MODULE)
//  inicio.js | WDD 231 - Projeto Final
// ==========================================================================

import { obterFavoritos, alternarFavorito } from './principal.js';

const gradeDestaques = document.getElementById('grade-destaques');
const formBuscaHero = document.getElementById('form-busca-hero');

// --- CARREGAR IMÓVEIS EM DESTAQUE VIA FETCH E TRY...CATCH ---
async function carregarDestaques() {
  if (!gradeDestaques) return;

  try {
    const resposta = await fetch('dados/imoveis.json');
    if (!resposta.ok) {
      throw new Error(`Erro de rede: ${resposta.status}`);
    }

    const imoveis = await resposta.json();
    // Uso de ARRAY.FILTER() para selecionar imóveis em destaque
    const destaques = imoveis.filter(item => item.destaque === true).slice(0, 3);

    renderizarDestaques(destaques);
  } catch (erro) {
    console.error('Erro ao carregar destaques:', erro);
    gradeDestaques.innerHTML = `
      <p class="mensagem-feedback feedback-grid-completo">
        Não foi possível carregar os destaques no momento.
      </p>
    `;
  }
}

function renderizarDestaques(destaques) {
  gradeDestaques.innerHTML = '';
  const favoritos = obterFavoritos();

  destaques.forEach(imovel => {
    const ehFavorito = favoritos.includes(imovel.id);
    const card = document.createElement('article');
    card.className = 'card-imovel';

    card.innerHTML = `
      <div class="card-imagem-wrapper">
        <img
          src="${imovel.imagem}"
          alt="Imóvel em destaque: ${imovel.titulo}"
          class="card-imagem"
          width="400"
          height="225"
          loading="lazy"
        >
        <span class="badge-tipo">${imovel.tipo}</span>
        <button
          type="button"
          class="btn-favoritar ${ehFavorito ? 'favorito' : ''}"
          data-id="${imovel.id}"
          aria-label="${ehFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
        >
          ${ehFavorito ? '❤️' : '🤍'}
        </button>
      </div>

      <div class="card-conteudo">
        <div class="card-preco-box">
          <span class="card-preco">R$ ${imovel.preco.toLocaleString('pt-BR')}</span>
          <span class="card-periodo">/mês</span>
        </div>

        <h3 class="card-titulo">${imovel.titulo}</h3>
        <p class="card-endereco">📍 ${imovel.bairro}, ${imovel.cidade}</p>

        <div class="card-atributos">
          <div class="atributo-item"><span>📐</span> <strong>${imovel.area} m²</strong></div>
          <div class="atributo-item"><span>🛏️</span> <strong>${imovel.quartos} qtos</strong></div>
          <div class="atributo-item"><span>🚿</span> <strong>${imovel.banheiros} banh</strong></div>
          <div class="atributo-item"><span>🚗</span> <strong>${imovel.vagas} vagas</strong></div>
        </div>

        <div class="card-acoes">
          <a href="imoveis.html?busca=${encodeURIComponent(imovel.bairro)}" class="btn-detalhes">
            Ver Detalhes
          </a>
        </div>
      </div>
    `;

    gradeDestaques.appendChild(card);
  });

  // Vincular clique de favoritar nos destaques
  const botoesFavoritos = gradeDestaques.querySelectorAll('.btn-favoritar');
  botoesFavoritos.forEach(botao => {
    botao.addEventListener('click', () => {
      const id = parseInt(botao.dataset.id);
      const adicionado = alternarFavorito(id);
      botao.classList.toggle('favorito', adicionado);
      botao.innerHTML = adicionado ? '❤️' : '🤍';
    });
  });
}

// --- FORMULÁRIO DE BUSCA RÁPIDA NO HERO ---
function configurarBuscaHero() {
  if (!formBuscaHero) return;

  formBuscaHero.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const termo = document.getElementById('hero-busca-texto').value.trim();
    const tipo = document.getElementById('hero-busca-tipo').value;

    const params = new URLSearchParams();
    if (termo) params.set('busca', termo);
    if (tipo && tipo !== 'todos') params.set('tipo', tipo);

    window.location.href = `imoveis.html?${params.toString()}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  configurarBuscaHero();
  carregarDestaques();
});
