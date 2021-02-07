
//
// Customizing Axes
// Code from the medium post: https://medium.com/@ghenshaw.work/customizing-axes-in-d3-js-99d58863738b
//

// Margin convention
// From https://observablehq.com/@d3/margin-convention
const margin = {top: 20, right: 20, bottom: 20, left: 10};
const width = 1200 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


// This is a D3 selection.
// We select the div element with ID 'time_area' and append an 'svg' element.
// We customize the svg element a bit, including width, height, and stat of origin.
const svg = d3.select("#time_area").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);


// Select our tooltip area and ensure it's invisible.
/*
// Whenever hovering over a tick, the entire timeline disappears...
const tooltip = d3.select("#time_area")
  .classed("tooltip", true);
*/

function addMin(date, minutes) {
  let minutes_in_millis = minutes * 60000;
  return new Date(date.getTime() + minutes_in_millis);
}

var now = new Date();
// Define the scale for our axis.
// A 30-minute scale.
let xScale = d3.scaleTime()
               .domain([now.getTime(), addMin(now, 30).getTime()])
               .range([0, width])
               .nice();

// time.invert returns the time that corresponds to a certain value in the range.
// xScale.invert(600); // Will return a date string.

// NOTE: axisBottom() doesn't place the axis at the bottom of a graph.
// It creates an axis where _tick marks_ are on the bottom.
let xAxisGenerator = d3.axisBottom(xScale);

// Customizations using the axis generator; these are done pre-render.
//xAxisGenerator.ticks(30); // Default is 10.
xAxisGenerator.ticks(d3.timeMinute.every(2)); // Alternative.
const timeFormat = d3.timeFormat("%H:%M");
xAxisGenerator.tickFormat(timeFormat);

// Render the axis.
// We can use D3 selections to modify the access post-render.
// Here, xAxis is a D3 selection itself, thanks to append().
let xAxis = svg.append("g")
              .call(xAxisGenerator);
// NOTE: It looks like axes support an .orient() function: .orient("bottom")

// By default, axes are at the SVG origin, which is the upper-left of the image.
// Customizations using the axis after it is called
// Place the axis at the bottom of the graph.
xAxis.attr("transform",`translate(${0},${height})`);


/*
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
function updateTick() {
  restoreTicks();
  let seconds = getSeconds();

  // Select all tick elements, filtering on the one that matches the seconds
  // value. Then, style it.
  let tick = d3.selectAll("g.tick")
    .filter(function() {
      return d3.select(this.lastChild).text() == seconds;
    })

  // We expect only 2 children: 'line' and 'text'.
  let _line = d3.select(tick.nodes()[0].firstChild);
  let _text = d3.select(tick.nodes()[0].lastChild);
  _text.attr("font-size", "15").attr("fill", "red");
  _line.attr("y2", "-100")
    .attr("stroke", "red")
    .attr("stroke-width", "3");

  refreshTicks();
}

function refresh_time() {
    var interval = 1000; // Milliseconds.
    setTimeout('display_time()', interval)
}
*/

function prefix_zero(num) {
    return num < 10 ? `0${num}` : num;
}

function display_time() {
    var today    = new Date();
    var hour     = prefix_zero(today.getHours());
    var minute   = prefix_zero(today.getMinutes());
    var second   = prefix_zero(today.getSeconds());
    var the_time = `${hour}:${minute}:${second}`;
    document.getElementById('the_clock').innerHTML = the_time;
    /*
    updateTick();
    refresh_time();
    */
}

// Display a tick's text value as a tooltip.
// Receives a MouseEvent and datum.
function tickOnMouseOver(_event, d) {
  console.log("d = " + d);
  const [x, y] = d3.pointer(_event);
  console.log("x = " + x + "; y = " + y);

  // In this context 'this' is the tick element.
  let tick = d3.select(this);
  console.log(tick);
  tooltip.text(tick.text());
  tooltip.attr("transform", `translate(${x}, ${y})`);
}

function tickOnMouseEnter(_event, d) {
  //tooltip.style("opacity", 1);
}

// Make the tooltip go away.
function tickOnMouseLeave(_event) {
  //tooltip.style("opacity", 0)
}

// Select all tick text elements and bind events to them.
//const tickLines = d3.selectAll("text");
const tickLines = d3.selectAll(".tick");
tickLines
  .on("mouseover", tickOnMouseOver)
  .on("mouseenter", tickOnMouseEnter)
  .on("mouseleave", tickOnMouseLeave);

