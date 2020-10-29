import AreaChart from "/AreaChart.js";
import StackedAreaChart from "/StackedAreaChart.js";
let total_count;
let dataset;
let dataset2;

d3.csv("unemployment.csv", d3.autoType).then(d => {
  console.log(d);
  dataset = d;
  dataset2 = d;
  total_count = 0;
  d.forEach(function(d) {
    total_count = 0;
    total_count += d.Agriculture;
    total_count += d["Wholesale and Retail Trade"];
    total_count += d.Manufacturing;
    total_count += d["Leisure and hospitality"];
    total_count += d["Business services"];
    total_count += d.Construction;
    total_count += d["Education and Health"];
    total_count += d.Government;
    total_count += d.Finance;
    total_count += d["Self-employed"];
    total_count += d.Other;
    total_count += d["Transportation and Utilities"];
    total_count += d.Information;
    total_count += d["Mining and Extraction"];
  });
  
  console.log(dataset);
  const areaChart = AreaChart(".chart");
  areaChart.update(dataset);

  console.log(dataset2);
  const stackedChart = StackedAreaChart(".stacked");
  stackedChart.update(dataset);

  areaChart.on("brushed", range => {
    stackedChart.filterByDate(range);
  });
});
