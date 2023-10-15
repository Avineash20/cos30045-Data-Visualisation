function init() {

    var w = 600;
    var h = 300;
    var padding = 60;

    var dataset,xScale,yScale,line,xAxis,yAxis,area;
    var formatTime = d3.timeFormat("%Y");

    //CSV input
    d3.csv("Unemployment_78-95.csv", function(d) {
        return {
            date: new Date(+d.year, +d.month-1),
            number: +d.number
        };
    }).then(function(data) {
        dataset = data;

        lineChart(dataset);
    });

    console.table(dataset, ["date", "number"]);

    function lineChart(dataset)
    {

        xScale = d3.scaleTime()
        .domain([
            d3.min(dataset,function(d){return d.date;}),
            d3.max(dataset,function(d){return d.date; })
        ])
        .range([padding,w]);

        //Set up the scale
        yScale = d3.scaleLinear()
        .domain([0,d3.max(dataset,function(d){ return d.number;})
        ])
        .range([h - padding , 0]);

        //****/
        xAxis = d3.axisBottom()
                    .ticks(10)
                    .tickFormat(formatTime)
                    .scale(xScale);
        
        yAxis = d3.axisLeft()
                    .ticks(10)
                    .scale(yScale);

        //Set up the line
        line = d3.line()
                    .x(function(d){return xScale(d.date); })
                    .y(function(d) {return yScale(d.number); });

        //Set up the SVG and Path
        var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

       // Turn your  line  chart into an area chart
        area = d3.area()
               .x(function(d) {return xScale(d.date); })
                .y0(function() {return yScale.range()[0]; })
               .y1(function(d) {return yScale(d.number); })

        svg.append("path")
        .datum(dataset)
        .attr("class","area")
        .attr("d", area)
        .attr("fill","#C8B6A6");

        svg.append("g")
            .attr("transform", "translate(0,"+(h - padding)+")")
            .call(xAxis);

        svg.append("g")
        .attr("transform", "translate(60,0)")
        .call (yAxis)
        

        //Add some annotation
        svg.append("line")
            .attr("class", "line halfMilMark")
        //start of line
        .attr("x1" , padding)
        .attr("y1", yScale(500000))
        //end of line
        .attr("x2", w)
        .attr("y2", yScale(500000));
        

        svg.append("text")
            .attr("class", "halfMilLabel")
            .attr("x", padding + 10)
            .attr("y", yScale(500000) - 7)
            .text("Half a million unemployed")
            .attr("fill","red");
    }
}
window.onload = init;