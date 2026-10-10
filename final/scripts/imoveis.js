// ==========================================================================
//  ALUGAFÁCIL - MÓDULO DE IMÓVEIS (ES MODULE)
//  imoveis.js | WDD 231 - Projeto Final
// ==========================================================================

import { obterFavoritos, alternarFavorito, atualizarBadgeFavoritos } from './principal.js';

let listaTodosImoveis = [];

// --- SELETORES DO DOM ---
const gradeContainer = document.getElementById('grade-imoveis');
const contadorElemento = document.getElementById('contador-imoveis');
const mediaPrecosElemento = document.getElementById('media-precos');
const modalDialog = document.getElementById('modal-detalhes');
const modalConteudo = document.getElementById('modal-conteudo');
const btnFecharModal = document.getElementById('btn-fechar-modal');

// Filtros
const inputBusca = document.getElementById('filtro-busca');
const selectTipo = document.getElementById('filtro-tipo');
const selectQuartos = document.getElementById('filtro-quartos');
const selectPreco = document.getElementById('filtro-preco');

// --- BUSCA ASSÍNCRONA DE DADOS COM TRY...CATCH ---
export async function carregarImoveis() {
  if (!gradeContainer) return;

  gradeContainer.innerHTML = '<p class="mensagem-feedback">Carregando imóveis disponíveis...</p>';

  try {
    const resposta = await fetch('dados/imoveis.json');
    if (!resposta.ok) {
      throw new Error(`Falha na requisição: ${resposta.status} - ${resposta.statusText}`);
    }

    const dados = await resposta.json();
    listaTodosImoveis = dados;

    // Verificar se há parâmetros na URL (ex: busca vinda da home page)
    aplicarParametrosURL();

    // Renderizar listagem inicial
    filtrarERenderizar();
  } catch (erro) {
    console.error('Erro ao buscar lista de imóveis:', erro);
    gradeContainer.innerHTML = `
      <div class="mensagem-feedback">
        <p>⚠️ Ocorreu um erro ao carregar os dados dos imóveis.</p>
        <p><small>${erro.message}</small></p>
        <button class="btn-primario espacamento-topo-md" onclick="location.reload()">Tentar Novamente</button>
      </div>
    `;
  }
}

// --- LEITURA DE PARÂMETROS DA URL ---
function aplicarParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  const buscaParam = params.get('busca');
  const tipoParam = params.get('tipo');

  if (buscaParam && inputBusca) {
    inputBusca.value = buscaParam;
  }
  if (tipoParam && selectTipo) {
    selectTipo.value = tipoParam;
  }
}

// --- FILTRAGEM COM MÉTODOS DE ARRAY ---
function filtrarERenderizar() {
  if (!gradeContainer) return;

  const termoBusca = inputBusca ? inputBusca.value.trim().toLowerCase() : '';
  const tipoSelecionado = selectTipo ? selectTipo.value : 'todos';
  const quartosMinimos = selectQuartos ? parseInt(selectQuartos.value) || 0 : 0;
  const precoMaximo = selectPreco ? parseInt(selectPreco.value) || 0 : 0;

  // 1. Uso de ARRAY.FILTER()
  const imoveisFiltrados = listaTodosImoveis.filter(imovel => {
    // Filtro por texto (título, bairro, cidade ou descrição)
    const correspondeBusca = !termoBusca ||
      imovel.titulo.toLowerCase().includes(termoBusca) ||
      imovel.bairro.toLowerCase().includes(termoBusca) ||
      imovel.cidade.toLowerCase().includes(termoBusca) ||
      imovel.descricao.toLowerCase().includes(termoBusca);

    // Filtro por tipo de imóvel
    const correspondeTipo = (tipoSelecionado === 'todos') || (imovel.tipo === tipoSelecionado);

    // Filtro por número de quartos
    const correspondeQuartos = (quartosMinimos === 0) || (imovel.quartos >= quartosMinimos);

    // Filtro por faixa de preço
    const correspondePreco = (precoMaximo === 0) || (imovel.preco <= precoMaximo);

    return correspondeBusca && correspondeTipo && correspondeQuartos && correspondePreco;
  });

  // Atualizar contadores com ARRAY.REDUCE()
  atualizarEstatisticas(imoveisFiltrados);

  // Renderizar cards
  renderizarCards(imoveisFiltrados);
}

// --- ATUALIZAÇÃO DE ESTATÍSTICAS COM ARRAY.REDUCE() ---
function atualizarEstatisticas(imoveis) {
  if (contadorElemento) {
    contadorElemento.textContent = `Exibindo ${imoveis.length} de ${listaTodosImoveis.length} imóveis disponíveis`;
  }

  if (mediaPrecosElemento && imoveis.length > 0) {
    // Uso de ARRAY.REDUCE() para calcular valor médio de aluguel
    const somaTotal = imoveis.reduce((acumulador, imovel) => acumulador + imovel.preco, 0);
    const media = Math.round(somaTotal / imoveis.length);
    mediaPrecosElemento.textContent = `Preço médio: R$ ${media.toLocaleString('pt-BR')}/mês`;
    mediaPrecosElemento.classList.remove('oculto');
  } else if (mediaPrecosElemento) {
    mediaPrecosElemento.classList.add('oculto');
  }
}

// --- RENDERIZAÇÃO DOS CARDS COM TEMPLATE LITERALS ---
function renderizarCards(imoveis) {
  gradeContainer.innerHTML = '';

  if (imoveis.length === 0) {
    gradeContainer.innerHTML = `
      <div class="mensagem-feedback">
        <p>🔍 Nenhum imóvel encontrado com os filtros selecionados.</p>
        <p>Tente ajustar os critérios de busca ou limpar os filtros.</p>
        <button class="btn-outline espacamento-topo-md" id="btn-limpar-filtros">Limpar Filtros</button>
      </div>
    `;

    const btnLimpar = document.getElementById('btn-limpar-filtros');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', limparFiltros);
    }
    return;
  }

  const favoritos = obterFavoritos();

  // 2. Uso de ARRAY.FOREACH()
  imoveis.forEach(imovel => {
    const ehFavorito = favoritos.includes(imovel.id);

    const card = document.createElement('article');
    card.className = 'card-imovel';

    // Construção semântica com Template Literals exibindo mais de 4 propriedades distintas
    card.innerHTML = `
      <div class="card-imagem-wrapper">
        <img
          src="${imovel.imagem}"
          alt="Foto do imóvel: ${imovel.titulo} no bairro ${imovel.bairro}"
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
          title="Salvar como favorito"
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

        <!-- Propriedades distintas de dados -->
        <div class="card-atributos">
          <div class="atributo-item" title="Área útil">
            <span>📐</span> <strong>${imovel.area} m²</strong>
          </div>
          <div class="atributo-item" title="Quartos">
            <span>🛏️</span> <strong>${imovel.quartos} ${imovel.quartos === 1 ? 'quarto' : 'quartos'}</strong>
          </div>
          <div class="atributo-item" title="Banheiros">
            <span>🚿</span> <strong>${imovel.banheiros} banh.</strong>
          </div>
          <div class="atributo-item" title="Vagas de Garagem">
            <span>🚗</span> <strong>${imovel.vagas} ${imovel.vagas === 1 ? 'vaga' : 'vagas'}</strong>
          </div>
        </div>

        <div class="card-acoes">
          <button
            type="button"
            class="btn-detalhes"
            data-id="${imovel.id}"
            aria-haspopup="dialog"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    `;

    gradeContainer.appendChild(card);
  });

  // Vincular eventos aos botões gerados dinamicamente
  configurarEventosCards();
}

// --- EVENTOS NOS CARDS DINÂMICOS ---
function configurarEventosCards() {
  // Botões de Detalhes (Abrir Modal)
  const botoesDetalhes = gradeContainer.querySelectorAll('.btn-detalhes');
  botoesDetalhes.forEach(botao => {
    botao.addEventListener('click', () => {
      const id = parseInt(botao.dataset.id);
      abrirModalDetalhes(id);
    });
  });

  // Botões de Favoritar (Persistir no LocalStorage)
  const botoesFavoritos = gradeContainer.querySelectorAll('.btn-favoritar');
  botoesFavoritos.forEach(botao => {
    botao.addEventListener('click', () => {
      const id = parseInt(botao.dataset.id);
      const adicionado = alternarFavorito(id);

      if (adicionado) {
        botao.classList.add('favorito');
        botao.innerHTML = '❤️';
        botao.setAttribute('aria-label', 'Remover dos favoritos');
      } else {
        botao.classList.remove('favorito');
        botao.innerHTML = '🤍';
        botao.setAttribute('aria-label', 'Adicionar aos favoritos');
      }
    });
  });
}

// --- MODAL DIALOG ACESSÍVEL (<dialog>) ---
function abrirModalDetalhes(id) {
  const imovel = listaTodosImoveis.find(item => item.id === id);
  if (!imovel || !modalDialog || !modalConteudo) return;

  // 3. Uso de ARRAY.MAP() para transformar comodidades em tags
  const tagsComodidades = imovel.comodidades
    .map(c => `<span class="comodidade-pill">✓ ${c}</span>`)
    .join('');

  modalConteudo.innerHTML = `
    <div class="modal-cabecalho">
      <img
        src="${imovel.imagem}"
        alt="Foto do imóvel: ${imovel.titulo}"
        class="modal-img"
        width="600"
        height="338"
      >
      <button type="button" class="btn-fechar-modal" id="btn-fechar-modal-x" aria-label="Fechar janela">✕</button>
    </div>

    <div class="modal-corpo">
      <div class="modal-tags">
        <span class="modal-tag">${imovel.tipo}</span>
        <span class="modal-tag">${imovel.area} m²</span>
        <span class="modal-tag">${imovel.quartos} quartos</span>
        <span class="modal-tag">${imovel.banheiros} banheiros</span>
        <span class="modal-tag">${imovel.vagas} vagas</span>
      </div>

      <h2>${imovel.titulo}</h2>
      <p class="endereco-modal">📍 ${imovel.endereco} - ${imovel.bairro}, ${imovel.cidade}</p>

      <div class="modal-preco">R$ ${imovel.preco.toLocaleString('pt-BR')}/mês</div>
      <div class="modal-custos">
        Condomínio estimado: R$ ${imovel.condominio} | IPTU mensal: R$ ${imovel.iptu}
      </div>

      <p class="modal-descricao">${imovel.descricao}</p>

      <div class="modal-comodidades-titulo">Comodidades e Diferenciais:</div>
      <div class="modal-comodidades-lista">
        ${tagsComodidades}
      </div>

      <div class="modal-acoes">
        <a
          href="contato.html?imovel=${imovel.id}&titulo=${encodeURIComponent(imovel.titulo)}"
          class="btn-secundario btn-modal-acao"
        >
          🗓️ Agendar Visita para Este Imóvel
        </a>
      </div>
    </div>
  `;

  // Fechar pelo botão X interno
  const btnX = modalConteudo.querySelector('#btn-fechar-modal-x');
  if (btnX) {
    btnX.addEventListener('click', fecharModal);
  }

  // Abrir dialog nativo acessível
  if (typeof modalDialog.showModal === 'function') {
    modalDialog.showModal();
  } else {
    modalDialog.setAttribute('open', '');
  }
}

function fecharModal() {
  if (!modalDialog) return;
  if (typeof modalDialog.close === 'function') {
    modalDialog.close();
  } else {
    modalDialog.removeAttribute('open');
  }
}

function limparFiltros() {
  if (inputBusca) inputBusca.value = '';
  if (selectTipo) selectTipo.value = 'todos';
  if (selectQuartos) selectQuartos.value = '0';
  if (selectPreco) selectPreco.value = '0';
  filtrarERenderizar();
}

// --- REGISTRO DE EVENTOS DOS FILTROS ---
function configurarEventosFiltros() {
  if (inputBusca) {
    inputBusca.addEventListener('input', filtrarERenderizar);
  }
  if (selectTipo) {
    selectTipo.addEventListener('change', filtrarERenderizar);
  }
  if (selectQuartos) {
    selectQuartos.addEventListener('change', filtrarERenderizar);
  }
  if (selectPreco) {
    selectPreco.addEventListener('change', filtrarERenderizar);
  }

  if (btnFecharModal) {
    btnFecharModal.addEventListener('click', fecharModal);
  }

  // Fechar modal ao clicar no backdrop (fora da caixa de diálogo)
  if (modalDialog) {
    modalDialog.addEventListener('click', (evento) => {
      const dimensoes = modalDialog.getBoundingClientRect();
      if (
        evento.clientX < dimensoes.left ||
        evento.clientX > dimensoes.right ||
        evento.clientY < dimensoes.top ||
        evento.clientY > dimensoes.bottom
      ) {
        fecharModal();
      }
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  configurarEventosFiltros();
  carregarImoveis();
});
