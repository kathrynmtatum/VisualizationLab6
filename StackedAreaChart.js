const margin = ({top: 20, right: 35, bottom: 20, left: 40})
const width = 900 - margin.left - margin.right
const height = 450 - margin.top - margin.bottom

let stackdata;


export default function StackedAreaChart(container) {
  
//initialize
    let selected = null, xDomain, data;
    
    const svg2 = d3.selectAll(container).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    svg2.append("clipPath")
        .attr("id", "area")
        .append("rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0)

    const x = d3.scaleTime()
        .range([0, width])

    const y = d3.scaleLinear()
        .range([height, 0])

    const categories = d3.scaleOrdinal()
        .range(d3.schemeAccent)

    const xAxis = d3.axisBottom()
        .scale(x)
        .ticks(10)

    const yAxis = d3.axisLeft()
        .scale(y)

    svg2.append("g")
        .attr("class", "x-axis-stack2")

    svg2.append("g")
        .attr("class", "y-axis-stack2")

    svg2.append("clipPath")
        .attr("id", "area")
        .append("rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    const tooltip = svg2.append('text')
        .attr('x', 10)
        .attr('y', 10)
        .attr('font-size', 16)


//UPDATE FUNCTION
	function update(data){ 
        
        stackdata = data;
        const keys=selected? [selected] : stackdata.columns.slice(1)

        let stack = d3.stack()
        .keys(keys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

        let stacked = stack(data)
        console.log(stacked)
        console.log(data)

        x.domain(xDomain? xDomain: d3.extent(data, d => d.date))
        y.domain([0, d3.max(stacked, c => d3.max(c, d => d[1]))])
        categories.domain(keys)

        const stackArea = d3.area()
            .x(d => x(d.data.date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))

        const areas = svg2.selectAll('.area')
            .data(stacked, d => d.key);

        areas.enter()
            .append('path')
            .merge(areas)
            .attr('class', 'area')
            .attr("d", stackArea)
            .attr('clip-path','url(#area)')
            .style('fill', d => categories(d.key))
            .on("mouseover", (event, d) => tooltip.text(d.key))
            .on("mouseout", (event) => tooltip.text(' '))
            .on("click", (event, d) => {
                // toggle selected based on d.key
                if (selected === d.key) {
                    selected = null;
                } 
                else {
                selected = d.key;
                }
            update(data); // simply update the chart again
            })
    
        areas.exit().remove()        

        svg2.select('.x-axis-stack2')
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)

        svg2.select('.y-axis-stack2')
            .call(yAxis)
    }

    function filterByDate(range){
		xDomain = range;  // -- (3)
		update(stackdata); // -- (4)
	}
    
	return {
        update,
        filterByDate
	}
}