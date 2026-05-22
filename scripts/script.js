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
    key: "previousEditions",
    nameKey: "chart.previousEditions",
    color: "#34495e",
    icon: "fa-clock-rotate-left",
    linkPt: "dashboard.html?id=11",
    linkEn: "",
  },
  {
    key: "tcuIndicators",
    nameKey: "chart.tcuIndicators",
    color: "#8e44ad",
    icon: "fa-chart-line",
    linkPt: "dashboard.html?id=9",
    linkEn: "",
  },
  {
    key: "infrastructure",
    nameKey: "chart.infrastructure",
    color: "#3498db",
    icon: "fa-city",
    linkPt: "dashboard.html?id=8",
    linkEn: "",
  },
  {
    key: "budgetManagement",
    nameKey: "chart.budgetManagement",
    color: "#2980b9",
    icon: "fa-coins",
    linkPt: "dashboard.html?id=7",
    linkEn: "",
  },
  {
    key: "otherUnits",
    nameKey: "chart.otherUnits",
    color: "#16a085",
    icon: "fa-building",
    linkPt: "dashboard.html?id=6",
    linkEn: "",
  },
  {
    key: "healthArea",
    nameKey: "chart.healthArea",
    color: "#1abc9c",
    icon: "fa-hospital",
    linkPt: "dashboard.html?id=5",
    linkEn: "",
  },
  {
    key: "peopleManagement",
    nameKey: "chart.peopleManagement",
    color: "#f1c40f",
    icon: "fa-users",
    textColor: "#333",
    linkPt: "dashboard.html?id=4",
    linkEn: "",
  },
  {
    key: "studentAssistance",
    nameKey: "chart.studentAssistance",
    color: "#e67e22",
    icon: "fa-book-open-reader",
    linkPt: "dashboard.html?id=3",
    linkEn: "",
  },
  {
    key: "researchActivity",
    nameKey: "chart.researchActivity",
    color: "#e74c3c",
    icon: "fa-user-graduate",
    linkPt: "dashboard.html?id=2a",
    linkEn: "",
  },
  {
    key: "extensionActivity",
    nameKey: "chart.extensionActivity",
    color: "#e74c3c",
    icon: "fa-user-graduate",
    linkPt: "dashboard.html?id=2b",
    linkEn: "",
  },
  {
    key: "teachingActivity",
    nameKey: "chart.teachingActivity",
    color: "#e74c3c",
    icon: "fa-user-graduate",
    linkPt: "dashboard.html?id=2c",
    linkEn: "",
  },
  {
    key: "internationalization",
    nameKey: "chart.internationalization",
    color: "#e74c3c",
    icon: "fa-user-graduate",
    linkPt: "",
    linkEn: "",
  },
  {
    key: "generalInfo",
    nameKey: "chart.generalInfo",
    color: "#c0392b",
    icon: "fa-globe",
    linkPt: "dashboard.html?id=1",
    linkEn: "",
  },
];

const isDesktop = window.innerWidth > 768;
const desktopLabelAdjustments = {
  otherUnits: { distance: 62, x: -24 },
  healthArea: { distance: 62, x: -28 },
  peopleManagement: { distance: 62, y: 8 },
};
const mobileLeftAdjustments = [
  "researchActivity",
  "extensionActivity",
  "teachingActivity",
  "internationalization",
];

function t(key) {
  return window.i18n ? window.i18n.t(key) : key;
}

function getCurrentLanguage() {
  return window.i18n
    ? window.i18n.getLanguage()
    : localStorage.getItem("ufpaNumerosLanguage") || "pt";
}

function getCategoryLink(category) {
  const language = getCurrentLanguage();

  if (language === "en") {
    return {
      url: category.linkEn || "",
      unavailableKey: "dashboard.englishUnavailable",
    };
  }

  return {
    url: category.linkPt || "",
    unavailableKey: "dashboard.linkUnavailable",
  };
}

window.openMainMenuCard = function (categoryKey) {
  const category = categories.find((item) => item.key === categoryKey);

  if (!category) {
    alert(t("dashboard.linkNotFound"));
    return;
  }

  const { url, unavailableKey } = getCategoryLink(category);

  if (url) {
    window.location.href = url;
    return;
  }

  alert(t(unavailableKey));
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

function createConnector(layer, point, centerX, centerY, outerRadius) {
  const connector = document.createElement("div");
  const angle = point.angle;
  const connectorRadius = outerRadius + (window.innerWidth > 768 ? 12 : 7);

  connector.className = "menu-connector";
  connector.dataset.key = point.options.key;
  connector.style.backgroundColor = point.options.baseColor;
  connector.style.left = `${centerX + Math.cos(angle) * connectorRadius}px`;
  connector.style.top = `${centerY + Math.sin(angle) * connectorRadius}px`;
  connector.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
  layer.appendChild(connector);
}

function setMenuHoverState(layer, points, activeKey) {
  layer.classList.add("menu-hovering", "is-hovering");

  layer.querySelectorAll(".custom-label, .menu-connector").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.key === activeKey);
  });

  points.forEach((point) => {
    if (point.name === "Spacer") {
      return;
    }

    const isActive = point.options.key === activeKey;
    point.graphic?.attr({ opacity: isActive ? 1 : 0.22 });
    point.setState(isActive ? "hover" : "inactive");
  });
}

function clearMenuHoverState(layer, points) {
  layer.classList.remove("menu-hovering", "is-hovering");

  layer.querySelectorAll(".custom-label, .menu-connector").forEach((item) => {
    item.classList.remove("is-active");
  });

  points.forEach((point) => {
    if (point.name === "Spacer") {
      return;
    }

    point.graphic?.attr({ opacity: 1 });
    point.setState("");
  });
}

function createMenuLabel(layer, point, points, centerX, centerY, outerRadius) {
  const angle = point.angle;
  const baseCol = point.options.baseColor;
  const rightSideKeys = [
    "otherUnits",
    "budgetManagement",
    "infrastructure",
    "tcuIndicators",
    "previousEditions",
    "healthArea",
  ];
  const isRightSide = rightSideKeys.includes(point.options.key);
  const layoutClass = isRightSide ? "right-layout" : "left-layout";
  const labelRadius = outerRadius + (window.innerWidth > 768 ? 126 : 56);
  const iconSize = window.innerWidth > 1024 ? 78 : window.innerWidth > 768 ? 40 : 30;
  const desktopOffsets = {
    previousEditions: { x: 0, y: 34 },
    tcuIndicators: { x: 0, y: 26 },
    generalInfo: { x: 0, y: 34 },
    internationalization: { x: 0, y: 22 },
    researchActivity: { x: -8, y: -18 },
    studentAssistance: { x: -30, y: 0 },
    peopleManagement: { x: 22, y: 42 },
  };
  const mobileOffsets = {
    researchActivity: { x: -6, y: -8 },
    studentAssistance: { x: -12, y: 8 },
    peopleManagement: { x: 10, y: 20 },
  };
  const offsets = window.innerWidth > 768 ? desktopOffsets : mobileOffsets;
  const adjustment = offsets[point.options.key] || { x: 0, y: 0 };
  const iconCenterX = centerX + Math.cos(angle) * labelRadius + adjustment.x;
  const iconCenterY = centerY + Math.sin(angle) * labelRadius + adjustment.y;
  const gradiente = `linear-gradient(135deg, ${baseCol}, #1a1a1a)`;
  const label = document.createElement("div");

  label.className = `custom-label ${layoutClass}`;
  label.dataset.key = point.options.key;
  label.onclick = () => window.openMainMenuCard(point.options.key);
  label.addEventListener("mouseenter", () => {
    setMenuHoverState(layer, points, point.options.key);
  });
  label.addEventListener("mouseleave", () => {
    clearMenuHoverState(layer, points);
  });

  const iconHtml = `
    <div class="label-icon">
      <div class="gradient-border" style="background-image: ${gradiente};"></div>
      <i class="fa-solid ${point.options.icon}"></i>
    </div>
  `;
  const textHtml = `
    <div class="label-pill" style="background-color: ${baseCol}; color: ${point.options.textColor}">
      ${point.name}
    </div>
  `;

  label.innerHTML = isRightSide ? iconHtml + textHtml : textHtml + iconHtml;
  layer.appendChild(label);

  const labelWidth = label.offsetWidth;
  const labelHeight = label.offsetHeight;
  const left = isRightSide
    ? iconCenterX - iconSize / 2
    : iconCenterX - labelWidth + iconSize / 2;

  label.style.left = `${left}px`;
  label.style.top = `${iconCenterY - labelHeight / 2}px`;
}

function renderMenuOverlay(chart) {
  const container = document.getElementById("container");
  const layer = getMenuLayer(container);
  const center = chart.series[0].center;
  const centerX = chart.plotLeft + center[0];
  const centerY = chart.plotTop + center[1];
  const outerRadius = center[2] / 2;
  const points = chart.series[0].points.filter((point) => point.name !== "Spacer");

  layer.innerHTML = "";

  points.forEach((point) => {
    createConnector(layer, point, centerX, centerY, outerRadius);
    createMenuLabel(layer, point, points, centerX, centerY, outerRadius);
  });
}

function renderChart() {
  const realData = categories.map((cat) => {
    let configuracaoLabel = desktopLabelAdjustments[cat.key];

    if (!isDesktop && mobileLeftAdjustments.includes(cat.key)) {
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
      linkPt: cat.linkPt,
      linkEn: cat.linkEn,
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
          renderMenuOverlay(this);
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
                linha.element.style.setProperty("stroke-width", "0", "important");
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
        size: "42%",
        innerSize: "88%",
        borderWidth: 0,
        startAngle: -25,

        states: { hover: { halo: false, brightness: 0 } },

        dataLabels: {
          enabled: false,
          useHTML: true,
          distance: 44,
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
            const baseWidth = telaAtual < 768 ? 6 : 12;
            const fixedHeight = telaAtual < 768 ? 12 : 15;
            const angle = this.angle;

            let pTipX = pDonutX + Math.cos(angle) * fixedHeight;
            let pTipY = pDonutY + Math.sin(angle) * fixedHeight;

            const pDonutX1 = pDonutX + Math.cos(angle + Math.PI / 2) * baseWidth;
            const pDonutY1 = pDonutY + Math.sin(angle + Math.PI / 2) * baseWidth;
            const pDonutX2 = pDonutX - Math.cos(angle + Math.PI / 2) * baseWidth;
            const pDonutY2 = pDonutY - Math.sin(angle + Math.PI / 2) * baseWidth;

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
            const isRightSide = Math.cos(point.angle) >= 0;
            const layoutClass = isRightSide ? "right-layout" : "left-layout";
            const gradiente = `linear-gradient(135deg, ${baseCol}, #1a1a1a)`;

            let html = `<div style="padding: 15px; margin: -15px;">`;

            html += `<div class="custom-label ${layoutClass}" onclick="window.openMainMenuCard('${point.options.key}')">`;
            const iconeHTML = `
                      <div class="label-icon">
                          <div class="gradient-border" style="background-image: ${gradiente};"></div>
                          <i class="fa-solid ${point.icon}"></i>
                      </div>
                  `;

            const textoHTML = `
                      <div class="label-pill" style="background-color: ${baseCol}; color: ${point.textColor}">
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

renderChart();

window.addEventListener("languagechange", renderChart);
