.on("mouseover", function(event,d){
    //Add a SVG tool tip
    //identify the x and y positions of where you want the text to appear
    var xPosition = parseFloat(d3.select(this).attr("fill","orange").attr("x")) + xScale.bandwitdth() / 3;
    var yPosition = parseFloat(d3.select(this).attr("fill","orange").attr("y")) + 14;
    
    //append the text into xPosition
    svg.append("text")
    .attr("id","tooltip")
    .attr("x", xPosition)
    .attr("y", yPosition)
    .attr(d)
    .attr("fill","black");
})

// mouse out is to return the colour of rect back to its original colour
.on("mouseout", function(){
    //remove tool tip
    d3.select("#tooltip").remove();
    d3.select(this)
    .transition()
    .duration(250)
    .attr("fill","rgb(255,192,203)");

});