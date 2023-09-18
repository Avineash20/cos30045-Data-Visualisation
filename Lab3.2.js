function init(){

  var w = 1000;
  var h = 450;
  var padding = 70;

  // d3 block
  var svg = d3.select("#plot")
              .append("svg")
              .attr("width", w)
              .attr("height", h)

    // addding the background color
      svg.append("rect")
          .attr("width", w)
          .attr("height", h)
          .attr("fill", "lightgray");

  var dataset = [
                  [5,20],
                  [85,21],
                  [410,12],
                  [100,33],
                  [250,50],
                  [475,44],
                  [25,67],
                  [220,88],
                  [330,95],
                  [500,90],
                  [900,200] //outliers
                  ];

  var xScale = d3.scaleLinear()
                 .domain([d3.min(dataset,function(d){ // calculating the min value
                  return d[0];
                 }),
                 d3.max(dataset, function(d){ // calculating the max value
                  return d[0]
                 })]) // the data input range
                 .range([padding,w-padding]) //the range available for the visualisation on screen.

  var yScale = d3.scaleLinear()
                 .domain([d3.min(dataset, function(d){
                  return d[1];
                 }),
              d3.max(dataset, function(d){
                  return d[1];
              })])
              .range([h-padding,padding])

  // use max() and return the maximum of x coordinate in the dataset then store the max_X variable
  var max_X = d3.max(dataset,(d)=>{
      return d[0];
  })

  var min_X = d3.min(dataset,(d)=>{
    return d[0];
  })

  svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     //The cx and cy attributes define the x and y coordinates of the center of the circle. If cx and cy are omitted, the circle's center is set to (0,0)
     .attr("cx",function(d, i){
          //return d[0];
          return xScale(d[0]);
     })
     .attr("cy",function(d, i){
          return yScale(d[1]);
     })
     .attr("r", 5)

     .style("fill",function(d){
          //if the d[0] is same as the max_X then return the red color plot
          if(d[0]==max_X){
              return "red"
          } 
          if(d[0]==min_X){
            return "yellow"
        } 
     })

     .attr("fill","rgb(0,0,0)");

     svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        //return the value of x coordinate and y coordinate
        .text(function(d){
          return d[0] + "," + d[1];
        })
        //position of the x coordinate and y coordinate
        .attr("x", function(d){
          return xScale(d[0]+8);
        })
        .attr("y", function(d){
          return yScale(d[1]-2)
        });

        // adding axis 
        var xAxis = d3.axisBottom() //create x axis
                      .ticks(15)
                      .scale(xScale);  //scale is according to the x scale

        var yAxis = d3.axisLeft()
                      .ticks(4)
                      .scale(yScale);
    
        svg.append("g") //place axis svg at bottom to not interfere with other svgs
           .attr("transform", "translate(0, "+ (h - padding) +")")  //position x axis at bottom of chart (0, 290)
           .call(xAxis);                                            //h=350 padding=60, h - padding = 290

        svg.append("g") //place axis svg at bottom to not interfere with other svgs
        .attr("transform", "translate("+ (padding) + "," + (0) +")")  //position y axis at left of chart (60,0)
        .call(yAxis);                                                 //padding=60
}
window.onload = init;