// data.js – Datas Dinâmicas
// WDD231 – Leoncios

// Ano atual para o copyright
const spanAno = document.getElementById('ano-atual');
if (spanAno) {
  spanAno.textContent = new Date().getFullYear();
}

// Última modificação do documento
const pUltimaModificacao = document.getElementById('ultimaModificacao');
if (pUltimaModificacao) {
  pUltimaModificacao.textContent = `Última Modificação: ${document.lastModified}`;
}
