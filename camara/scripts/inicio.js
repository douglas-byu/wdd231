/* ==========================================================================
   CÂMARA DE COMÉRCIO DE SALVADOR - SCRIPT DA PÁGINA INICIAL
   WDD 231 - Douglas Silva
   ========================================================================== */

// ── UTILITÁRIOS ────────────────────────────────────────────────────────────

// Ano atual e última modificação no rodapé
const spanAno = document.getElementById('anoAtual');
if (spanAno) spanAno.textContent = new Date().getFullYear();

const pModificacao = document.getElementById('ultimaModificacao');
if (pModificacao) {
  const data = new Date(document.lastModified);
  pModificacao.textContent = `Última atualização: ${data.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })}`;
}

// ── MENU HAMBÚRGUER ─────────────────────────────────────────────────────────
const botaoHamburguer = document.getElementById('botao-menu-hamburguer');
const menuNav = document.getElementById('menu-navegacao');

if (botaoHamburguer && menuNav) {
  botaoHamburguer.addEventListener('click', () => {
    const aberto = menuNav.classList.toggle('ativo');
    botaoHamburguer.classList.toggle('aberto', aberto);
    botaoHamburguer.setAttribute('aria-expanded', aberto);
  });
}

// ── EVENTOS ──────────────────────────────────────────────────────────────────
const eventos = [
  {
    dia: '20',
    mes: 'Set',
    titulo: 'Fórum de Negócios Bahia 2026',
    local: 'Centro de Convenções de Salvador'
  },
  {
    dia: '28',
    mes: 'Set',
    titulo: 'Workshop: Exportação para o Nordeste',
    local: 'Sede da Câmara de Comércio'
  },
  {
    dia: '05',
    mes: 'Out',
    titulo: 'Rodada de Negócios — Tecnologia & Inovação',
    local: 'Parque Tecnológico da Bahia'
  },
  {
    dia: '15',
    mes: 'Out',
    titulo: 'Palestra: Sustentabilidade Empresarial',
    local: 'Auditório da FIEB — Salvador'
  }
];

function renderizarEventos() {
  const lista = document.getElementById('lista-eventos');
  if (!lista) return;

  lista.innerHTML = eventos.map(ev => `
    <li class="item-evento">
      <div class="data-evento" aria-label="${ev.dia} de ${ev.mes}">
        <span class="dia">${ev.dia}</span>
        <span class="mes">${ev.mes}</span>
      </div>
      <div class="info-evento">
        <h3>${ev.titulo}</h3>
        <p>📍 ${ev.local}</p>
      </div>
    </li>
  `).join('');
}

renderizarEventos();

// ── TEMPO (OPENWEATHERMAP) ───────────────────────────────────────────────────
// Salvador, BA: lat=-12.9714, lon=-38.5014
const LAT = -12.9714;
const LON = -38.5014;
// IMPORTANTE: Substitua pela sua chave pessoal da OpenWeatherMap (openweathermap.org/api)
const API_KEY = 'SUA_CHAVE_API_AQUI';

const EMOJI_TEMPO = {
  '01': '☀️', '02': '🌤️', '03': '⛅', '04': '☁️',
  '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️'
};

function obterEmojiTempo(iconCode) {
  const prefixo = iconCode.substring(0, 2);
  return EMOJI_TEMPO[prefixo] || '🌡️';
}

function nomeDiaSemana(timestampUTC, offsetSeg) {
  const data = new Date((timestampUTC + offsetSeg) * 1000);
  return data.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' });
}

async function carregarTempo() {
  const container = document.getElementById('info-tempo');
  if (!container) return;

  // Se não há chave configurada, exibe dados de demonstração
  if (API_KEY === 'SUA_CHAVE_API_AQUI') {
    container.innerHTML = `
      <div class="tempo-atual">
        <span class="icone-tempo">🌤️</span>
        <div class="dados-tempo-atual">
          <h3>28°C</h3>
          <p>Parcialmente nublado</p>
          <p style="font-size:0.8rem;color:#94a3b8;margin-top:0.3rem;">💡 Configure sua chave da OpenWeatherMap em inicio.js</p>
        </div>
      </div>
      <p class="previsao-titulo">Previsão para 3 dias</p>
      <div class="previsao-container">
        <div class="card-previsao">
          <span class="dia-semana">Sex</span>
          <span class="icone-prev">⛅</span>
          <span class="temp-prev">30°C</span>
          <span class="desc-prev">Nublado</span>
        </div>
        <div class="card-previsao">
          <span class="dia-semana">Sáb</span>
          <span class="icone-prev">🌦️</span>
          <span class="temp-prev">27°C</span>
          <span class="desc-prev">Chuva leve</span>
        </div>
        <div class="card-previsao">
          <span class="dia-semana">Dom</span>
          <span class="icone-prev">☀️</span>
          <span class="temp-prev">31°C</span>
          <span class="desc-prev">Ensolarado</span>
        </div>
      </div>
    `;
    return;
  }

  try {
    // Tempo atual
    const resAtual = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    if (!resAtual.ok) throw new Error('Erro ao carregar tempo atual');
    const dadosAtual = await resAtual.json();

    // Previsão de 5 dias / 3 horas
    const resPrev = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=pt_br&cnt=24`
    );
    if (!resPrev.ok) throw new Error('Erro ao carregar previsão');
    const dadosPrev = await resPrev.json();
    const offset = dadosPrev.city.timezone;

    // Agrupa por dia (próximos 3 dias, excluindo hoje)
    const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
    const porDia = {};
    dadosPrev.list.forEach(item => {
      const d = new Date((item.dt + offset) * 1000);
      const chave = d.toISOString().slice(0, 10);
      const diaLocal = new Date(item.dt * 1000).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
      if (diaLocal !== hoje && !porDia[chave]) {
        porDia[chave] = item;
      }
    });

    const previsoes = Object.values(porDia).slice(0, 3);

    const tempAtual = Math.round(dadosAtual.main.temp);
    const descAtual = dadosAtual.weather[0].description;
    const iconAtual = dadosAtual.weather[0].icon;

    container.innerHTML = `
      <div class="tempo-atual">
        <span class="icone-tempo" aria-hidden="true">${obterEmojiTempo(iconAtual)}</span>
        <div class="dados-tempo-atual">
          <h3>${tempAtual}°C</h3>
          <p>${descAtual}</p>
        </div>
      </div>
      <p class="previsao-titulo">Previsão para 3 dias</p>
      <div class="previsao-container">
        ${previsoes.map(p => {
          const diaSemana = nomeDiaSemana(p.dt, offset);
          const temp = Math.round(p.main.temp);
          const desc = p.weather[0].description;
          const emoji = obterEmojiTempo(p.weather[0].icon);
          return `
            <div class="card-previsao">
              <span class="dia-semana">${diaSemana}</span>
              <span class="icone-prev" aria-hidden="true">${emoji}</span>
              <span class="temp-prev">${temp}°C</span>
              <span class="desc-prev">${desc}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (erro) {
    console.error('Erro ao buscar dados meteorológicos:', erro);
    container.innerHTML = `<p class="carregando-tempo">Não foi possível carregar os dados de tempo. Tente novamente mais tarde.</p>`;
  }
}

carregarTempo();

// ── MEMBROS EM DESTAQUE ──────────────────────────────────────────────────────
const NIVEIS = { 1: 'Membro', 2: 'Prata', 3: 'Ouro' };
const CLASSE_NIVEL = { 1: 'membro', 2: 'prata', 3: 'ouro' };

function embaralhar(arr) {
  // Algoritmo Fisher-Yates
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function carregarDestaques() {
  const container = document.getElementById('destaques-container');
  if (!container) return;

  try {
    const res = await fetch('dados/membros.json');
    if (!res.ok) throw new Error('Falha ao carregar membros.json');
    const membros = await res.json();

    // Filtra apenas ouro (3) e prata (2)
    const elegíveis = membros.filter(m => m.nivelAssociacao >= 2);

    // Embaralha e pega 3
    const selecionados = embaralhar(elegíveis).slice(0, 3);

    container.innerHTML = selecionados.map(m => {
      const nivel = NIVEIS[m.nivelAssociacao] || 'Membro';
      const classeNivel = CLASSE_NIVEL[m.nivelAssociacao] || 'membro';
      const dominioSite = m.site.replace(/^https?:\/\//, '');
      return `
        <article class="cartao-destaque ${classeNivel}">
          <div class="logo-destaque-wrapper">
            <img src="${m.imagem}" alt="Logotipo de ${m.nome}" class="logo-destaque" width="130" height="65" loading="lazy">
          </div>
          <h3 class="nome-destaque">${m.nome}</h3>
          <span class="badge-nivel-destaque ${classeNivel}">${nivel}</span>
          <div class="contatos-destaque">
            <p>📞 ${m.telefone}</p>
            <p>📍 ${m.endereco}</p>
          </div>
          <a href="${m.site}" target="_blank" rel="noopener noreferrer" class="link-site-destaque" aria-label="Visitar site de ${m.nome}">
            ${dominioSite}
          </a>
        </article>
      `;
    }).join('');

  } catch (erro) {
    console.error('Erro ao carregar destaques:', erro);
    container.innerHTML = '<p>Não foi possível carregar os membros em destaque.</p>';
  }
}

carregarDestaques();
