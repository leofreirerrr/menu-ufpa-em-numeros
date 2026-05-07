// Seleciona os elementos HTML
const sidebar = document.querySelector(".side-bar");
const iframe = document.getElementById("powerbi-frame");
const listaSidebar = document.querySelectorAll(".side-bar a");

const linksPowerBI = {
  1: "https://app.powerbi.com/view?r=eyJrIjoiNmFmZjIzNjUtNTE0ZS00YzYxLWI3ZDQtNjhmYzM3OTI0MDJmIiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  2: "https://app.powerbi.com/view?r=eyJrIjoiOGU2YTQzNDktNTVjYS00Y2ZlLTg2OWMtOTg2ZDNkMTcyYTI1IiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  3: "https://app.powerbi.com/view?r=eyJrIjoiOTIwNTBkODgtODZmYy00Y2Q4LTg3N2MtYmMzYzlhMWY4N2RhIiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  4: "https://app.powerbi.com/view?r=eyJrIjoiMmUwZjBkNTAtOWZlNi00ZjhlLWI5NjktZTE2ZjFmOTI4NjZlIiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  5: "https://app.powerbi.com/view?r=eyJrIjoiZGQ5ODJiNzAtYjdhYy00MTU3LWJiN2UtMzhhMGJhMjk1MzQ5IiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  6: "https://app.powerbi.com/view?r=eyJrIjoiNWNkYjJlMWUtNGMyNi00YmU1LWFmZDQtMjBmZjFkZTM0OWNjIiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  7: "https://app.powerbi.com/view?r=eyJrIjoiMzlkZWRiMGEtNTc1ZC00NjZkLTgyYTEtNDYzM2EyMTZhNzYyIiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  8: "https://app.powerbi.com/view?r=eyJrIjoiMmUwNTIyZjctZmNlOS00NGMzLWJjN2UtNDZmYWU3OGI1YjZkIiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  9: "https://app.powerbi.com/view?r=eyJrIjoiMzhlNWU5OTQtN2ZhMC00ZmMyLWE1OTItM2I0MWE1NDk0ZDBlIiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
  10: "",
  11: "https://app.powerbi.com/view?r=eyJrIjoiYzg2OTIxYmEtMmZkOS00MWZjLWJkZjAtMjlmMjlkNjNjNWE1IiwidCI6Ijk4ZDM1NmYyLWQzMmEtNDc0Ni04ZmNkLTJhNzM5ZDZlMWE5NSJ9",
};

function Esconder() {
  // Alterna (adiciona/remove) a classe "colapsada" no elemento sidebar
  sidebar.classList.toggle("colapsada");
}

Esconder(); // Chama a função Esconder imediatamente (executa assim que o script é carregado)

function carregarPowerBI(event) {
  // Função para trocar o iframe
  event.preventDefault(); // Impede o clique de recarregar a página

  listaSidebar.forEach((item) => {
    // Remove a classe "selecionado" de todos os itens da sidebar
    item.classList.remove("selecionado");
  });
  event.currentTarget.classList.add("selecionado"); // Adiciona a classe "selecionado" ao item clicado

  const idBotao = event.currentTarget.id;
  const url = linksPowerBI[idBotao];

  if (url) {
    iframe.src = url;
  } else {
    alert("Link não encontrado para o botão");
  }
}

listaSidebar.forEach((botao) => {
  // Adicionar eventos a todos os botões da sidebar
  botao.addEventListener("click", carregarPowerBI);
});

const urlParams = new URLSearchParams(window.location.search);
let idInicial = urlParams.get("id");

if (!idInicial || !linksPowerBI[idInicial]) {
  idInicial = "1";
}

iframe.src = linksPowerBI[idInicial];

const botaoInicial = document.getElementById(idInicial);

if (botaoInicial) {
  botaoInicial.classList.add("selecionado");
}