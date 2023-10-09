function init(){
    // Define the dimensions and size for the SVG
    var w = 500;
	var h = 300;

	var dataset =[24,8,9,15,21,7,4,13,21,13,25];

    //Ordinal scale method
    var xScale = d3.scaleBand() 
                    //calculating the range of the domain
                .domain(d3.range(dataset.length))
                    //specify the size of range the domain needs to be mapped too.
                .rangeRound([0,w])
                    //generate a padding value of 5% of the bandwidth
                .paddingInner(0.05)

    var yScale = d3.scaleLinear()
                        .domain([0,d3.max(dataset)])
                        .range([0,h]);

    //SVG element
    var svg = d3.select("#lab5-bar")
                .append("svg")
                .attr("width",w)
                .attr("height",h);

    //initial rectangles
    svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x",function(d,i){
        return xScale(i);
    })
    .attr("y",function(d){
        return h - yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height",  function (d) {
            return yScale(d);
        })
    .attr("fill","lightgreen");

    //initial labels
    svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("fill","purple")
    .attr("text-anchor","middle")
    .attr("x", function(d, i) {
        return xScale(i) + xScale.bandwidth()/2;
    })
    .attr("y", function(d) {
        return h - yScale(d)+14;
    });

    //Add button
    d3.select("#add")
    .on("click", function(){

    var maxValue = 25;
    var newNumber = Math.floor(Math.random()*maxValue);
     dataset.push(newNumber);

    xScale.domain(d3.range(dataset.length));

    var bars = svg.selectAll("rect")
                    .data(dataset)
    
    var texts = svg.selectAll("text")
                    .data(dataset);

    bars.enter()
        .append("rect")
        .attr("x",w)
        .attr("y", function(d){
        return h - yScale(d);
        })
        .merge(bars)
        .transition()
        .duration(500)
        .attr("fill","lightgreen")
        .attr("x",function(d,i) {
        return xScale(i)
        })
        .attr("y",function(d){
        return h - yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){
        return yScale(d);
        });
    
    texts.enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("fill", "purple")
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
          return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
          return h - yScale(d) + 14;
        })
        .merge(texts)
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
          return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
          return h - yScale(d) + 14;
        });
    });

     //Remove button
    d3.select("#remove")
    .on("click", function(){

    xScale.domain(d3.range(dataset.length));

    var bars = svg.selectAll("rect")
                    .data(dataset)

    var texts = svg.selectAll("text")
                    .data(dataset)

    dataset.shift();

    bars.exit()
        .transition()
        .duration(500)
        .attr("x",w)
        .remove();
    
    texts.exit()
        .transition()
        .duration(500)
        .attr("x",w)
        .remove();
   
     });
}
window.onload =init;
