function init(){
    var w = 300; // width of svg
    var h = 300; // height of svg
    var dataset = [ // hard-code dataset
        {"apples": 5, "oranges": 10, "grapes": 22},
        {"apples": 4, "oranges": 12, "grapes": 28},
        {"apples": 2, "oranges": 19, "grapes": 32},
        {"apples": 7, "oranges": 23, "grapes": 35},
        {"apples": 23, "oranges": 17, "grapes": 43}
    ];

    var yScale = d3.scaleLinear() // y-scale domain set from 0 to max total value of apple orange and grape
                    .domain([0,d3.max(dataset, function(d){
                        return d.apples + d.oranges +d.grapes;
                    })])
                    .range([h,0]); //range upside down
    
    var xScale = d3.scaleBand()
                    .domain(d3.range(dataset.length)) //domain is the number of entities in dataset 
                    .rangeRound([0,w])
                    .paddingInner(0.05); // padding between each bar

    var color = d3.scaleOrdinal(d3.schemeCategory10); //color scheme
    
    var stack = d3.stack() // key for the stack value
                    .keys(["apples","oranges","grapes"]);

    var series = stack(dataset);

    console.log(series);
    var svg = d3.select("#chart") //create svg element
                .append("svg")
                .attr("width", w)
                .attr("height",h);

    var groups = svg.selectAll("g")
                    .data(series) //series produce by the stack
                    .enter()
                    .append("g")
                    .style("fill",function(d,i){
                        return color(i); // color depends on the type
                    });

    var rects = groups.selectAll("rect")
                        .data(function(d){ return d;})
                        .enter()
                        .append("rect")
                        .attr("x", function(d,i){
                            return xScale(i);
                        })
                        .attr("y", function(d,i){
                            return yScale(d[1]);
                        })
                        .attr("height", function(d){
                            return yScale(d[0]) - yScale(d[1]); // the height difference between 2 next elements within the same bar
                        })
                        .attr("width", xScale.bandwidth());// get the width 
}
window.onload = init;