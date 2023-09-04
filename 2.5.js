// This function initializes the chart when the window loads.
function init() {
    // Define the width and height of the chart and the padding between bars.
    var w = 520;
    var h = 100;
    var padding = 1;
  
    // Define a function to create a bar chart for the given data and ID.
    var barchart = function(data, id) {
      // Select the HTML element with the specified ID to append the chart to.
      var svg = d3.select(`#chart${id}`)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("margin-bottom", "5px");
  
      // Create and position rectangles for each data point (bar).
      svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
          return (w / data.length) * i;
        })
        .attr("y", function(d) {
          // Calculate the y-position based on data and subtract 25 for padding.
          return h - d[`pets${id}`] * 1.5 - 25;
        })
        .attr("width", w / data.length - padding)
        .attr("height", function(d) {
          // Scale the height of the bar based on data.
          return d[`pets${id}`] * 1.5;
        })
        .attr("fill", function(d) {
          return "lightgreen";
        });
  
      // Add labels to the bars.
      svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
          return d['animal'];
        })
        .attr("x", function(d, i) {
          return (w / data.length) * i;
        })
        .attr("y", function(d) {
          return h - 10;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("fill", "green");
  
      // Add a caption for the chart.
      d3.select(`#chart${id}`)
        .append("figcaption")
        .text(`Pet ownership in ${id}`);
    }
  
    // Load the CSV data and create the bar charts for 2019 and 2021.
    d3.csv("pet_ownership.csv").then(function(data) {
      console.log(data);
      barchart(data, 2019);
      barchart(data, 2021);
    });
  }
  
  // Call the init function when the window loads.
  window.onload = init;
  