
//
// Customizing Axes
// Code from the medium post: https://medium.com/@ghenshaw.work/customizing-axes-in-d3-js-99d58863738b
//

// Margin convention
const margin = {top: 20, right: 20, bottom: 20, left: 10};
const width = 1200 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


// TODO: Learn more about this.
const svg = d3.select("body").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);


// Define the scale for our axis.
//const min_data = 0, max_data = 10000;
const min_data = 0, max_data = 59;
let xScale = d3.scaleLinear()
               .domain([min_data, max_data])
               .range([0, width]);

// NOTE: axisBottom() doesn't place the axis at the bottom of a graph.
// It creates an axis where _tick marks_ are on the bottom.
let xAxisGenerator = d3.axisBottom(xScale);

// Customizations using the axis generator; these are done pre-render.
//xAxisGenerator.ticks(3);
xAxisGenerator.ticks(max_data);
//xAxisGenerator.tickValues([3000,5000,9000]);
//xAxisGenerator.tickFormat((d,i) => ['A','B','C'][i]);
//xAxisGenerator.tickSize(-200);


// Render the axis.
let xAxis = svg.append("g")
              .call(xAxisGenerator);

// Customizations using the axis after it is called
// Place the axis at the bottom of the graph.
xAxis.attr("transform",`translate(${0},${height})`);
// Selects the first tick, embiggens it, and colors it..
// See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text for more attributes.
xAxis.select(".tick text")
     .attr("font-size","15")
     .attr("fill","red")

// Adjust styling for the tick labeled "17" (first element is the path).
xAxis.select(":nth-child(19) text")
  .attr("fill","green")
	.attr("font-size","15");
// Increase stroke width of tick labeled "17". Also, make tick longer/extend north.
xAxis.select(":nth-child(19) line")
	.attr("stroke-width","10")
	.attr("stroke", "green")
	.attr("y2", "-200");

// Select a tick where the text is a specific value.
// We can use this to  modify the tick whose text value matches the seconds!
d3.selectAll("text")
  .filter(function(){ 
    return d3.select(this).text() == 26 || d3.select(this).text() == 13
  })
	.attr("font-size", "15")
  .attr("fill", "steelblue");
/*
xAxis.select(".domain")
     .attr("stroke","#E04836")
     .attr("stroke-width","10")
     .attr("opacity",".6")
     .attr("stroke-dasharray","4");
xAxis.selectAll(".tick text")
     .attr("font-size","20")
     .attr("rotate","15")
     .attr("font-family","cursive");
xAxis.selectAll(".tick line")
     .attr("stroke","steelBlue");
xAxis.select(":nth-child(3) line")
     .attr("stroke-width","10");

*/
