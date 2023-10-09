// Function to initialize the chart
function init() {
    // Define the dimensions and size for the SVG
    var w = 500;
    var h = 300;

    // Initialize the dataset
    var dataset = [24, 8, 9, 15, 21, 7, 4, 13, 21, 13, 25];

    // Create the x and y scales
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([h, 0]);

    // Create the SVG element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "chart");

    // Create and style the bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return h - yScale(d);
        })
        .attr("fill", "lightgreen")
        .on("mouseover", function (event, d) {
            // Show tooltip on mouseover
            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 3;
            var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .text(d);
            d3.select(this)
                .transition()
                .attr("fill", "lightblue");
        })
        .on("mouseout", function (d) {
            // Hide tooltip on mouseout
            d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "lightgreen");
            d3.select("#tooltip").remove();
        });

    // Button to add a new bar
    d3.select("#add")
        .on("click", function () {
            var maxValue = 25;
            var newNumber = Math.floor(Math.random() * maxValue);
            dataset.push(newNumber);
            xScale.domain(d3.range(dataset.length));
            updateBars();
        });

    // Button to remove the last bar
    d3.select("#remove")
        .on("click", function () {
            dataset.pop();
            updateBars();
        });

    // Button for toggling sort
    var ascendingSort = true; // Default sorting order
    d3.select("#sort")
        .on("click", function () {
            ascendingSort = !ascendingSort; // Toggle sorting order
            dataset.sort(function (a, b) {
                return ascendingSort ? a - b : b - a;
            });
            sortBars();
        });

    // Function to update the bars based on the dataset
    function updateBars() {
        var bars = svg.selectAll("rect")
            .data(dataset);

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", function (d) {
                return yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return h - yScale(d);
            })
            .attr("fill", "teal")
            .on("mouseover", function (event, d) {
                // Show tooltip on mouseover
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2 - 10;
                var yPosition = parseFloat(d3.select(this).attr("y")) + 15;
                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .text(d);
                d3.select(this)
                    .transition()
                    .attr("fill", "orange");
            })
            .on("mouseout", function (d) {
                // Hide tooltip on mouseout
                d3.select(this)
                    .transition()
                    .attr("fill", "rgb(255, 192, 203");
                d3.select("#tooltip").remove();
            });

        bars.exit()
            .transition()
            .duration(500)
            .attr("x", w)
            .remove();
    }

    // Function to sort bars
    var sortOrder = "asc"; // Default sorting order is ascending

    function sortBars() {
        sortData();
        svg.selectAll("rect")
            .sort(function (a, b) {
                if (sortOrder === "asc") {
                    return d3.ascending(a, b);
                } else {
                    return d3.descending(a, b);
                }
            })
            .attr("x", function (d, i) {
                return xScale(i);
            });

        // Toggle the sorting order
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    // Function to sort data
    function sortData() {
        if (sortOrder === "asc") {
            dataset.sort(function (a, b) {
                return a - b;
            });
        } else {
            dataset.sort(function (a, b) {
                return b - a;
            });
        }
    }
}

window.onload = init; // Call the init function when the window loads