const dateParser = d3.timeParse("%Y-%m-%d")
// Arrow functions to read data points. These return _unscaled_ values.
const xAccessor = d => dateParser(d.date)
const yAccessor = d => d.temperature

// Define dimensions well use for with our wrapper and chart.
const dimensions = {
  width: window.innerWidth * 0.9,
  height: 400,
  margin: {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  },
}

// Compute the dimensions for our chart.
dimensions.boundedWidth = dimensions.width
  - dimensions.margin.left
  - dimensions.margin.right
dimensions.boundedHeight = dimensions.height
  - dimensions.margin.top
  - dimensions.margin.bottom

async function drawLineChart() {
  const dataset = await d3.json("weather.json")
  console.log(dataset);
  console.table(dataset);
  // Define our svg element (within the wrapper div) and its size.
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);
  // Create a bounding box inside the wrapper to contain the chart.
  // This requires an SVG <g> element to create a new grouping inside
  // the SVG (akin to <div> in HTML).
  const bounds = wrapper.append("g")
    .style(
      "transform",
      `translate(
        ${dimensions.margin.left}px,
        ${dimensions.margin.top}px
      )`
    );

  // DEBUG: Test that d3.extent() returns the min and max of an array.
  console.log(d3.extent(dataset, yAccessor));
  console.log(d3.extent(dataset, xAccessor));
  // Create a linear scale to convert temperatures into pixels/location
  // on the y axis.
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    // The range is the highest and lowest number we want our scale to output.
    .range([dimensions.boundedHeight, 0]);

  // At what y value is the freezing point on our chart?
  console.log("Freezing temp at " + yScale(32));
  // Draw a box around temps freezing and below.
  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures = bounds.append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight
    - freezingTemperaturePlacement)
    .attr("rx", 15)
    .attr("fill", "#e0f3f3")

  // Create a time scale that converts dates to location on the graph.
  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  // We're going to define an SVG element called 'path' with a 'd' element
  // to draw a line.
  //bounds.append("path").attr("d", "M 0 0 L 100 0 L 100 100 L 0 50 Z") // By hand.
  // Instantiate a line generator because this is more convenient.
  // Wrap our accessor functions in scale functions to return values that
  // are scaled/positioned in the graph correctly.
  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)));

  // Add the 'path' element to our bounds. Set the 'd' element to our line generator.
  const line = bounds.append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2);

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale);

  /*
  // Add another 'g' element to hold our y axis.
  const yAxis = bounds.append("g");
  // Pass the new element into the axis generator to tell it where to draw it.
  yAxisGenerator(yAxis);
  */
  // Same as above but doesn't "break up chained methods".
  // TODO: Understand this more.
  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
}

drawLineChart();
