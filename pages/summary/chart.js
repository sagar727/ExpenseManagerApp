const localDB = new LocalDB();
localDB
  .open()
  .then((result) => {
    console.log(result);
    loadChart();
  })
  .catch((error) => {
    console.log(error);
  });

function loadChart() {
  localDB
    .getByExpenseType()
    .then((mdata) => {
      getChart(mdata);
    })
    .catch((error) => {
      console.log(error);
    });
}

function getChart(chartData) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    const data = google.visualization.arrayToDataTable(chartData);

    const options = {
      title: "This month's expenses.",
      titleTextStyle: {
        fontSize: 20,
      },
      is3D: true,
      backgroundColor: "transparent",
      legend: {
        position: "top",
        maxLines: 3,
      },
    };

    const chart = new google.visualization.PieChart(
      document.getElementById("myChart")
    );
    chart.draw(data, options);
  }
}
