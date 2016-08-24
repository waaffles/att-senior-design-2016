createMapGraph();

function createMapGraph(){
          var sites = [];
          var alerts = [];
          var tableAlerts = []

          var width = 960,
              height = 500,
              centered;

          var projection = d3.geo.albersUsa()
              .scale(900)
              .translate([width / 2, height / 2]);

          var path = d3.geo.path()
              .projection(projection);

          var zoom = d3.behavior.zoom()
              .translate(projection.translate())
              .scale(projection.scale())
              .scaleExtent([height, 8 * height])
              .on("zoom", zoomed);

          var svg = d3.select("#map-area").append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("class", "theMap");

          var tip = d3.tip()
              .attr("class", "d3-tip")
              .offset([-10, 0])
              .html(function(d) {
                  label = "<strong>" + d.site + ": </strong>"
                        +"<span style='color:lightBlue'>" + d.city + ", " + "</span>"
                        +"<span style='color:lightBlue'>" + d.state + "</span><br>";
                  for (i = 0; i < d.txps.length; i++) { 
                        label += "<span style='color:" + d.color + "'>"
                              + d.txps[i].txp_num
                              + " (" + d.txps[i].txp_id
                              + ") &nbsp&nbsp&nbsp&nbsp" + d.txps[i].dataType
                              + ": " + d.txps[i].value + "</span><br>";
                  }

                  return label;  
              })

          svg.append("rect")
              .attr("class", "background")
              .attr("width", width)
              .attr("height", height)
              .on("click", clicked);
          svg.call(tip);
          var g = svg.append("g");

// States
          d3.json("js/references/data.json", function(error, us) {
              if (error) throw error;
              g.append("g")
                  .attr("id", "states")
                  .selectAll("path")
                  .data(topojson.feature(us, us.objects.states).features)
                  .enter().append("path")
                  .attr("d", path)
                  .on("click", clicked);

              g.append("path")
                  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                  .attr("id", "state-borders")
                  .attr("d", path);
          });

// Json ALERTS
          d3.json("http://localhost:3000/alerts/all", function(error, json) {
              if (error) return console.warn(error);
              alerts = json;

              for(i = 0; i < alerts.length; i++){
                tableAlerts.push({
                  "id": alerts[i]._id,
                  "Site": alerts[i].site,
                  "Satellite": alerts[i].sat,
                  "Transponder": alerts[i].transponder,
                  "Data Type": alerts[i].data_type,
                  "Threshold": alerts[i].threshold,
                  "Value": alerts[i].current_value,
                  "Category": alerts[i].category,
                  "Time": alerts[i].created_on
                });
              }

              var table = tabulate(tableAlerts, ["Site",
                                            "Satellite",
                                            "Transponder",
                                            "Data Type",
                                            "Threshold",
                                            "Value",
                                            "Category",
                                            "Time",
                                            "Comment",
                                            "Resolve"
                                            ]);

          });

// Site Points
          d3.json("http://localhost:3000/sites", function(error, json) {
            if (error) return console.warn(error);
            sites = json;

            console.log(alerts.length)
            console.log()
            // points
            var jsonCircles = [];
            for (i = 0; i < sites.length; i++) { 
              txps = [];
              coords = projection([sites[i].longitude, sites[i].latitude]);
              statusColor = "green"
              for (j = 0; j < alerts.length; j++){
                // console.log(j)
                if(sites[i].site == alerts[j].siteName){
                  // add transponder that is in danger
                  txps.push({
                    "txp_id": alerts[j].txp_id,
                    "txp_num": alerts[j].txp_num,
                    "dataType": alerts[j].dataType,
                    "value": alerts[j].value
                  });
                  statusColor = "red"
                }
              }

              if(coords){
                jsonCircles.push({
                  "site": sites[i].site,
                  "city": sites[i].city,
                  "state": sites[i].state,
                  "longitude": coords[0],
                  "latitude": coords[1],
                  "txps": txps,
                  "radius": 4,
                  "color" : statusColor
                });
              
              }
            }

            render(jsonCircles);

          });

          function render(jsonCircles) {
            // add circles to svg
            var circles = svg.selectAll("circle")
              .data(jsonCircles)
              .enter()
              .append("circle");
            // add circle attributes
            var circleAttributes = circles
              .attr("cx", function (d) { return d.longitude; })
              .attr("cy", function (d) { return d.latitude; })
              .attr("r", function (d) { return d.radius; })
              .attr("title", function (d) {return d.site})
              .style("fill", function(d) { return d.color; })
              .on("mouseover", function(d){
                   tip.show(d)
              })
              .on("mouseout", function(d){
                   tip.hide()
              })
          }

          function clicked(d) {
            var x, y, k;

            if (d && centered !== d) {
              var centroid = path.centroid(d);
              x = centroid[0];
              y = centroid[1];
              k = 2;
              centered = d;
            } else {
              x = width / 2;
              y = height / 2;
              k = 1;
              centered = null;
            }

            g.selectAll("path")
                .classed("active", centered && function(d) { return d === centered; });

            g.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px");

            d3.selectAll("circle")
              .transition()
              .duration(750)
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          }

          function zoomed() {
            projection.translate(d3.event.translate).scale(d3.event.scale);
            // projection
            //   .scale(zoom.scale() / 2 / Math.PI)
            //   .translate(zoom.translate());
            g.selectAll("path").attr("d", path);
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
          }
}


function tabulate(data, columns) {
    var table = d3.select("#table-area").append("table")
            .attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                if (column == "Resolve") {
                  return {column: column, value: '<button onClick="resolve(\'' + row["id"] + '\')" />Resolve</button>'}
                } else {
                  return {column: column, value: row[column]}
                };
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
            .html(function(d) { return d.value; });
    
    return table;
}

// resolves the current alert by id, removes alert from table underneath map graph
function resolve(id) {
  // d3.json("http://localhost:3000/alerts/all", function(error, json) {
  //     // loop through the alerts until the alert with given id is found
  //     for(i = 0; i < json.length; i++){
  //         if (json[i]._id == id) {
  //             json[i].resolved = true;
  //             $.getJSON("http://localhost:3000/alerts/all", function(results) {

  //             }
  //         }

  //     }
    
    
  // });
    // $.get( "http://localhost:3000/alerts/all", function( data ) {
    //     alert( "Data Loaded: " + data );
    // });
    
}


