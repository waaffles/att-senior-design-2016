// --GLOBAL VARIABLES--
// Creates constant names for reusable components from the library -> FixedDataTable
const {Table, Column, Cell} = FixedDataTable;
// Gets the brower's window width, minus 240 for the left nav bar
var windowWidth = $(window).width() - 240;
// Creates a fixed height length for the map
var mapHeight = windowWidth / 2.5;
// Creates a fixed height length for the alert table underneath the map
var tableHeight = $(window).height() - mapHeight;

var Map = React.createClass({
  	render: function() {
    		return (
    			<div id='map-area'></div>
    		);
  	}
});


var buttonStyle = {
  padding: 7,
};

// ------------------------------ RESOLVE BUTTON -----------------------------------
// Component thats used by the AlertTable, connected to the end of every row in the alert table
var ResolveButton = React.createClass({
    // "props" are passed into the ResolveButton component through the AlertTable Component
    getInitialState: function() {
        return {resolved: this.props.data[this.props.rowIndex]["resolved"],
                comment: this.props.data[this.props.rowIndex]["comment"],
                saved: "Save"
        };
    },
    // this function updates the current comment of the alert
    handleCommentChange: function(e) {
        // updates the comment state of this component
        this.setState({comment: e.target.value});
    },
    /** updates the alert on the back end
       changes a unresolved alert into a resolved alert
       cahnges a resolved alert into a unresolved alert*/
    resolve: function(event) {

        var index = this.props.rowIndex;
        var that = this; //proxy
        var data = {
            alertUpdates: {
                "_id": this.props.data[index]["_id"],
                "comment": that.state.comment,
                "resolved": !that.state.resolved

            }
        }

        $.ajax({
            url: window.location.origin + "/alerts/update",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                onComplete(data);
            }
        });

        function onComplete(data){//code executes once ajax request is successful
            that.setState({resolved: !that.state.resolved});
        }
    },
        save: function(event) {

        var index = this.props.rowIndex;
        var that = this; //proxy
        var data = {
            alertUpdates: {
                "_id": this.props.data[index]["_id"],
                "comment": that.state.comment,
                "resolved": that.state.resolved
            }
        }

        $.ajax({
            url: window.location.origin + "/alerts/update",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                onComplete(data);
            }
        });

        function onComplete(data){//code executes once ajax request is successful
            that.setState({saved: "Saved"});
        }
    },

    render: function() {
        var text = this.state.resolved ? 'Resolved' : 'Not Resolved';
        const {rowIndex, field, data, ...props} = this.props;
        // Comment Box & Resolve Button
        return (
            <div>
                <input
                    className="resolve-comment"
                    type="text"
                    // placeholder={this.props.data[this.props.rowIndex]["comment"]}
                    placeholder={this.state.comment}
                    //value={this.props.data[this.props.rowIndex]["comment"]}
                    onChange={this.handleCommentChange}
                    size="10"
                />
                <p className="resolve-button" onClick={this.resolve} style={buttonStyle}>

                    {text}.
                </p>
                 <p className="resolve-button" onClick={this.save} style={buttonStyle}>

                    {this.state.saved}
                </p>

            </div>

        );
    }
});

// Constant names for reusable components used in the AlertTable Component
const DateCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col].toLocaleString()}
  </Cell>
);

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

const NullCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data}
  </Cell>
);

// ------------------------------ ALERT TABLE -----------------------------------
// Component that creates a table of all alerts
var AlertTable = React.createClass({


    getInitialState: function() {
        return {
          dataList: [],
          columnWidths: {
            site: windowWidth * 0.06,
            sat: windowWidth * 0.06,
            txp: windowWidth * 0.07,
            type: windowWidth * 0.06,
            threshold: windowWidth * 0.08,
            value: windowWidth * 0.06,
            category: windowWidth * 0.08,
            time: windowWidth * 0.20,
            resolve: windowWidth * 0.33
          }
        };
    },

    componentWillMount: function() {
      this.getAllAlerts();
      window.addEventListener('resize', this.handleResize);
    },

    getAllAlerts: function() {
        var tableAlerts = this.state.dataList;
        var that = this; //proxy

        $.ajax({
            type: "GET",
            dataType: "json",
            url: window.location.origin + "/alerts/unresolved",
            success: function(data) {
                // if (data.length == 0) {
                //     alert("No alerts were found");
                // }
                setDataListOnComplete(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status);
            }
        });

        function setDataListOnComplete(data){//code executes once ajax request is successful
            that.setState({ dataList: data});
        }
    },

     _onColumnResizeEndCallback: function(newColumnWidth, columnKey) {
      console.log('resized');


      this.state.columnWidths[columnKey] = newColumnWidth;
       // [columnKey]: newColumnWidth,


  },
   handleResize: function(e) {
    console.log('event resize');
    windowWidth = $(window).width() - 240;
    this.setState({columnWidths:  {
            site: windowWidth * 0.06,
            sat: windowWidth * 0.06,
            txp: windowWidth * 0.07,
            type: windowWidth * 0.06,
            threshold: windowWidth * 0.08,
            value: windowWidth * 0.06,
            category: windowWidth * 0.08,
            time: windowWidth * 0.20,
            resolve: windowWidth * 0.33
          }});
    this.forceUpdate();
  },

    render: function() {
        var {dataList} = this.state;
        // if (dataList == 0) {
        //     alert("No alerts were found");
        // }
        console.log(dataList.length + " alert(s) were found");
        if (dataList.length == 0) {
            return (
                <div>
                    <Table
                        rowHeight={50}
                        headerHeight={50}
                        rowsCount={1}
                        width={windowWidth}
                        height={100}
                        {...this.props}>

                        <Column
                          columnKey="site"
                          header={<Cell>Site</Cell>}
                          cell={<NullCell/>}
                          fixed={true}
                          width={this.state.columnWidths.site}
                        />
                        <Column
                          columnKey="sat"
                          header={<Cell>Sat.</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={this.state.columnWidths.sat}
                        />
                        <Column
                          columnKey="txp"
                          header={<Cell>Txp.</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={this.state.columnWidths.txp}
                        />
                        <Column
                          columnKey="type"
                          header={<Cell>Type</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={this.state.columnWidths.type}
                        />
                        <Column
                          columnKey="threshold"
                          header={<Cell>Threshold</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={this.state.columnWidths.threshold}
                        />
                        <Column
                          columnKey="value"
                          header={<Cell>Value</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={this.state.columnWidths.value}
                        />
                        <Column
                          columnKey="category"
                          header={<Cell>Category</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={this.state.columnWidths.category}
                        />
                        <Column
                          columnKey="time"
                          header={<Cell>Time</Cell>}
                          cell={<NullCell/>}
                          width={this.state.columnWidths.time}
                        />

                        <Column
                          columnKey="resolve"
                          header={<Cell>Resolve</Cell>}
                          cell={<NullCell data={"No alerts found"} />}
                          fixed={false}
                          width={this.state.columnWidths.resolve}
                        />
                    </Table>
                </div>
            );
        } else {
            return(
                <div>
                    <Table
                        rowHeight={50}
                        headerHeight={50}
                        rowsCount={dataList.length}
                        width={windowWidth}
                        height={tableHeight}
                        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
                        isColumnResizing={false}
                        {...this.props}>

                        <Column
                          columnKey="site"
                          header={<Cell>Site</Cell>}
                          cell={<TextCell data={dataList} col="site"/>}
                          fixed={true}
                          width={windowWidth * 0.06}
                          isResizeable={true}
                          width={this.state.columnWidths.site}
                        />
                        <Column
                          columnKey="sat"
                          header={<Cell>Sat.</Cell>}
                          cell={<TextCell data={dataList} col="sat"/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                          isResizeable={true}
                          width={this.state.columnWidths.sat}
                        />
                        <Column
                          columnKey="txp"
                          header={<Cell>Txp.</Cell>}
                          cell={<TextCell data={dataList} col="transponder"/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                          isResizeable={true}
                          width={this.state.columnWidths.txp}
                        />
                        <Column
                          columnKey="type"
                          header={<Cell>Type</Cell>}
                          cell={<TextCell data={dataList} col="data_type"/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                          isResizeable={true}
                          width={this.state.columnWidths.type}
                        />
                        <Column
                          columnKey="threshold"
                          header={<Cell>Threshold</Cell>}
                          cell={<TextCell data={dataList} col="threshold"/>}
                          fixed={false}
                          width={windowWidth * 0.09}
                          isResizeable={true}
                          width={this.state.columnWidths.threshold}
                        />
                        <Column
                          columnKey="value"
                          header={<Cell>Value</Cell>}
                          cell={<TextCell data={dataList} col="current_value"/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                          isResizeable={true}
                          width={this.state.columnWidths.value}
                        />
                        <Column
                          columnKey="category"
                          header={<Cell>Category</Cell>}
                          cell={<TextCell data={dataList} col="category"/>}
                          fixed={false}
                          width={windowWidth * 0.08}
                          isResizeable={true}
                          width={this.state.columnWidths.category}
                        />
                        <Column
                          header={<Cell>Time</Cell>}
                          cell={<DateCell data={dataList} col="created_on" />}
                          width={windowWidth * 0.19}
                          isResizeable={true}
                          width={this.state.columnWidths.time}
                        />

                        <Column
                          columnKey="resolve"
                          header={<Cell>Resolve</Cell>}
                          cell={<ResolveButton data={dataList} />}
                          fixed={false}
                          width={windowWidth * 0.34}
                          isResizeable={true}
                          width={this.state.columnWidths.resolve}
                        />
                    </Table>
                </div>
            );
        }
    }
});

// ------------------------------ MAP -----------------------------------
// Plots color coded dots on USA map to geographically represent what sites have
// any warnings or danger alerts (yellow = warning, red = danger)
var MapWrapper = React.createClass({
    // all the javascript from the D3 library used to create the USA MAP and color coded sites
    componentDidMount: function(){

    		var sites = [];
        var alerts = [];
        var tableAlerts = [];
        // subtract 240 for the width of the left nav bar
        var width = windowWidth,
            height = mapHeight,
            centered;

        var projection = d3.geo.albersUsa()
            .scale(900)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        // d3 zoom function
        var zoom = d3.behavior.zoom()
            .translate(projection.translate())
            .scale(projection.scale())
            .scaleExtent([height, 8 * height])
            .on("zoom", zoomed);

        // svg is appended to the div with the id "map-area" found in the component's render function
        var svg = d3.select("#map-area").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "theMap");

        // Hover Tip when moused over site on map
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
                var label = "<strong>" + d.site + ": </strong>"
                      +"<span style='color:lightBlue'>" + d.city + ", " + "</span>"
                      +"<span style='color:lightBlue'>" + d.state + "</span><br>";
                for (var i = 0; i < d.txps.length; i++) {
                    label += "<span style='color:" + d.color + "'>"
                          + d.txps[i].sat
                          + " (" + d.txps[i].txp
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

        // UNRESOLVED ALERTS
        d3.json(window.location.origin + "/alerts/unresolved", function(error, json) {
            if (error) return console.warn(error);
            alerts = json;
        });

        // Site Points
        d3.json(window.location.origin + "/sites", function(error, json) {
            if (error) return console.warn(error);
            sites = json;

            // points
            var jsonCircles = [];
            for (var i = 0; i < sites.length; i++) {
                var txps = [];
                var coords = projection([sites[i].longitude, sites[i].latitude]);
                var statusColor = "green"
                // {alerts.length}
                for (var j = 0; j < alerts.length; j++){
                    if(sites[i].site == alerts[j]['site']){

                      // add transponder that is in danger
                      txps.push({
                          "txp": alerts[j]['transponder'],
                          "sat": alerts[j]['sat'],
                          "dataType": alerts[j]['data_type'],
                          "value": alerts[j]['current_value']
                      });
                      if(alerts[j]['category'] == 'danger'){
                          statusColor = "red"
                      } else if(alerts[j]['category'] == 'warning'){
                          statusColor = "yellow"
                      }

                    }
                }
                // if the coords exist for the site
                if(coords){
                    // adds sites to an array with current status
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
            // renders that array of sites to the map
            renderCircles(jsonCircles);
        });

        function renderCircles(jsonCircles) {
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
        // clicked assists d3 with translating the positions of the sites (jsonCircles)
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
            // defines the transition ex. the speed of the transition
            g.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px");

            d3.selectAll("circle")
                .transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        }

        // zooms the map translates the projection
        function zoomed() {
            projection.translate(d3.event.translate).scale(d3.event.scale);
            // projection
            //   .scale(zoom.scale() / 2 / Math.PI)
            //   .translate(zoom.translate());
            g.selectAll("path").attr("d", path);
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
  	},
  	render: function() {
      	return (
  	        <div>
  	        	  <Map />
  	        </div>
      	);
  	}
});

ReactDOM.render(
    <div>
        <MapWrapper/>
        <AlertTable/>
    </div>,
    document.getElementById('mapWrapper')
);
