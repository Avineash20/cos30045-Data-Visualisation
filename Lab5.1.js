function init() {
    var w = 500;
    var h = 300;

    var barpadding = 20;

    var dataset = [14, 5, 26, 23, 9, 10, 28, 3, 7, 13];
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, w])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)]) // Removed extra bracket here
        .range([h, 0]); // Reversed the range to start from the top

    var svg = d3.select("#chart-container") // Updated the selection to match the container
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "chart");

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
        .attr("fill", "lightgreen");

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return xScale(i) + (xScale.bandwidth() / 2);
        })
        .attr("y", function (d) {
            return yScale(d) - 5; // Adjusted the vertical position
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "purple");

    // Button
    d3.select("#update") // Corrected the button selector
        .on("click", function () {
            var numValues = dataset.length;
            dataset = [];
            var maxValue = 25; // Defined maxValue variable
            for (var i = 0; i < numValues; i++) {
                var newNumber = Math.floor(Math.random() * maxValue);
                dataset.push(newNumber);
            }

            svg.selectAll("rect")
                .data(dataset)
                .transition()
                .attr("y", function (d) {
                    return yScale(d);
                })
                .attr("height", function (d) {
                    return h - yScale(d);
                });

            svg.selectAll("text")
                .data(dataset)
                .style("fill", "purple")
                .text(function (d) {
                    return d;
                })
                .attr("x", function (d, i) {
                    return xScale(i) + (xScale.bandwidth() / 2);
                })
                .attr("y", function (d) {
                    return yScale(d) - 5;
                });
        });
}

// Call the init function to initialize the chart
window.onload = init;
