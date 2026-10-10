// ==========================================================================
//  ALUGAFÁCIL - MÓDULO DE PROCESSAMENTO DO FORMULÁRIO (ES MODULE)
//  obrigado.js | WDD 231 - Projeto Final
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const containerDados = document.getElementById('resumo-dados-form');

  if (!containerDados) return;

  const campos = [
    { chave: 'nome', rotulo: 'Nome Completo' },
    { chave: 'email', rotulo: 'E-mail' },
    { chave: 'telefone', rotulo: 'Telefone / WhatsApp' },
    { chave: 'tipo-solicitacao', rotulo: 'Tipo de Solicitação' },
    { chave: 'imovel-interesse', rotulo: 'Imóvel de Interesse' },
    { chave: 'data-visita', rotulo: 'Data Solicitada para Visita' },
    { chave: 'mensagem', rotulo: 'Mensagem Adicional' }
  ];

  let linhasHTML = '';
  let temDados = false;

  campos.forEach(campo => {
    const valor = params.get(campo.chave);
    if (valor) {
      temDados = true;
      let valorFormatado = valor;

      if (campo.chave === 'tipo-solicitacao') {
        const mapaTipos = {
          'visita': 'Agendamento de Visita',
          'duvida': 'Dúvida sobre Imóvel',
          'anuncio': 'Quero Anunciar meu Imóvel',
          'outro': 'Outro Assunto'
        };
        valorFormatado = mapaTipos[valor] || valor;
      }

      if (campo.chave === 'data-visita' && valor.includes('-')) {
        const [ano, mes, dia] = valor.split('-');
        valorFormatado = `${dia}/${mes}/${ano}`;
      }

      linhasHTML += `
        <tr>
          <th>${campo.rotulo}</th>
          <td><strong>${valorFormatado}</strong></td>
        </tr>
      `;
    }
  });

  if (temDados) {
    containerDados.innerHTML = `
      <table class="tabela-resumo">
        <tbody>
          ${linhasHTML}
        </tbody>
      </table>
    `;
  } else {
    containerDados.innerHTML = `
      <p style="color: var(--cor-texto-suave); margin: 1.5rem 0;">
        Nenhum dado enviado através do formulário foi identificado.
      </p>
    `;
  }
});
