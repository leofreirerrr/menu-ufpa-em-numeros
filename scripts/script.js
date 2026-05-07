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
const categories = [
  // --- LADO DIREITO ---
  // (Lembre de ajustar os IDs para baterem com os do seu objeto linksPowerBI)
  {
    name: "Edições Anteriores",
    color: "#34495e",
    icon: "fa-clock-rotate-left",
    link: "dashboard.html?id=11",
  },
  {
    name: "Indicadores do TCU",
    color: "#8e44ad",
    icon: "fa-chart-line",
    link: "dashboard.html?id=9",
  },
  {
    name: "Infraestrutura",
    color: "#3498db",
    icon: "fa-city",
    link: "dashboard.html?id=8",
  },
  {
    name: "Gestão Orçamentária",
    color: "#2980b9",
    icon: "fa-coins",
    link: "dashboard.html?id=7",
  },
  {
    name: "Outras Unidades",
    color: "#16a085",
    icon: "fa-building",
    link: "dashboard.html?id=6",
  },

  // --- LADO ESQUERDO ---
  {
    name: "Área da Saúde",
    color: "#1abc9c",
    icon: "fa-hospital",
    link: "dashboard.html?id=5",
  },
  {
    name: "Gestão de Pessoas",
    color: "#f1c40f",
    icon: "fa-users",
    textColor: "#333",
    link: "dashboard.html?id=4",
  },
  {
    name: "Assistência Estudantil",
    color: "#e67e22",
    icon: "fa-book-open-reader",
    link: "dashboard.html?id=3",
  },
  {
    name: "Atividades Acadêmicas",
    color: "#e74c3c",
    icon: "fa-user-graduate",
    link: "dashboard.html?id=2",
  },
  {
    name: "Informações Gerais",
    color: "#c0392b",
    icon: "fa-globe",
    link: "dashboard.html?id=1",
  },
];

const isDesktop = window.innerWidth > 768;

const realData = categories.map((cat) => {
  let configuracaoLabel = undefined;

  if (cat.name === "Outras Unidades") {
    configuracaoLabel = isDesktop ? { distance: 70, x: -30 } : undefined;
  } else if (cat.name === "Área da Saúde") {
    configuracaoLabel = isDesktop ? { distance: 70, x: 30 } : undefined;
  } else if (cat.name === "Atividades Acadêmicas") {
    configuracaoLabel = !isDesktop ? { x: -35 } : undefined;
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
    name: cat.name,
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

Highcharts.chart("container", {
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
                Dados que fortalecem a<br> gestão e ampliam a<br> transparência
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
      size: "55%",
      innerSize: "88%",
      borderWidth: 0,
      startAngle: -30,

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

          // Encolhe os triângulos pela metade no celular
          const baseWidth = telaAtual < 768 ? 6 : 12;
          const fixedHeight = telaAtual < 768 ? 12 : 15;
          const angle = this.angle;

          // Ponta (Irradia reto para fora a partir do centro)
          let pTipX = pDonutX + Math.cos(angle) * fixedHeight;
          let pTipY = pDonutY + Math.sin(angle) * fixedHeight;

          // Base (Perfeitamente perpendicular à ponta, colada no donut)
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
          const rightSideNames = [
            "Outras Unidades",
            "Gestão Orçamentária",
            "Infraestrutura",
            "Indicadores do TCU",
            "Edições Anteriores",
          ];
          const isRightSide = rightSideNames.includes(point.name);
          const layoutClass = isRightSide ? "right-layout" : "left-layout";
          const gradiente = `linear-gradient(135deg, ${baseCol}, #1a1a1a)`;

          const linkDestino = point.options.link || "#";

          let html = `<div style="padding: 15px; margin: -15px;">`;

          // MÁGICA AQUI: O onclick formatado perfeitamente para abrir o Power BI
          html += `<div class="custom-label ${layoutClass}" onclick="window.location.href='${linkDestino}'">`;
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
  series: [{ name: "Dados", data: chartData }],

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
