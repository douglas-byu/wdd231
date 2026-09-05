// curso.js – Cartões de Curso com Filtragem
// WDD231 – Leoncios

// ============================================================
// Array de Cursos – Certificado de Programação Web e Computação
// Altere 'completed' para true nos cursos que você concluiu.
// ============================================================
const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Introdução aos conceitos de programação: variáveis, loops, arrays e entrada/saída usando Python.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Introdução ao design e desenvolvimento web com HTML e CSS semânticos e acessíveis.',
    technology: ['HTML', 'CSS'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Organização de código com funções, pesquisa em bibliotecas e tratamento de erros em Python.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Programação orientada a objetos: encapsulamento, herança e polimorfismo com C#.',
    technology: ['C#'],
    completed: false
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Criação de sites dinâmicos com JavaScript, eventos, manipulação do DOM e design responsivo.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Foco em acessibilidade, conformidade, performance, SEO e design responsivo avançado.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false
  }
];

// ============================================================
// Funções de renderização
// ============================================================

/**
 * Cria o HTML de um card de curso.
 * @param {Object} curso
 * @returns {string} HTML do card
 */
function criarCardCurso(curso) {
  const statusClasse = curso.completed ? 'concluido' : 'pendente';
  const statusTexto  = curso.completed ? '✓ Concluído' : 'Em andamento';

  const techs = curso.technology
    .map(t => `<span class="tech-badge">${t}</span>`)
    .join('');

  return `
    <article class="card-curso ${statusClasse}" role="listitem">
      <div class="card-topo">
        <span class="card-numero">${curso.subject} ${curso.number}</span>
        <span class="badge-status ${statusClasse}">${statusTexto}</span>
      </div>
      <p class="card-titulo">${curso.title}</p>
      <p class="card-descricao">${curso.description}</p>
      <div class="card-rodape">
        <span class="card-creditos">${curso.credits} créditos</span>
        <div class="card-techs">${techs}</div>
      </div>
    </article>
  `;
}

/**
 * Renderiza os cursos filtrados na grade e atualiza o total de créditos.
 * @param {Array} lista – array de cursos a exibir
 */
function renderizarCursos(lista) {
  const grade = document.getElementById('grade-cursos');
  const totalEl = document.getElementById('total-creditos');

  if (!grade) return;

  if (lista.length === 0) {
    grade.innerHTML = '<p style="color:#5D6D7E;font-size:0.9rem;">Nenhum curso encontrado.</p>';
  } else {
    grade.setAttribute('role', 'list');
    grade.innerHTML = lista.map(criarCardCurso).join('');
  }

  // Total de créditos com reduce
  if (totalEl) {
    const total = lista.reduce((acc, curso) => acc + curso.credits, 0);
    totalEl.textContent = `Total de créditos exibidos: ${total}`;
  }
}

// ============================================================
// Inicialização e eventos dos botões de filtro
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Renderiza todos os cursos ao carregar
  renderizarCursos(courses);

  // Evento nos botões de filtro
  const botoes = document.querySelectorAll('.btn-filtro');

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualiza classe ativo
      botoes.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');

      const filtro = btn.dataset.filtro;

      let cursosFiltrados;
      if (filtro === 'todos') {
        cursosFiltrados = courses;
      } else {
        cursosFiltrados = courses.filter(c => c.subject === filtro.toUpperCase());
      }

      renderizarCursos(cursosFiltrados);
    });
  });
});
