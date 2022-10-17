import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const inputArea = document.querySelector("#input-area");
const submitButton = document.querySelector("#submit-data");
const addData = document.querySelector("#add-data");
const navButton = document.querySelector("#navigation");

const getMunicipalities = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const response = await fetch(url);
  if (!response.ok) return;
  const data = await response.json();

  let municipalities = {};
  for (let i = 0; i < data.variables[1].values.length; i++) {
    const value = data.variables[1].values[i];
    const key = data.variables[1].valueTexts[i].toLowerCase();
    municipalities[key] = value;
  }
  return municipalities;
};

const getData = async (municipalityCode) => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: [
        {
          code: "Vuosi",
          selection: {
            filter: "item",
            values: [
              "2000",
              "2001",
              "2002",
              "2003",
              "2004",
              "2005",
              "2006",
              "2007",
              "2008",
              "2009",
              "2010",
              "2011",
              "2012",
              "2013",
              "2014",
              "2015",
              "2016",
              "2017",
              "2018",
              "2019",
              "2020",
              "2021"
            ]
          }
        },
        {
          code: "Alue",
          selection: {
            filter: "item",
            values: [`${municipalityCode}`]
          }
        },
        {
          code: "Tiedot",
          selection: {
            filter: "item",
            values: ["vaesto"]
          }
        }
      ],
      response: {
        format: "json-stat2"
      }
    })
  });
  if (!response.ok) {
    return;
  }
  const data = await response.json();
  return data;
};

const updateData = async (chart, municipalityCode) => {
  const data = await getData(municipalityCode);

  const years = Object.values(data.dimension.Vuosi.category.label);
  const populations = data.value;

  const chartData = {
    labels: years,
    datasets: [
      {
        name: "population",
        chartType: "line",
        values: populations
      }
    ]
  };
  chart.update(chartData);
};

const buildChart = async (municipalityCode) => {
  const data = await getData(municipalityCode);

  const years = Object.values(data.dimension.Vuosi.category.label);
  const populations = data.value;
  const chartData = {
    labels: years,
    datasets: [
      {
        name: "population",
        chartType: "line",
        values: populations
      }
    ]
  };

  const chart = new Chart("#chart", {
    title: "Population of municipality by year.",
    data: chartData,
    height: 450,
    colors: ["#eb5146"]
  });

  return chart;
};

const addDataPoint = (chart) => {
  const values = chart.data.datasets[0].values;
  let prediction = 0;

  for (let i = 0; i < values.length - 1; i++) {
    prediction += values[i + 1] - values[i];
  }
  prediction /= values.length - 1;

  prediction += values.at(-1);

  const year = 2000 + values.length;
  chart.addDataPoint(`${year}`, [prediction]);
};

const init = async () => {
  const municipalities = await getMunicipalities();

  const chart = await buildChart("SSS");
  sessionStorage.setItem("municipalityCode", "SSS");
  inputArea.value = "whole country";

  submitButton.addEventListener("click", () => {
    const municipality = inputArea.value.toLowerCase();
    const municipalityCode = municipalities[municipality];
    sessionStorage.setItem("municipalityCode", municipalityCode);
    updateData(chart, municipalityCode);
  });
  addData.addEventListener("click", () => {
    addDataPoint(chart);
  });
  navButton.addEventListener("click", () => {
    window.location.href = "newChart.html";
  });
};

init();
