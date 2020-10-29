const margin = { top: 20, right: 35, bottom: 20, left: 40 };
const width = 900 - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;

export default function AreaChart(container) {

//initialize
  const listeners = { brushed: null };

//create SVG and margins
  const svg = d3
    .selectAll(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const xAxis = d3
    .axisBottom()
    .scale(x)
    .ticks(10);

  const yAxis = d3
    .axisLeft()
    .scale(y)
    .ticks(10);

  const brush = d3
    .brushX()
    .extent([[0, 0], [width, height]])
    .on("brush", brushed)
    .on("end", brushed);

  svg
    .append("g")
    .attr("class", "brush")
    .call(brush);

  svg.append("g").attr("class", "x-axis");
  svg.append("g").attr("class", "y-axis");

// Create a single path for the area
  svg.append("path").attr("class", "path-class");

  xAxis.ticks(10);
  yAxis.ticks(8);

  function brushed(event) {
    if (event.selection) {
      listeners["brushed"](event.selection.map(x.invert));
    }
  }

//UPDATE FUNCTION
  function update(data) {

    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.total)]);

//Create an area generator
    let area = d3
      .area()
      .x(d => x(d.date))
      .y1(d => y(d.total))
      .y0(d => y.range()[0]);

    d3.select(".path-class")
      .datum(data)
      .attr("d", area)
      .attr("fill", "navy");

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.select(".y-axis").call(yAxis);
  }

  function on(event, listener) {
    listeners[event] = listener;
  }
  return {
    update,
    on
  };
}
