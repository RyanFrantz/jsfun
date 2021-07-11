
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


// Render the axis.
let xAxis = svg.append("g")
              .call(xAxisGenerator);

// Customizations using the axis after it is called
// Place the axis at the bottom of the graph.
xAxis.attr("transform",`translate(${0},${height})`);

// Refresh it
function refreshTicks() {
  let interval = 1000;
  setTimeout('updateTick();', interval);
}

// Restore all ticks to their original styling.
function restoreTicks() {
  d3.selectAll("text")
  .attr("font-size", "10")
  .attr("fill", "currentColor");

  d3.selectAll("line")
  .attr("stroke", "currentColor")
  .attr("stroke-width", "1")
  .attr("y2", "6");
}

function getSeconds() {
  let today = new Date();
  return today.getSeconds();
}
// Select a tick where the text is a specific value.
// We can use this to  modify the tick whose text value matches the seconds!
// TODO: Rename function to clarify it updates the tick whose second is displayed.
function updateTick() {
  restoreTicks();
  let seconds = getSeconds();

  // Select all tick elements, filtering on the one that matches the seconds
  // value. Then, style it.
  let tick = d3.selectAll("g.tick")
    .filter(function() {
      return d3.select(this.lastChild).text() == seconds;
    });

  // We expect only 2 children: 'line' and 'text'.
  let _line = d3.select(tick.nodes()[0].firstChild);
  let _text = d3.select(tick.nodes()[0].lastChild);
  _text.attr("font-size", "15").attr("fill", "red");
  _line.attr("y2", "-100")
    .attr("stroke", "red")
    .attr("stroke-width", "3");

  refreshTicks();
}

function prefix_zero(num) {
    return num < 10 ? `0${num}` : num;
}

// This is one half of a main loop between this function and display_time().
function refresh_time() {
    var interval = 1000; // Milliseconds.
    setTimeout('display_time()', interval)
}

// Entry point for our program.
function display_time() {
    var today    = new Date();
    var hour     = prefix_zero(today.getHours());
    var minute   = prefix_zero(today.getMinutes());
    var second   = prefix_zero(today.getSeconds());
    var the_time = `${hour}:${minute}:${second}`;
    document.getElementById('the_clock').innerHTML = the_time;
    updateTick();
    refresh_time();
}

// Display a tick's text value as a tooltip.
// Receives a MouseEvent.
function tickOnMouseEnter(_event, datum) {
  //console.log(_event);
  // datum should be the same as the tick node's text.
  console.log(`Tick value: ${datum}`);
  let [x, y] = d3.pointer(_event);
  console.log(JSON.stringify(_event.currentTarget));
  console.log(`x: ${x} y: ${y}`);
  //let value = _event.toElement.textContent;
  // NOTE: I think _event.pageX and _event.pageY would provide coords for the event.

  // In this context 'this' is the text element.
  // Because HTML elements that receive events have `this` bound to them?
  // Yes. `this` refers to the HTML node that received an event.
  let _node = d3.select(this);
  console.log(_node);
  console.log(_node.text());
  console.log(_node.attr("transform").translate);
  tooltip.style("opacity", 1).text(_node.text());
  // TODO: These are null. I think we need the 'tick' element to get position, not the 'text' child here.
  // See https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html#template for examples
  tooltip.style("top", _node.attr("cy") + "px");
  tooltip.style("left", _node.attr("cx") + "px");
}

// Make the tooltip go away.
function tickOnMouseLeave(_event) {
  tooltip.style("opacity", 0)
}

// Select our tooltip element, for use later.
const tooltip = d3.select("#tooltip");

// Select all tick text elements and bind events to them.
//const tickLines = d3.selectAll("text");
const tickLines = d3.selectAll(".tick");
tickLines
  .on("mouseenter", tickOnMouseEnter)
  .on("mouseleave", tickOnMouseLeave);

// With `<body onload='display_time();'>` we don't need this call.
// Without that onload tag, this call will be made when the JS file is
// loaded. Having both seems harmless.
display_time();
