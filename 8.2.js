// Define the width and height of the SVG
var w = 500;
var h = 300;

// Create a color scale for mapping unemployment data to colors
var color = d3.scaleQuantize()
.range(["#fbb4b9","#d7b5d8","#df65b0","#dd1c77", "#980043"])

// Create a Mercator projection for map visualization, centered on Victoria
var projection = d3.geoMercator()
    .center([145, -36]) // Centered coordinates set to Victoria
    .translate([w/2, h/2]) // Translate to the center of the SVG
    .scale(2450); // Set the scale for the map

// Create a path generator that will convert GeoJSON data into SVG path data
var path = d3.geoPath()
    .projection(projection); // Used for mapping later when it's called "path"

// Create an SVG element within the HTML element with the id "chart"
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// Load CSV data containing unemployment information
d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
    // Set the domain of the color scale based on the range of unemployment values
    color.domain([
        d3.min(data, function(d) { return d.unemployed; }),
        d3.max(data, function(d) { return d.unemployed; })
    ]);

    // Load GeoJSON data for local government areas (LGAs) in Victoria
    d3.json("LGA_VIC.json").then(function(json) {
        // Merge the unemployment data with GeoJSON data
        //loop through once for each unemployed value
        for (var i = 0; i < data.length; i++) {
            // City name from CSV
            var dataState = data[i].LGA;
            // Value from CSV, converted from string to float
            var dataValue = parseFloat(data[i].unemployed);
            // Find the corresponding LGA inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.LGA_name;
                if (dataState == jsonState) {
                    // Copy the data value into JSON
                    json.features[j].properties.value = dataValue;
                    // Stop looking through JSON
                    break;
                }
            }
        }

        // Create path elements for each LGA and style them based on unemployment values
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d) {
                // Get the data value
                var value = d.properties.value;

                if (value) {
                    // If the value exists
                    return color(value);
                } else {
                    // If the value is undefined
                    return "#ccc"; // Light gray
                }
            });

        // Load CSV data containing city coordinates
        d3.csv("VIC_city.csv").then(function(data) {
            // Create circles for each city on the map
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([+d.lon, +d.lat])[0];
                })
                .attr("cy", function(d) {
                    return projection([+d.lon, +d.lat])[1];
                })
                .attr("r", 2)
                .style("fill", "yellow");

            // Add city labels as text elements
            svg.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .attr("x", function(d) {
                    return projection([+d.lon, +d.lat])[0] + 5; // Adjust the label position
                })
                .attr("y", function(d) {
                    return projection([+d.lon, +d.lat])[1];
                })
                .text(function(d) {
                    return d.place;
                })
                .style("font-size", "12px")
                .style("fill", "black");
        });
    });
});

// Call the 'init' function when the window loads
window.onload = init;
