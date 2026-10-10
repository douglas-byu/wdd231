// ==========================================================================
//  ALUGAFÁCIL - MÓDULO DA PÁGINA DE CONTATO (ES MODULE)
//  contato.js | WDD 231 - Projeto Final
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const imovelId = params.get('imovel');
  const imovelTitulo = params.get('titulo');

  const inputAssunto = document.getElementById('imovel-interesse');
  const selectFinalidade = document.getElementById('tipo-solicitacao');
  const inputData = document.getElementById('data-visita');

  // Preencher imóvel de interesse se veio por link de agendamento
  if (imovelTitulo && inputAssunto) {
    inputAssunto.value = decodeURIComponent(imovelTitulo);
    if (selectFinalidade) {
      selectFinalidade.value = 'visita';
    }
  }

  // Definir data mínima como amanhã para visitas
  if (inputData) {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const ano = amanha.getFullYear();
    const mes = String(amanha.getMonth() + 1).padStart(2, '0');
    const dia = String(amanha.getDate()).padStart(2, '0');
    inputData.min = `${ano}-${mes}-${dia}`;
  }
});
