import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
const navButton = document.querySelector("#navigation");

const getBirthData = async (municipalityCode) => {
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
            values: ["vm01"]
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

const getDeathData = async (municipalityCode) => {
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
            values: ["vm11"]
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

const buildChart = async (municipalityCode) => {
  const birthData = await getBirthData(municipalityCode);
  const deathData = await getDeathData(municipalityCode);

  const years = Object.values(birthData.dimension.Vuosi.category.label);
  const births = birthData.value;
  const deaths = deathData.value;
  const chartData = {
    labels: years,
    datasets: [
      {
        name: "births",
        values: births
      },
      {
        name: "deaths",
        values: deaths
      }
    ]
  };

  const chart = new Chart("#chart", {
    title: "Births and deaths in municipality",
    type: "bar",
    data: chartData,
    height: 450,
    colors: ["#63d0ff", "#363636"]
  });

  return chart;
};

navButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

buildChart(sessionStorage.getItem("municipalityCode"));
