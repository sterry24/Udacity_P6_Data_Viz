    function draw(geo_data) {
      "use strict";
      // var margin = 100,
      //     width = 950 - margin,
      //     height = 600 - margin;
      var margin = {top: 10, left: 10, bottom: 10, right: 10}
        , width = parseInt(d3.select('#airportChart').style('width'))
        , width = width - margin.left - margin.right
        , mapRatio = .5
        , height = width * mapRatio;

      // Append Div for tooltip to SVG
      var div = d3.select("body")
        	.append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      var svg = d3.select("#airportChart")
          .append("div")
          .attr("class","svg-container")
          .append("svg")
          //.attr("width", width)
          //.attr("height", height)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .attr("viewBox", "0 0 "+width + " " + height)
          .classed("svg-content-responsive",true)
          .append('g')
          .attr('class', 'map');

      var projection = d3.geo.albersUsa()
                             .translate([width/2,height/2])
                             //.scale([1000]);
                             .scale(width);

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
          if(d.Year < 2003){
            chart_delays(d);
            alert("No delay type data for any airport for years before 2003.");
          }
          else{
            chart_delays(d);
          }
      }

      // add a bar chart to show delay category counts
      function chart_delays(data){
        var margin = {top:20,right:20,bottom:30,left:60}
        , width = parseInt(d3.select('#airportBar').style('width'))
        , mapRatio = 1
        , height = width * mapRatio;

        var x = d3.scale.ordinal()
                  .rangeBands([0,width]);
        var y = d3.scale.linear()
                  .range([height,0]);

        var svg = d3.select("#airportBar").select(".svg-container-bar");

        if(!svg.empty()){
          svg.remove();
        }

        var svg = d3.select("#airportBar")
                    .append("div")
                    .attr("class","svg-container-bar")
                    .append("svg")
                    //.attr("width", width)
                    //.attr("height", height)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", "-60 -25 "+(width+margin.left+margin.right) + " " + (height+margin.bottom+margin.top));
                    //.classed("svg-content-responsive",true)
                    //.append("g")
                    //.attr("transform",
                    //    "translate(" + margin.left + "," + margin.top + ")");
                    //NOTE: Cannot use use transform with responsive SVG's

        var vals = [+data.CarrierDelay || 0,+data.WeatherDelay || 0,
                     +data.NASDelay || 0,+data.SecurityDelay || 0,
                     +data.LateAircraft || 0];

        var cats = ['Carrier','Weather','NAS','Security','Late AC'];

        // remove the existing h1 element so that we do not append to it
        d3.select("#airportBarTitle").select("h1").remove();

        //add h1 element for bar chart title
        d3.select("#airportBarTitle").append("h1")
          .text(data.Airport + " " + data.Year + " Delays");

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

        // add info for users
        var info = d3.select("#airportBar").select("p");

        if(!info.empty()){
          info.remove();
        }

        // display a link to the delay type definitions
        d3.select("#airportBar").append("p")
          .html("")
          .append("a")
          .attr("href","http://aspmhelp.faa.gov/index.php/Types_of_Delay")
          .attr("target","_blank")
          //.html(data.Airport + " " + data.Year + " Delays by Category");
          .html("Delay Categories Defined")
          .style("font-size","20px");

        chartYears(data.Airport);
      }

      function chartYears(origin){
         //Chart all years for the selected airport.  Show the
         //number of total flights and number of delayed flights.
         var margin = {top:20,right:20,bottom:30,left:60}
         , width = parseInt(d3.select('#airportLine').style('width'))
         , height = width / 4;
         // format years to last two digits so we do not overcrowd the axis on small screens
         var format = d3.format("02d");
         d3.csv("data/aggregatedAirportData.csv", function(d){
           d['Year'] = d['Year'].slice(2);
           d['Year'] = d['Year'];
           d['Total_Flts'] = +d['Total_Flts'];
           d['Delayed_Flts'] = +d['Delayed_Flts'];
           return d;
         },function(error, data){
             if (error) throw error;
             data = data.filter(function(row){
               return row.airport == origin;
             });
             var years =[],tFlights=[],dFlights=[];
             data.forEach(function(d){
               years.push(format(d.Year));
               tFlights.push(d.Total_Flts);
               dFlights.push(d.Delayed_Flts);
             })
             var x = d3.scale.ordinal()
                       .rangeBands([0,width]);
             var y = d3.scale.linear()
                       .range([height,0]);

             var svg = d3.select("#airportLine").select(".svg-container-bar");

             if(!svg.empty()){
               svg.remove();
             }

             // remove the existing h1 element so that we do not append to it
             d3.select("#airportLineTitle").select("h1").remove();

             //add h1 element with line chart title
             d3.select("#airportLineTitle").append("h1")
               .text(origin + " Flights (all years)");
             var svg = d3.select("#airportLine")
                         .append("div")
                         .attr("class","svg-container-bar")
                         .append("svg")
                         //.attr("width", width)
                         //.attr("height", height)
                         .attr("preserveAspectRatio", "xMidYMid meet")
                         .attr("viewBox", "-60 -25 "+(width+margin.left+margin.right) + " " + (height+margin.bottom+margin.top));

           x.domain(years);
           y.domain([0,d3.max(tFlights)]);
           // line for total flights
           var tLine = d3.svg.line()
                             .x(function(d,i){return x(years[i]);})
                             .y(function(d,i){return y(tFlights[i]);});
           // line for delayed flights
           var dLine = d3.svg.line()
                             .x(function(d,i){return x(years[i]);})
                             .y(function(d,i){return y(dFlights[i]);});
            // add the total flights line to the svg
            svg.append("path")
               .attr("class","line")
               .attr("d", tLine(tFlights))
               .attr("data-legend",function(d) { return "Total Flights"})
               .attr("data-legend-color","green")
               .style("stroke","green")
               .style("stroke-width",2);
            // add the delayed flights line to the svg
            svg.append("path")
               .attr("class","line")
               .attr("d", dLine(dFlights))
               .attr("data-legend",function(d) { return "Delayed Flights"})
               .attr("data-legend-color","red")
               .style("stroke","red")
               .style("stroke-width",2);
            // add the axes
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
           // add a legend to the line chart
           var legend = svg.append("g")
                       .attr("class","legend")
                       .attr("transform","translate(50,30)")
                       .style("font-size","20px")
                       .attr("data-style-padding",10)
                       .call(d3.legend);

          })
      }


      // modeled from the udacity world-cup example.  Takes in data from
      // a csv file and draws the data on a map.
      function plot_points(data) {

           // agg_years aggregates all airports and their data into one year
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

          // structure (nest) the data so that we can perform
          // a "groupby" on the data with the key "year"
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

          // return the maximum delay
          var maxDelay = d3.max(nested,function(d){
            return d3.max(d['values'],function(d){
              return d['PercentDelayed'];
            })
          });

          // return the minimum delay
          var minDelay = d3.min(nested,function(d){
            return d3.min(d['values'],function(d){
              return d['PercentDelayed'];
            })
          });

          // determine the radius of a circle by the max delay
          var radius = d3.scale.sqrt()
                         .domain([0,maxFlight])
                         .range([0,12]);

          // create a scale for colors
          var colorFill = d3.scale.linear()
          					.domain([minDelay,maxDelay])
          					.range(["lawngreen", "red"]);

          // create opacity levels
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
               return radius(d["values"][0]["Total_Flts"]);
             })
             .attr("fill",function(d){
               return colorFill(d["values"][0]["PercentDelayed"]);
             })
             .attr("opacity",function(d){
               return opacityFill(d["values"][0]["Total_Flts"]);
             })

          // add a colorbar so that we have a scale for the circle colors
          var colorbar = Colorbar()
               .origin([width-35,20])
               .thickness(100)
               .scale(colorFill)
               .barlength(height).thickness(20)
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
                     return radius(d["Total_Flts"]);
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
                          div.html(d.Airport+'</br>'+d.PercentDelayed+'% Delayed'+'</br>'+d.Total_Flts+' Total Flights')
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
              //add h4 to let user know they can select a year
              d3.select("#selectHolder")
                .append("h4")
                .style("color","white")
                .text("Select a year");

              // after animation, provide drop down for user to select year
              var select = d3.select("#selectHolder")
                             .append("select")
              var options = select.selectAll("option")
                                  .data(years)
                                  .enter()
                                  .append("option")
                                  .text(function(d){ return d;});

              select.on("change", function(d){
                var selectedIndex = select.property("selectedIndex");
                var data = options[0][selectedIndex].text;
                //console.log(data);
                update(+data);
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

      // d3.select(window).on('resize', resize);
      //
      // function resize(){
      //     // adjust things when the window size changes
      //     width = parseInt(d3.select('#airportChart').style('width'));
      //     width = width - margin.left - margin.right;
      //     height = width * mapRatio;
      //
      //     // update projection
      //     projection
      //     .translate([width / 2, height / 2])
      //     .scale(width);
      //
      //     // resize the map container
      //     svg
      //     .style('width', width + 'px')
      //     .style('height', height + 'px');
      //
      //     // resize the map
      //     svg.select('.land').attr('d', path);
      //     svg.selectAll('.state').attr('d', path);
      // }

    };
  /*
  Use D3 to load the GeoJSON file
  */

d3.json("data/us-states.json", draw);
