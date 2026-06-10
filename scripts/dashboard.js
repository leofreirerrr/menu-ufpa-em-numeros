// Seleciona os elementos HTML
const sidebar = document.querySelector(".side-bar");
const iframe = document.getElementById("powerbi-frame");
const listaSidebar = document.querySelectorAll(".side-bar a[data-powerbi-pt]");

function Esconder() {
  // Alterna (adiciona/remove) a classe "colapsada" no elemento sidebar
  sidebar.classList.toggle("colapsada");
}

Esconder(); // Chama a função Esconder imediatamente (executa assim que o script é carregado)

function traduzir(key, fallback) {
  return window.i18n ? window.i18n.t(key) : fallback;
}

function idiomaAtual() {
  return window.i18n
    ? window.i18n.getLanguage()
    : localStorage.getItem("ufpaNumerosLanguage") || "pt";
}

function obterLinkPowerBI(botao) {
  const idioma = idiomaAtual();
  const linkPt = botao.dataset.powerbiPt || "";
  const linkEn = botao.dataset.powerbiEn || ""; // TODO: preencher quando os links em inglês estiverem disponíveis.

  if (idioma === "en") {
    return {
      url: linkEn,
      indisponivel: !linkEn,
    };
  }

  return {
    url: linkPt,
    indisponivel: false,
  };
}

function atualizarIdNaUrl(id) {
  const novaUrl = new URL(window.location.href);
  novaUrl.search = "";
  novaUrl.searchParams.set("id", id);
  novaUrl.hash = "";
  window.history.replaceState({}, "", novaUrl.toString());
}

function carregarPowerBI(event) {
  // Função para trocar o iframe
  event.preventDefault(); // Impede o clique de recarregar a página

  listaSidebar.forEach((item) => {
    // Remove a classe "selecionado" de todos os itens da sidebar
    item.classList.remove("selecionado");
  });
  event.currentTarget.classList.add("selecionado"); // Adiciona a classe "selecionado" ao item clicado

  const { url, indisponivel } = obterLinkPowerBI(event.currentTarget);

  if (url) {
    iframe.src = url;
    atualizarIdNaUrl(event.currentTarget.id);
  } else if (indisponivel) {
    alert(
      traduzir(
        "dashboard.englishUnavailable",
        "A versão em inglês ainda não está disponível.",
      ),
    );
  } else {
    alert(traduzir("dashboard.linkNotFound", "Link não encontrado para o botão"));
  }
}

listaSidebar.forEach((botao) => {
  // Adicionar eventos a todos os botões da sidebar
  botao.addEventListener("click", carregarPowerBI);
});

window.addEventListener("languagechange", () => {
  const botaoSelecionado = document.querySelector(
    ".side-bar a.selecionado[data-powerbi-pt]",
  );

  if (!botaoSelecionado) {
    return;
  }

  const { url } = obterLinkPowerBI(botaoSelecionado);

  if (url) {
    iframe.src = url;
  }
});

const urlParams = new URLSearchParams(window.location.search);
let idInicial = urlParams.get("id");
let botaoInicial = idInicial ? document.getElementById(idInicial) : null;

if (!botaoInicial || !("powerbiPt" in botaoInicial.dataset)) {
  idInicial = "1";
  botaoInicial = document.getElementById(idInicial);
}

if (botaoInicial) {
  botaoInicial.classList.add("selecionado");
  const { url, indisponivel } = obterLinkPowerBI(botaoInicial);

  if (url) {
    iframe.src = url;
  } else if (indisponivel) {
    alert(
      traduzir(
        "dashboard.englishUnavailable",
        "A versão em inglês ainda não está disponível.",
      ),
    );
  }
}
