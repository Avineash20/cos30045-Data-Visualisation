d3.queue()
	.defer(d3.json, "ca-q-pop.json")
	.await(function(error, can) {
		if (error) throw error;
			

			// ============ CHART SETUP ================ //

			// ------------ CHART SETUP: sizing and layout -------//
			var margin = { top: 100, right: -70, bottom: 0, left: -70 };
			var height = 600 + margin.top + margin.bottom;
			var width = 960 + margin.right + margin.left;

			// ----------- CHART SETUP: map of total population by province from 2012 to 2016
			var svg = d3.select("#map").append('svg').attr('height', height).attr('width', width).attr('class', 'background');
			
			

			// path generator
			var path = d3.geoPath()
			

			// tooltip creation
			var tooltip = d3.select('body')
							.append('div')
							.attr('class', 'tooltip');
			var tooltipParams = { x: -70, y: -70};



			// ----------- CHART SETUP: color scale total population
			// -----------   create the color scales to be used for total population chart
			var colors = d3.scaleLinear()
				// -------- specify the domain, this is found by getting the smallest value 
				// --------		from the existing objects, d3.min() finds the minimum value
				// --------		however, because values are nested, need to make use of a method
				// --------		to return the proper nested value. The same process is used for d3.max
		//				.domain([d3.min(can.objects.tracts.geometries, function(e){ 
		//					return Number(e.properties.year_2012); 
		//				}), d3.max(can.objects.tracts.geometries, function(e){ 
		//					return Number(e.properties.year_2022); 
		//				}) ])
			.domain([0, 10])
			//	.range(['#4ca9ff', '#00427f'])
				.range(["#fbb4b9","#d7b5d8","#df65b0","#dd1c77", "#980043"])
				

			

			// ----------- CHART SETUP: maping years
			var yearMap = { 
				'2012' : "year_2012", 
				'2013' : "year_2013", 
				'2014' : "year_2014", 
				'2015' : "year_2015", 
				'2016' : "year_2016",
				'2017' : "year_2017", 
				'2018' : "year_2018", 
				'2019' : "year_2019", 
				'2020' : "year_2020", 
				'2021' : "year_2021",
				'2022' : "year_2022"
			}

			var activeYear = "2022";

			// ============== LEGENDS ===================//
			// -------------- LEGENDS: interpolation used to divide the legend into segments
			// --------------    gradients were chosen over this method
			// var iProv = d3.interpolate(0, (14000/10)); // 10 segments of 0 to 14,000
			// var iProvValues = [];
			// for(var i = 0; i < 10; i++) {
			// 	iProvValues[i] = iProv(i);
			// }

			var legendHeight = 10;
			var legendWidth = 250;

			// ------------ LEGENDS: Gradients in SVG are created using definitions (defs) with a unique
			//		id that can be referenced later (by the definition)
			var defs = svg.append('defs');
			var provGradient = defs.append('linearGradient') // a SVG element that works only when nested in a 'defs' element
				.attr('id', 'linear-gradient-1');
			provGradient.attr('x1', '0%').attr('x2', '100%').attr('y1', '0%').attr('y2', '0%');

			

			// ------------ LEGENDS: manual gradient creation
			// ------------     add gradient colors using the stop svg element

			// This function is tightly coupled, relised on activeYear and yearMap and the colors scale
			//	it just performs the calculations necessary to determine the color
			//	value at each point
			function legendColorPicker(identifier) {
				switch(identifier) {
					case "start":
						return colors(d3.min(can.objects.tracts.geometries, function(e) {
								return Number(e.properties[yearMap[activeYear]]);
							}));
					case "middle":
							return colors( ( (d3.min(can.objects.tracts.geometries, function(e) {
								return Number(e.properties[yearMap[activeYear]])
								})) + (d3.max(can.objects.tracts.geometries, function(e) {
								return Number(e.properties[yearMap[activeYear]])
								})) ) / 2 );
					case "end":
							return colors(d3.max(can.objects.tracts.geometries, function(e) {
								return Number(e.properties[yearMap[activeYear]]);
							}));
					}
			}

			// provGradient.append('stop')
			// 	.attr('offset', '0%') // what exact location will the exact color appear
			// 	.attr('stop-color', '#4ca9ff'); //define the color
			// provGradient.append('stop')
			// 	.attr('offset', '100%')
			// 	.attr('stop-color', '#00427f');

			// using the color scale defined earlier
			provGradient.append('stop').attr('class', 'starting-color')
				.attr('offset', '0%')
				.attr('stop-color', legendColorPicker('start'));
			provGradient.append('stop').attr('class', 'middle-color')
				.attr('offset', '50%')
				.attr('stop-color',  legendColorPicker('middle'));
			provGradient.append('stop').attr('class', 'ending-color')
				.attr('offset', '100%')
				.attr('stop-color', legendColorPicker('end') );

			// ============= SUPPORT METHODS ============
			// Pretty - method to prettify the population number
			// number - a value (decimal or otherwise) that is 1/1000 of the
			//	intended value
			// return - a new valued formatted in the region defined by the browser
			function pretty(number) {
				return (number*1000).toLocaleString(undefined);
			}

			// prettyPercent - method to round of percent values
			// number - the percent value that requires rounding
			// return - returns the value in the style of x.xx
			function prettyPercent(number) {
				return (number).toLocaleString('en-US', { maximumFractionDigits: 2});
			}

			// =============== MAP ===================//
			// --------------- MAP: total population by province from 2012 to 2016
			var provinces = svg.append('g')
				.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
				.attr('class', 'provinces')
				.selectAll('path.prename')


				// topojson doesn't have features, so use this to convert
				//	to geojson and use the features parameter from it
				.data(topojson.feature(can, can.objects.tracts).features)
				.enter()
				.append('path').attr('class', 'prename').attr('d', path)
					// fill according to the colors scale
					.attr('fill', function(d,i) { return colors(d.properties.year_2022); })
					// mouseover - apply tooltip details
					.on('mouseover', function(d) {
						tooltip.transition().duration(200).style('opacity', '1');
						//toLocaleString converts to browser's defined locale number info, 1,000 for US.
						tooltip.html(d.properties.PRENAME + '<br />' + activeYear +': ' + pretty(d.properties[yearMap[activeYear]])

							// '2012: ' + pretty(d.properties.year_2012) +
							// '<br />' + '2013: ' + pretty(d.properties.year_2013) + '<br />' +
							// '2014: ' + pretty(d.properties.year_2014) + '<br />' + 
							// '2015: ' + pretty(d.properties.year_2015) + '<br />' + 
							// '2016: ' + pretty(d.properties.year_2016)
							)
							.style('left', (d3.event.pageX + tooltipParams.x) + 'px')
							.style('top', (d3.event.pageY + tooltipParams.y) + 'px')
							.style('z-index', '1');
					})
					// mousemove - allows tooltip to follow the mouse pointer
					.on('mousemove', function(d) {
						tooltip.style('left', (d3.event.pageX + tooltipParams.x) + 'px')
							.style('top', (d3.event.pageY + tooltipParams.y) + 'px')
							.style('z-index', '1');
					})
					// mouseout - clear out the values when cursor leaves the region
					.on('mouseout', function(d) {
						tooltip.transition().duration(200).style('opacity', '0').style('z-index', '-1');
					});

			// ------------- MAP: borders ---------------
			// -------------   use topojson mesh to draw only one line where otherwise
			//					two lines would be drawn (for joining borders)
			//					however, there is no line drawn for the entire outline
			svg.append('path').attr('class', 'province-borders').attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
				.attr('d', path(topojson.mesh(
						can, can.objects.tracts, function(a,b) { return a !== b; })
					)
				);

			// ------------ MAP: total population - interactive legend
			// ------------   allow the user to select the year to update the chart
			var selectByYear = svg.append('g').attr("transform", "translate(" + (width-100) + ", " + 100 + ")").attr('class', 'select-by-year');
			// ------------   create the selection area title
			selectByYear.append('text').attr('class', 'title').attr('x', 0).attr('y', 0).attr('text-anchor', 'middle').text('Select Year:');
			// ------------   create the buttons to choose from
			// ------------       each button is constructed of a group that contains one text element and one rectangle element
			var sbyButtons = selectByYear.append('g').attr("transform", "translate(" + -20 + ", " + 30 + ")")
				.selectAll('text.year')
				.data(['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']).enter()
				.append('g')
				.attr("transform", function(d,i) { 
					return "translate(" + 0 + ", " + 30 * i + ")";
				})
				.attr('class', function(d) { 
					if (d === "2022") {
						return "year active";
					}
					else {
						return "year";
					}
				})
				// -------- functionality to select year, update the class information and tooltip details
				.on('click', function(d) {
					var activeClass = "active";
					var alreadyIsActive = d3.select(this).classed(activeClass);
					svg.selectAll('g.year').classed(activeClass, false);
					d3.select(this).classed('active', true);
					var temp = yearMap[d];
					activeYear = d;
					// update the color of the map
					d3.selectAll('path.prename')
						.attr('fill', function(d) { return colors(d.properties[temp]); });
					d3.select('text.legend-start')
						.text(pretty(d3.min(can.objects.tracts.geometries, function(e){ return Number(e.properties[yearMap[activeYear]]); }) ) );
					d3.select('text.legend-end')	
						.text(pretty(d3.max(can.objects.tracts.geometries, function(e){ return Number(e.properties[yearMap[activeYear]]); }) ) );
					d3.select('stop.starting-color')
						.attr('stop-color', legendColorPicker('start') );
					d3.select('stop.middle-color')
						.attr('stop-color', legendColorPicker('middle'));
					d3.select('stop.ending-color')
						.attr('stop-color', legendColorPicker('end'));
				});

			// add the button background
			sbyButtons.append('rect').attr('class', 'select-box').attr('x', -8).attr('y', -20).attr('width', 60).attr('height', 26);

			// add text element with year class OR year and active classes for initial construction
			sbyButtons.append('text')
				.attr('text-anchor', 'left').attr('x', 0)
				.attr('y', 0)
				//.attr('class', function(d, i) { if (d === "2016") return "active"; })
				.text(function(d){ return d;});

			// Title for the chart
			var title = svg.append('g').attr("transform", "translate(" + width/2 + ", " + 50 + ")").attr('class', 'title')
				.append('text').attr('text-anchor', 'middle').text('Population of Canada by Province from 2012 to 2016');

			// add the legend, a gradient bar with the min and max values for the population
			var legend = svg.append('g')
				.attr("transform", "translate(" + 50 + ", " + 100 + ")").attr('class', 'legend');

			legend.append('rect')
				.attr('height', legendHeight).attr('width', legendWidth)
				.style('fill', 'url(#linear-gradient-1)');
			legend.append('text').attr('class','legend-start').attr('text-anchor', 'middle').attr('x', 0).attr('y', legendHeight + 15)
				.text(pretty(d3.min(can.objects.tracts.geometries, function(e){ return Number(e.properties[yearMap[activeYear]]); }) ) );

			legend.append('text').attr('class', 'legend-end').attr('text-anchor', 'middle').attr('x', legendWidth).attr('y', legendHeight + 15)
				.text(pretty(d3.max(can.objects.tracts.geometries, function(e){ return Number(e.properties[yearMap[activeYear]]); }) ) );
	  
				d3.json("ca-q-pop.json").then(function(json) {
					for (var i = 0; i < cityData.length; i++) {
						var cityName = cityData[i].PRNAME;
						var cityTotal = parseFloat(cityData[i].Total);
						for (var j = 0; j < json.features.length; j++) {
							var jsonTerritory = json.features[j].properties.PRNNAME;
							if (cityName == jsonTerritory) {
								json.features[j].properties.value = cityTotal;
								break;
							}
						}
					}
		
					var states = svg.selectAll("path")
						.data(json.features)
						.enter()
						.append("path")
						.attr("d", path)
						.style("fill", function(d) {
							var value = d.properties.value;
							if (value) {
								return color(value);
							} else {
								return "#ccc"; // Light gray
							}
						})
					
					// Display State and Total
					svg.selectAll("text")
						.data(json.features)
						.enter()
						.append("text")
						.attr("x", function(d) {
							return path.centroid(d)[0];
						})
						.attr("y", function(d) {
							return path.centroid(d)[1];
						})
						.text(function(d) {
							return d.properties.PRNNAME
						})
						.style("text-anchor", "middle")
						.style("font-size", "8px")
						.style("fill", "black")
						.attr("class", "map-label");
		
					// Adjust the label positions to prevent overlap
					svg.selectAll(".map-label")
						.attr("transform", function(d) {
							switch (d.properties.PRNNAME) {
								case "Nunavut":
									return `translate(${30}, ${-10})`;
								case "Northwest Territories":
									return `translate(${30}, ${-10})`;
								case "Yukon Territory":
									return `translate(${-30}, ${-10})`;
								case "British Columbia":
									return `translate(${30}, ${-5})`;
								case "Alberta":
									return `translate(${30}, ${-10})`;
								case "Saskatchewan":
									return `translate(${30}, ${0})`;
								case "Manitoba":
									return `translate(${30}, ${-10})`;
								case "Ontario":
									return `translate(${30}, ${-10})`;
								case "Quebec":
									return `translate(${30}, ${-20})`;
								case "New Brunswick":
									return `translate(${30}, ${-10})`;
								case "Nova Scotia":
									return `translate(${-20}, ${-10})`;
								case "Prince Edward Island":
									return `translate(${-20}, ${-10})`;
								case "Newfoundland and Labrador":
									return `translate(${-20}, ${-10})`;
								default:
									return `translate(${0}, ${0})`;
							}
						});
				});	
	});

