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

const rightSideKeys = [
  "peopleManagement",
  "otherUnits",
  "budgetManagement",
  "infrastructure",
  "tcuIndicators",
  "healthArea",
];

const widePillKeys = ["teaching", "research", "extension"];

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

function getMenuLayer(container) {
  let layer = container.querySelector(".menu-label-layer");

  if (!layer) {
    layer = document.createElement("div");
    layer.className = "menu-label-layer";
    container.appendChild(layer);
  }

  return layer;
}

function getConnectorLayer(container) {
  let layer = container.querySelector(".menu-connector-layer");

  if (!layer) {
    layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    layer.classList.add("menu-connector-layer");
    container.appendChild(layer);
  }

  layer.setAttribute(
    "viewBox",
    `0 0 ${container.clientWidth} ${container.clientHeight}`,
  );
  layer.setAttribute("width", container.clientWidth);
  layer.setAttribute("height", container.clientHeight);

  return layer;
}

function createConnector(layer, point, centerX, centerY, outerRadius) {
  const telaAtual = window.innerWidth;
  const baseWidth = telaAtual < 768 ? 6 : 12;
  const fixedHeight = telaAtual < 768 ? 12 : 15;
  const angle = point.angle;

  const pDonutX = centerX + Math.cos(angle) * outerRadius;
  const pDonutY = centerY + Math.sin(angle) * outerRadius;

  const pTipX = pDonutX + Math.cos(angle) * fixedHeight;
  const pTipY = pDonutY + Math.sin(angle) * fixedHeight;

  const pDonutX1 = pDonutX + Math.cos(angle + Math.PI / 2) * baseWidth;
  const pDonutY1 = pDonutY + Math.sin(angle + Math.PI / 2) * baseWidth;

  const pDonutX2 = pDonutX - Math.cos(angle + Math.PI / 2) * baseWidth;
  const pDonutY2 = pDonutY - Math.sin(angle + Math.PI / 2) * baseWidth;

  const connector = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  connector.classList.add("menu-connector");
  connector.dataset.key = point.options.key;
  connector.setAttribute(
    "d",
    `M ${pDonutX1} ${pDonutY1} L ${pTipX} ${pTipY} L ${pDonutX2} ${pDonutY2} Z`,
  );
  connector.setAttribute("fill", point.options.baseColor);
  connector.setAttribute("stroke", "transparent");
  connector.setAttribute("stroke-width", "0");
  connector.setAttribute("pointer-events", "none");

  layer.appendChild(connector);
  return connector;
}

function createMenuLabel(layer, point, points, centerX, centerY, outerRadius) {
  const key = point.options.key;
  const baseCol = point.options.baseColor;
  const isRightSide = rightSideKeys.includes(key);
  const layoutClass = isRightSide ? "right-layout" : "left-layout";
  const position = labelPositions[key] || { distance: 50, x: 0, y: 0 };
  const gradiente = `linear-gradient(135deg, ${baseCol}, #1a1a1a)`;
  const pillExtraClass = widePillKeys.includes(key) ? " label-pill-wide" : "";
  const label = document.createElement("a");
  const labelDistance = outerRadius + position.distance;
  const anchorX = centerX + Math.cos(point.angle) * labelDistance + position.x;
  const anchorY = centerY + Math.sin(point.angle) * labelDistance + position.y;

  label.className = `custom-label ${layoutClass}`;
  label.dataset.key = key;
  label.href = point.options.link || "#";
  label.style.visibility = "hidden";
  label.innerHTML = `
    <div class="label-icon">
      <div class="gradient-border" style="background-image: ${gradiente};"></div>
      <i class="fa-solid ${point.options.icon}"></i>
    </div>
    <div class="label-pill${pillExtraClass}" style="background-color: ${baseCol}; color: ${point.options.textColor}">
      ${point.name}
    </div>
  `;

  if (!isRightSide) {
    label.append(label.firstElementChild);
  }

  label.addEventListener("mouseenter", () => {
    point.setState("hover");
    setMenuHoverState(layer, points, key);
  });

  label.addEventListener("mouseleave", () => {
    point.setState("");
    clearMenuHoverState(layer, points);
  });

  layer.appendChild(label);

  const labelWidth = label.offsetWidth;
  const labelHeight = label.offsetHeight;
  label.style.left = `${isRightSide ? anchorX : anchorX - labelWidth}px`;
  label.style.top = `${anchorY - labelHeight / 2}px`;
  label.style.visibility = "";

  return label;
}

function setMenuHoverState(layer, points, activeKey) {
  const connectorLayer = layer.parentElement.querySelector(
    ".menu-connector-layer",
  );

  layer.classList.add("menu-hovering", "is-hovering");
  connectorLayer?.classList.add("menu-hovering", "is-hovering");

  [layer, connectorLayer]
    .filter(Boolean)
    .forEach((hoverLayer) =>
      hoverLayer
        .querySelectorAll(".custom-label, .menu-connector")
        .forEach((element) => {
          element.classList.toggle(
            "is-active",
            element.dataset.key === activeKey,
          );
        }),
    );

  points.forEach((point) => {
    if (point.options.key && point.options.key !== activeKey) {
      point.graphic?.css({ opacity: 0.22 });
    } else if (point.options.key === activeKey) {
      point.graphic?.css({ opacity: 1 });
    }
  });
}

function clearMenuHoverState(layer, points) {
  const connectorLayer = layer.parentElement.querySelector(
    ".menu-connector-layer",
  );

  layer.classList.remove("menu-hovering", "is-hovering");
  connectorLayer?.classList.remove("menu-hovering", "is-hovering");

  [layer, connectorLayer]
    .filter(Boolean)
    .forEach((hoverLayer) =>
      hoverLayer
        .querySelectorAll(".custom-label, .menu-connector")
        .forEach((element) => element.classList.remove("is-active")),
    );

  points.forEach((point) => {
    point.graphic?.css({ opacity: 1 });
  });
}

function renderMenuOverlay(chart) {
  const container = chart.renderTo;
  const connectorLayer = getConnectorLayer(container);
  const layer = getMenuLayer(container);
  const points = chart.series[0].points.filter(
    (point) => point.name !== "Spacer",
  );
  const center = chart.series[0].center;
  const centerX = chart.plotLeft + center[0];
  const centerY = chart.plotTop + center[1];
  const outerRadius = center[2] / 2;

  connectorLayer.innerHTML = "";
  layer.innerHTML = "";
  clearMenuHoverState(layer, points);

  points.forEach((point) => {
    createConnector(connectorLayer, point, centerX, centerY, outerRadius);
    createMenuLabel(layer, point, points, centerX, centerY, outerRadius);
  });
}

function renderChart() {
  const realData = categories.map((cat) => ({
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
    link: cat.link,
  }));

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

  document.getElementById("container").innerHTML = "";

  chartInstance = Highcharts.chart("container", {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: "100%",
      style: { fontFamily: "Roboto" },
      events: {
        render: function () {
          renderMenuOverlay(this);
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
        point: {
          events: {
            mouseOver: function () {
              const layer = this.series.chart.renderTo.querySelector(
                ".menu-label-layer",
              );

              if (layer && this.options.key) {
                setMenuHoverState(layer, this.series.points, this.options.key);
              }
            },
            mouseOut: function () {
              const layer = this.series.chart.renderTo.querySelector(
                ".menu-label-layer",
              );

              if (layer) {
                clearMenuHoverState(layer, this.series.points);
              }
            },
          },
        },

        dataLabels: {
          enabled: false,
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
