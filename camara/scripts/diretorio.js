// ==========================================================================
//  CÂMARA DE COMÉRCIO DE SALVADOR - DIRETÓRIO DE MEMBROS
//  diretorio.js | WDD 231 - Douglas Silva
// ==========================================================================

// --- RODAPÉ DINÂMICO ---
const anoAtualElemento = document.getElementById('anoAtual');
if (anoAtualElemento) {
  anoAtualElemento.textContent = new Date().getFullYear();
}

const ultimaModificacaoElemento = document.getElementById('ultimaModificacao');
if (ultimaModificacaoElemento) {
  ultimaModificacaoElemento.innerHTML = `Última Modificação: ${document.lastModified}`;
}

// --- MENU HAMBÚRGUER ---
const botaoMenu = document.getElementById('botao-menu-hamburguer');
const menuNavegacao = document.getElementById('menu-navegacao');

if (botaoMenu && menuNavegacao) {
  botaoMenu.addEventListener('click', () => {
    const estaAberto = menuNavegacao.classList.toggle('ativo');
    botaoMenu.classList.toggle('aberto', estaAberto);
    botaoMenu.setAttribute('aria-expanded', estaAberto);
  });
}

// --- ALTERNÂNCIA GRADE / LISTA ---
const botaoGrade = document.getElementById('botao-grade');
const botaoLista = document.getElementById('botao-lista');
const membrosContainer = document.getElementById('membros-container');

function ativarModo(modoAtivo, modoInativo, classeAtiva, classeInativa) {
  if (!membrosContainer) return;
  membrosContainer.classList.add(classeAtiva);
  membrosContainer.classList.remove(classeInativa);
  modoAtivo.classList.add('ativo');
  modoAtivo.setAttribute('aria-pressed', 'true');
  modoInativo.classList.remove('ativo');
  modoInativo.setAttribute('aria-pressed', 'false');
}

if (botaoGrade && botaoLista) {
  botaoGrade.addEventListener('click', () => {
    ativarModo(botaoGrade, botaoLista, 'grade', 'lista');
  });

  botaoLista.addEventListener('click', () => {
    ativarModo(botaoLista, botaoGrade, 'lista', 'grade');
  });
}

// --- MAPEAMENTO DO NÍVEL DE ASSOCIAÇÃO ---
function obterInfoNivel(nivel) {
  switch (nivel) {
    case 3:
      return { classe: 'ouro', rotulo: 'Membro Ouro' };
    case 2:
      return { classe: 'prata', rotulo: 'Membro Prata' };
    default:
      return { classe: 'membro', rotulo: 'Membro' };
  }
}

// --- RENDERIZAÇÃO DOS CARTÕES ---
function renderizarMembros(membros) {
  if (!membrosContainer) return;
  membrosContainer.innerHTML = '';

  membros.forEach(membro => {
    const infoNivel = obterInfoNivel(membro.nivelAssociacao);

    const cartao = document.createElement('article');
    cartao.className = `cartao-membro ${infoNivel.classe}`;

    cartao.innerHTML = `
      <div class="logo-empresa-wrapper">
        <img
          src="${membro.imagem}"
          alt="Logotipo de ${membro.nome}"
          class="logo-empresa"
          width="120"
          height="80"
          loading="lazy"
          onerror="this.style.display='none'"
        >
      </div>
      <h3 class="nome-empresa">${membro.nome}</h3>
      <span class="badge-nivel ${infoNivel.classe}">${infoNivel.rotulo}</span>
      <p class="categoria-empresa">${membro.categoria}</p>
      <p class="descricao-empresa">${membro.descricao}</p>
      <div class="detalhes-contato">
        <p class="item-contato">📍 ${membro.endereco}</p>
        <p class="item-contato">📞 <a href="tel:${membro.telefone}">${membro.telefone}</a></p>
        <a
          href="${membro.site}"
          target="_blank"
          rel="noopener noreferrer"
          class="link-site-btn"
          aria-label="Visitar o site de ${membro.nome}"
        >
          Visitar Site
        </a>
      </div>
    `;

    membrosContainer.appendChild(cartao);
  });
}

// --- BUSCA DOS DADOS JSON ---
async function carregarMembros() {
  try {
    const resposta = await fetch('dados/membros.json');
    if (!resposta.ok) {
      throw new Error(`Erro ao carregar dados: ${resposta.status}`);
    }
    const membros = await resposta.json();
    renderizarMembros(membros);
  } catch (erro) {
    console.error('Falha ao buscar membros:', erro);
    if (membrosContainer) {
      membrosContainer.innerHTML =
        '<p class="erro-carregamento">Não foi possível carregar o diretório de membros. Tente novamente mais tarde.</p>';
    }
  }
}

// --- INICIALIZAÇÃO ---
carregarMembros();
