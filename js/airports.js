    function draw(geo_data) {
      "use strict";
      var margin = 100,
          width = 950 - margin,
          height = 600 - margin;

      // Append Div for tooltip to SVG
      var div = d3.select("body")
        	.append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      var svg = d3.select("#airportChart")
          .append("svg")
          .attr("width", width + margin)
          .attr("height", height + margin)
          .append('g')
          .attr('class', 'map');

      var projection = d3.geo.albersUsa()
                             .translate([width/2,height/2])
                             .scale([1000]);

      var path = d3.geo.path().projection(projection)

      var map = svg.selectAll('path')
                   .data(geo_data.features)
                   .enter()
                   .append('path')
                   .attr('d', path)
                   .style('fill', 'slategray')
                   .style('stroke', 'black')
                   .style('stroke-width', 0.5);

      // Pop up dialog to alert user if selecting airports before 2003
      // delay type catgories not available before 2003
      function popup(d){
          console.log(d);
          if(d.Year < 2003){
            alert("No Delay Type Data for Years Before 2003.")
          }
          else{
            chart_delays(d);
          }
      }

      // add a bar chart to show delay category counts
      function chart_delays(data){
        var margin = {top:20,right:20,bottom:30,left:60},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
                  .rangeBands([0,width]);
        var y = d3.scale.linear()
                  .range([height,0]);

        var svg = d3.select("#airportBar").select("svg");

        if(!svg.empty()){
          svg.remove();
        }

        var svg = d3.select("#airportBar").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

        var vals = [+data.CarrierDelay || 0,+data.WeatherDelay || 0,
                     +data.NASDelay || 0,+data.SecurityDelay || 0,
                     +data.LateAircraft || 0];

        var cats = ['Carrier','Weather','NAS','Security','Late Aircraft'];

        // remove the existing h1 element so that we do not append to it
        d3.select("#airportBarTitle").select("h1").remove();

        //add h1 element with link to FAA delay type info
        d3.select("#airportBarTitle").append("h1")
          .append("a")
          .attr("href","http://aspmhelp.faa.gov/index.php/Types_of_Delay")
          .attr("target","_blank")
          .html(data.Airport + " " + data.Year + " Delays by Category");

        x.domain(cats);
        y.domain([0,d3.max(vals)]);

        svg.selectAll("bar")
           .data(vals)
           .enter()
           .append("rect")
           .attr("class","bar")
           .attr("x",function(d,i){ return x(cats[i]);})
           .attr("width",width / vals.length - 1)
           .attr("y", function(d) { return y(d);})
           .attr("height",function(d) { return height - y(d);})
           .attr("fill","darkblue");

        svg.append("g")
           .attr("fill","white")
           .attr("opacity",1)
           .attr("transform", "translate(0," + height + ")")
           .call(d3.svg.axis().scale(x).orient("bottom"));
           //.call(d3.axisBottom(x));  //THIS IS for d3.v4

        svg.append("g")
           .attr("fill","white")
           .attr("opacity",1)
           .call(d3.svg.axis().scale(y).orient("left"));
           //.call(d3.axisLeft(y));  //THIS IS for d3.v4
      }

      function plot_points(data) {

           function agg_years(leaves) {
             return leaves.map(function(d){
               return {
                         "Origin"        : d["Origin"],
                         "Total_Flts"    : d["Total_Flts"],
                         "Delayed_Flts"  : d["Delayed_Flts"],
                         "PercentDelayed": d["PercentDelayed"],
                         "CarrierDelay"  : d["CarrierDelay"],
                         "WeatherDelay"  : d["WeatherDelay"],
                         "NASDelay"      : d["NASDelay"],
                         "SecurityDelay" : d["SecurityDelay"],
                         "LateAircraft"  : d["LateAircraftDelay"],
                         "Airport"       : d["airport"],
                         "City"          : d["city"],
                         "State"         : d["state"],
                         "Lat"           : d["lat"],
                         "Long"          : d["long"],
                         "x"             : d["x"],
                         "y"             : d["y"],
                         "Year"          : d["Year"]
                       };
             });
           }

          var nested = d3.nest()
                         .key(function(d) {
                           return d["Year"];
                         })
                         .rollup(agg_years)
                         .entries(data)
                         console.log(nested);

          var maxFlight = d3.max(nested,function(d){
            return d3.max(d['values'], function(d){
              return d['Total_Flts'];
            })
          });
          // Only one printout for maxFlight?  I thought this would take
          // the maxFlight for each year, but it appears to be over all years
          //console.log("MAXFLIGHT:" +maxFlight);

          var maxDelay = d3.max(nested,function(d){
            return d3.max(d['values'],function(d){
              return d['PercentDelayed'];
            })
          });

          var minDelay = d3.min(nested,function(d){
            return d3.min(d['values'],function(d){
              return d['PercentDelayed'];
            })
          });

          var radius = d3.scale.sqrt()
                         .domain([0,maxDelay])
                         .range([0,12]);

          var colorFill = d3.scale.linear()
          					.domain([minDelay,maxDelay])
          					.range(["lawngreen", "red"]);

          var opacityFill = d3.scale.linear()
                                 .domain([0,maxDelay])
                                 .range([0,1]);

          svg.append('g')
             .attr("class","bubble")
             .selectAll("circle")
             .data(nested, function(d) {
               return d["key"]
             })
             .enter()
             .append("circle")
             .attr("cx",function(d) {
               return d["values"][0]["x"];
             })
             .attr("cy",function(d) {
               return d["values"][0]["y"];
             })
             .attr("r",function(d){
               //console.log(d["values"][0]["Total_Flts"]);
               return radius(d["values"][0]["PercentDelayed"]);
             })
             .attr("fill",function(d){
               return colorFill(d["values"][0]["PercentDelayed"]);
             })
             .attr("opacity",function(d){
               return opacityFill(d["values"][0]["Total_Flts"]);
             })

          // add a colorbar so that we have a scale for the circle colors
          var colorbar = Colorbar()
               .origin([850,20])
               .thickness(100)
               .scale(colorFill)
               .barlength(500).thickness(20)
               .orient("vertical")
               .title("Percent Delayed");

          var bar = d3.selectAll("svg").append("g").attr("id","colorbar");
          // pointer in scale
          var pointer = d3.selectAll("#colorbar").call(colorbar);

          var years = d3.range(1987,2017);

          function update(year) {
            var selected_year = nested.filter(function(d){
              return +d["key"] === year;
            });
            d3.select("#airportTitle")
              .text("Delayed Flights by Airport: "+year);

            var circles = svg.select("g.bubble").selectAll("circle")
                             .data(selected_year[0]["values"], function(d){return d["Year"]+d["Airport"]});
            circles.exit().remove();
            // add the circles, along with tooltips and pointer in colorbar
            circles.enter()
                   .append("circle")
                   .attr("cx",function(d) { return d["x"];})
                   .attr("cy",function(d) { return d["y"];})
                   .attr("r",function(d){
                     return radius(d["PercentDelayed"]);
                   })
                   .on("click",popup)
                   .attr("fill",function(d){
                     return colorFill(d["PercentDelayed"]);
                   })
                   .attr("opacity",function(d){
                     return opacityFill(d["Total_Flts"]);
                   })
                   // tooltip on mouse hover
                   .on("mouseover", function(d) {
                    div.transition()
                         .duration(200)
                          .style("opacity", .9);
                          div.text(d.Airport+'\n'+d.PercentDelayed+'% Delayed')
                          //div.text(d.PercentDelayed)
                          .style("left", (d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY - 28) + "px");
                    pointer.pointTo(d.PercentDelayed);
                  })

                   // fade out tooltip on mouse out
                   .on("mouseout", function(d) {
                       div.transition()
                          .duration(500)
                          .style("opacity", 0);
                  })


          }
          var year_index = 0;

          // Start the animation across all years
          var year_interval = setInterval(function(){
            update(years[year_index]);

            year_index++;

            if(year_index >= years.length){
              clearInterval(year_interval);
              // add h1 to let user know they can select a circle
              d3.select("#airportBarTitle")
                .append("h1")
                .text("Click a circle!");
              // after animation, provide buttons for user to select year
              var buttons = d3.select("#buttonColumn")
                              .style("overflow-y","scroll")
                              .append("div")
                              .attr("class", "years_buttons")
                              .selectAll("div")
                              .data(years)
                              .enter()
                              .append("div")
                              .text(function(d){ return d;});

              buttons.on("click",function(d){
                  d3.select(".years_buttons")
                    .selectAll("div")
                    .transition()
                    .duration(400)
                    .style("background-color", "black")
                    .style("color", "white");

                  d3.select(this)
                    .transition()
                    .duration(400)
                    .style("background", "lightBlue")
                    .style("color", "white");

                  update(d);
              })
            }
          },1200) //1200
      };

      // D3 to load in the csv file
      d3.csv("data/aggregatedAirportData.csv", function(d){
        d['x']=projection([d.long,d.lat])[0];
        d['y']=projection([d.long,d.lat])[1];
        d['Year'] = +d['Year'];
        d['Total_Flts'] = +d['Total_Flts'];
        d['Delayed_Flts'] = +d['Delayed_Flts'];
        //debugger;
        d['PercentDelayed'] = d3.format(".2f")(+d['PercentDelayed'])*100;
        return d;
      },plot_points)

    };
  /*
  Use D3 to load the GeoJSON file
  */

d3.json("data/us-states.json", draw);
