function init(){
    var w = 500; //width of the svg
    var h = 300; //height of the svg
    var projection = d3.geoMercator()
                        .center([145,-36.5]) //center to this coordinate
                        .translate([w/2,h/2])
                        .scale(2450);

    var path = d3.geoPath() //make a map
                .projection(projection);

    var svg = d3.select("#chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
                .attr("fill","black");

    var colour = d3.scaleQuantize() //colour scheme
    // .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);
     .range(["#fbb4b9","#f768a1","#c51b8a","#7a0177"])

    
    d3.csv("VIC_LGA_unemployment.csv").then(function(data){   //read data from csv file
        colour.domain([d3.min(data, function(d){return d.unemployed}),d3.max(data, function(d){return d.unemployed})])
       

        d3.json("LGA_VIC.json").then(function(json){ //read map data from json file to combine it with csv file
           
        for(var i =0; i <data.length; i++)
        {
            var dataLoc = data[i].LGA;
            var dataValue = data[i].unemployed;
            for(var j =0; j < json.features.length; j++)
            {
                var jsonLoc = json.features[j].properties.LGA_name;
                if(dataLoc == jsonLoc) // if location matches the json
                {
                    console.log(dataLoc)
                    json.features[j].properties.value = dataValue; //append value into json based on the location
                    break;
                }
            }
        }

        svg.selectAll("path") // draw the map
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d){
                //get data value
                var value = d.properties.value;
                if(value) // if the data is not null then colour it
                {
                    return colour(value);
                }
                else{
                    return "#000";
                }
            })
            //Load in cities data
            d3.csv("VIC_city.csv").then(function(data){ //draw the yellow dots based on the this file
                //this file contains the coordinates
                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d){
                        return projection([d.lon,d.lat])[0];
                    })
                    .attr("cy", function(d){
                        return projection([d.lon, d.lat])[1] ;
                    })
                    .attr("r",5)
                    .style("fill", "yellow")
                    .style("stroke", "gray") 
                    .style("stroke-width", 0.25) 
                    .style("opacity", 0.75) 
                    .append("title") //Simple tooltip 
                    .text( function (d) {
                        return d.place ; 
                    });
                    // Cities name on top
                    var text = svg.selectAll("text")
                        .data(data);

                    text.enter() //update the text
                        .append("text")
                        .attr("x",function(d){
                            return projection([d.lon,d.lat])[0];
                        })
                        .attr("y",function(d){
                            return projection([d.lon, d.lat])[1] ;
                        })
                        .text(function(d){
                            return d.place;
                        });
        })  
    })
})
}
window.onload = init;