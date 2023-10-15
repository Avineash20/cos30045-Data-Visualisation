function init(){
    var w = 600; // width of svg
    var h = 300; // height of svg
    var dataset = [45,25,20,10,6,5]; // hard-code dataset
    var outerRadius = w/5; //the total radius of the pie
    var innerRadius = 0; //inner radius to make it donut
    var arc = d3.arc() // create a calcutaion for the pie
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);

    var pie = d3.pie();
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#chart") //create svg element
                .append("svg")
                .attr("width", w)
                .attr("height",h);

    var arcs = svg.selectAll("g.arc")
                    .data(pie(dataset)) // pie to calculate the dataset
                    .enter()
                    .append("g")
                    .attr("class","arc")
                    .attr("transform",`translate(${outerRadius+w/4},${innerRadius+150})`); // push the pie to right with x value and push under with y value

    arcs.append("path")
        .attr("fill", function(d,i){
            return color(i);
        })
        .attr("d",function(d,i){ // d is the successive coordinate for the pie
            return arc(d,i); 
        })
    arcs.append("text")
        .text(function(d){
            return d.value;
        })
        .attr("transform", function(d){
            return "translate("+arc.centroid(d)+")"; // centroid() finds the middle of an irregular shape.
        })
}
window.onload = init;