if (Highcharts.AST) {
  Highcharts.AST.allowedTags.push(
    "svg",
    "defs",
    "linearGradient",
    "stop",
    "circle",
    "img",
  );
  Highcharts.AST.allowedAttributes.push(
    "id",
    "x1",
    "y1",
    "x2",
    "y2",
    "offset",
    "stop-color",
    "cx",
    "cy",
    "r",
    "fill",
    "stroke",
    "stroke-width",
    "src",
    "alt",
    "onclick",
  );
}

let chartInstance;

const categories = [
{
  key: "tcuIndicators",
  nameKey: "chart.tcuIndicators",
  color: "#8e44ad",
  icon: "fa-chart-line",
  link: "dashboard.html?id=9",
},
{
  key: "infrastructure",
  nameKey: "chart.infrastructure",
  color: "#3498db",
  icon: "fa-city",
  link: "dashboard.html?id=8",
},
{
  key: "budgetManagement",
  nameKey: "chart.budgetManagement",
  color: "#2980b9",
  icon: "fa-coins",
  link: "dashboard.html?id=7",
},
{
  key: "otherUnits",
  nameKey: "chart.otherUnits",
  color: "#16a085",
  icon: "fa-building",
  link: "dashboard.html?id=6",
},
{
  key: "healthArea",
  nameKey: "chart.healthArea",
  color: "#1abc9c",
  icon: "fa-hospital",
  link: "dashboard.html?id=5",
},
{
  key: "peopleManagement",
  nameKey: "chart.peopleManagement",
  color: "#f1c40f",
  icon: "fa-users",
  link: "dashboard.html?id=4",
},
  {
  key: "studentAssistance",
  nameKey: "chart.studentAssistance",
  color: "#b86b1f",
  icon: "fa-book-open-reader",
  link: "dashboard.html?id=3",
},
{
  key: "internationalization",
  nameKey: "chart.internationalization",
  color: "#e67e22",
  icon: "fa-earth-americas",
  link: "dashboard.html?id=10",
},
{
  key: "extension",
  nameKey: "chart.extension",
  color: "#e74c3c",
  icon: "fa-lightbulb",
  link: "dashboard.html?id=2b",
},
{
  key: "research",
  nameKey: "chart.research",
  color: "#d8432e",
  icon: "fa-microscope",
  link: "dashboard.html?id=2a",
},
{
  key: "teaching",
  nameKey: "chart.teaching",
  color: "#c0392b",
  icon: "fa-user-graduate",
  link: "dashboard.html?id=2c",
},
  {
    key: "generalInfo",
    nameKey: "chart.generalInfo",
    color: "#c0392b",
    icon: "fa-globe",
    link: "dashboard.html?id=1",
  },
];

const mobileCategoryOrder = [
  "generalInfo",
  "teaching",
  "research",
  "extension",
  "internationalization",
  "studentAssistance",
  "peopleManagement",
  "healthArea",
  "otherUnits",
  "budgetManagement",
  "infrastructure",
  "tcuIndicators",
];

const mobileMenuMedia = window.matchMedia("(max-width: 768px)");

function t(key) {
  return window.i18n ? window.i18n.t(key) : key;
}

function renderChart() {
  const isDesktop = window.innerWidth > 768;
  const realData = categories.map((cat) => {
    let configuracaoLabel = undefined;

const labelPositions = {
  // lado direito: de cima para baixo
  tcuIndicators: { distance: 48, x: 0, y: -2 },
  infrastructure: { distance: 50, x: 0, y: 0 },
  budgetManagement: { distance: 52, x: 0, y: 2 },
  otherUnits: { distance: 54, x: -6, y: 4 },
  healthArea: { distance: 56, x: -8, y: 6 },
  peopleManagement: { distance: 58, x: -14, y: 6 },

  // lado esquerdo: de cima para baixo
  generalInfo: { distance: 48, x: 0, y: -2 },
  teaching: { distance: 50, x: 0, y: 0 },
  research: { distance: 52, x: 0, y: 2 },
  extension: { distance: 54, x: 0, y: 4 },
  internationalization: { distance: 55, x: 8, y: 2 },
  studentAssistance: { distance: 57, x: 10, y: 2 },
};

if (isDesktop && labelPositions[cat.key]) {
  configuracaoLabel = labelPositions[cat.key];
} else if (!isDesktop && ["research", "extension", "teaching"].includes(cat.key)) {
  configuracaoLabel = { x: -35 };
}

    return {
      y: 1,
      color: {
        linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
        stops: [
          [0, cat.color],
          [1, "#1a1a1a"],
        ],
      },
      baseColor: cat.color,
      name: t(cat.nameKey),
      key: cat.key,
      icon: cat.icon,
      textColor: cat.textColor || "#fff",
      dataLabels: configuracaoLabel,
      link: cat.link,
    };
  });

  const chartData = [
    {
      y: 2,
      color: "#b4837b",
      name: "Spacer",
      dataLabels: { enabled: false },
      enableMouseTracking: false,
    },
    ...realData,
  ];

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = Highcharts.chart("container", {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: "100%",
      style: { fontFamily: "Roboto" },
      events: {
        render: function () {
          const points = this.series[0].points;
          setTimeout(() => {
            points.forEach((point) => {
              let linha = point.connector;
              if (!linha && point.dataLabel) linha = point.dataLabel.connector;
              if (!linha && point.dataLabels && point.dataLabels.length > 0)
                linha = point.dataLabels[0].connector;

              if (linha && linha.element && point.options.baseColor) {
                const corSolida = point.options.baseColor;
                linha.element.setAttribute("fill", corSolida);
                linha.element.style.setProperty("fill", corSolida, "important");
                linha.element.style.setProperty(
                  "stroke",
                  "transparent",
                  "important",
                );
                linha.element.style.setProperty(
                  "stroke-width",
                  "0",
                  "important",
                );
              }
            });
          }, 50);
        },
      },
    },
    title: {
      text: `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                
                <div class="donut-logo-ufpa"></div>
                
                <p class="center-text" style="margin: 0; line-height: 1.3;">
                  ${t("chart.centerText")}
                </p>
                
              </div>
            `,
      align: "center",
      verticalAlign: "middle",
      useHTML: true,
      y: 5,
      style: {
        width: "300px",
      },
    },
    credits: { enabled: false },
    tooltip: { enabled: false },
    accessibility: { enabled: false },

    plotOptions: {
      pie: {
        center: ["50%", "50%"],
        size: "45%",
        innerSize: "88%",
        borderWidth: 0,
        startAngle: -25,

        states: { hover: { halo: false, brightness: 0 } },

        dataLabels: {
          enabled: true,
          useHTML: true,
          distance: 40,
          crop: false,
          overflow: "allow",
          allowOverlap: true,

          connectorShape: function (labelPosition, connectorPosition, options) {
            if (!labelPosition || !connectorPosition) return "";

            let pDonutX = connectorPosition.touchingSliceAt
              ? connectorPosition.touchingSliceAt.x
              : this.labelPos
                ? this.labelPos[0]
                : null;
            let pDonutY = connectorPosition.touchingSliceAt
              ? connectorPosition.touchingSliceAt.y
              : this.labelPos
                ? this.labelPos[1]
                : null;

            if (pDonutX === null) return "";

            const telaAtual = window.innerWidth;
            const baseWidth = telaAtual <= 1024 ? 8 : 12;
            const fixedHeight = telaAtual <= 1024 ? 12 : 15;
            const angle = this.angle;

            let pTipX = pDonutX + Math.cos(angle) * fixedHeight;
            let pTipY = pDonutY + Math.sin(angle) * fixedHeight;

            const pDonutX1 =
              pDonutX + Math.cos(angle + Math.PI / 2) * baseWidth;
            const pDonutY1 =
              pDonutY + Math.sin(angle + Math.PI / 2) * baseWidth;
            const pDonutX2 =
              pDonutX - Math.cos(angle + Math.PI / 2) * baseWidth;
            const pDonutY2 =
              pDonutY - Math.sin(angle + Math.PI / 2) * baseWidth;

            return (
              "M " +
              pDonutX1 +
              " " +
              pDonutY1 +
              " L " +
              pTipX +
              " " +
              pTipY +
              " L " +
              pDonutX2 +
              " " +
              pDonutY2 +
              " Z"
            );
          },
          connectorWidth: 2,
          connectorPadding: 0,

          formatter: function () {
            const point = this.point;
            if (point.name === "Spacer") return null;

            const baseCol = point.options.baseColor;
            const rightSideKeys = [
              "peopleManagement",
              "otherUnits",
              "budgetManagement",
              "infrastructure",
              "tcuIndicators",
              "healthArea",
            ];
            const isRightSide = rightSideKeys.includes(point.options.key);
            const layoutClass = isRightSide ? "right-layout" : "left-layout";
            const gradiente = `linear-gradient(135deg, ${baseCol}, #1a1a1a)`;

            const linkDestino = point.options.link || "#";

            let html = `<div style="padding: 15px; margin: -15px;">`;

            html += `<div class="custom-label ${layoutClass}" onclick="window.location.href='${linkDestino}'">`;
            const iconeHTML = `
                      <div class="label-icon">
                          <div class="gradient-border" style="background-image: ${gradiente};"></div>
                          <i class="fa-solid ${point.icon}"></i>
                      </div>
                  `;

            const widePillKeys = ["teaching", "research", "extension"];

const pillExtraClass = widePillKeys.includes(point.options.key)
  ? " label-pill-wide"
  : "";

const textoHTML = `
          <div class="label-pill${pillExtraClass}" style="background-color: ${baseCol}; color: ${point.textColor}">
              ${point.name}
          </div>
      `;

            if (isRightSide) {
              html += iconeHTML + textoHTML;
            } else {
              html += textoHTML + iconeHTML;
            }

            html += `</div></div>`;
            return html;
          },
        },
      },
    },
    series: [{ name: t("chart.seriesData"), data: chartData }],

    responsive: {
      rules: [
        {
          condition: { maxWidth: 1024 },
          chartOptions: {
            plotOptions: {
              pie: {
                size: "40%",
              },
            },
          },
        },
        {
          condition: { maxWidth: 768 },
          chartOptions: {
            plotOptions: {
              pie: {
                size: "35%",
                dataLabels: {
                  distance: 10,
                },
              },
            },
          },
        },
        {
          condition: { maxWidth: 400 },
          chartOptions: {
            plotOptions: {
              pie: {
                size: "25%",
                dataLabels: {
                  distance: 10,
                },
              },
            },
          },
        },
      ],
    },
  });
}

function renderMobileMenu() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const container = document.getElementById("container");
  const categoriesByKey = new Map(
    categories.map((category) => [category.key, category]),
  );
  const mobileCategories = mobileCategoryOrder.map((key) =>
    categoriesByKey.get(key),
  );
  const cards = mobileCategories
    .map(
      (cat) => `
        <a class="mobile-menu-card" href="${cat.link}" style="--card-color: ${cat.color}">
          <span class="mobile-card-icon" aria-hidden="true">
            <span class="gradient-border"></span>
            <i class="fa-solid ${cat.icon}"></i>
          </span>
          <span class="mobile-card-label">${t(cat.nameKey)}</span>
        </a>
      `,
    )
    .join("");

  container.innerHTML = `<nav class="mobile-menu-grid" aria-label="${t("index.mainTitle")}">${cards}</nav>`;
}

function renderMenu() {
  if (mobileMenuMedia.matches) {
    renderMobileMenu();
    return;
  }

  renderChart();
}

let resizeTimer;

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(renderMenu, 150);
});

renderMenu();

window.addEventListener("languagechange", renderMenu);
