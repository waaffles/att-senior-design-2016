/*
This file  does all the report graphing.
These graphs are static and smaller than individually generated graphs
*/

/*
ReportGraph = function(elemid, options) {
  //remove old graph


  var self = this;
  this.chart = document.getElementById(elemid);
  this.cx=$(window).width() - 100
  this.cy= this.cx / 1.5;
  //this.cx=850;
  //this.cy=550;
  this.options = options || {};
  this.options.xmax = options.xmax || 30;
  this.options.xmin = options.xmin || 0;
  this.options.ymax = options.ymax || 10;
  this.options.ymin = options.ymin || 0;

  this.padding = {
     "top":    this.options.title  ? 40 : 20,
     "right":                 30,
     "bottom": this.options.xlabel ? 60 : 10,
     "left":   this.options.ylabel ? 70 : 45
  };

  this.size = {
    "width":  this.cx - this.padding.left - this.padding.right,
    "height": this.cy - this.padding.top  - this.padding.bottom
  };

  this.x = d3.time.scale()
    .domain([this.options.xmin, this.options.xmax])
    .range([0, this.size.width]);


  // drag x-axis logic
  this.downx = Math.NaN;

  // y-scale (inverted domain)
  this.y = d3.scale.linear()
      .domain([this.options.ymax, this.options.ymin])
      .nice()
      .range([0, this.size.height])
      .nice();

  // drag y-axis logic
  this.downy = Math.NaN;

  this.dragged = this.selected = null;

  this.line = d3.svg.line()
      .x(function(d, i) { return this.x(d.date); })
      .y(function(d, i) { return this.y(d.value); })
      .interpolate("basis");


//-------------------------------------------------------------------------------------
  this.line2 = d3.svg.line()
      .x(function(d, i) { return this.x(this.thresPoints[i].date); })
      .y(function(d, i) { return this.y(this.thresPoints[i].threshold); });
//-------------------------------------------------------------------------------------


  var xrange =  (this.options.xmax - this.options.xmin),
      yrange2 = (this.options.ymax - this.options.ymin) / 2,
      yrange4 = yrange2 / 2,
      datacount = this.size.width/30;

    this.points = options.dataPoints;
    console.log(this.points);
    this.thresPoints = options.thresPoints;



  this.vis = d3.select(this.chart).append("svg")
      .attr('class','theChart')
      .attr("width",  this.cx)
      .attr("height", this.cy)
      .append("g")
        .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");

  this.plot = this.vis.append("rect")
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .style("fill", "#f5f5f5")
      self = this;

      //dummy svg element to move the tooltip around
      this.vis.append("rect")
       .attr("id", "dummy")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", 0)
       .attr("height", 0)
       .style("opacity", 1);

   //create empty text for min/max information
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 0)
     .attr("id", "info_name")
     .text("");
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 10)
     .attr("id", "info_min")
     .text("");
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 20)
     .attr("id", "info_max")
     .text("");
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 30)
     .attr("id", "info_avg")
     .text("");

   this.colorScale = d3.scale.category10();



  this.points.forEach(function(line){
    self.vis.append("svg")
        .attr("top", 0)
        .attr("left", 0)
        .attr("width", self.size.width)
        .attr("height", self.size.height)
        .attr("viewBox", "0 0 "+self.size.width+" "+self.size.height)
        .attr("class", "line")
        .append("path")
            .attr("class", "line")
            .attr("d", self.line(line.data));
    })


//-------------------------------------------------------------------------------------

  this.vis.append("svg")
      .attr("top", 0)
      .attr("left", 0)
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .attr("viewBox", "0 0 "+this.size.width+" "+this.size.height)
      .attr("class", "line")
      .append("path")
          .attr("class", "line")
          .style("stroke", "red")
          .attr("d", this.line2(this.thresPoints));


//-------------------------------------------------------------------------------------


  // add Chart Title
  if (this.options.title) {
    this.vis.append("text")
        .attr("class", "axis")
        .text(this.options.title)
        .attr("x", this.size.width/2)
        .attr("dy","-0.8em")
        .style("text-anchor","middle");
  }

  // Add the x-axis label
  if (this.options.xlabel) {
    this.vis.append("text")
        .attr("class", "axis")
        .text(this.options.xlabel)
        .attr("x", this.size.width/2)
        .attr("y", this.size.height)
        .attr("dy","2.4em")
        .style("text-anchor","middle");

  }




  // add y-axis label
  if (this.options.ylabel) {
    this.vis.append("g").append("text")
        .attr("class", "axis")
        .text(this.options.ylabel)
        .style("text-anchor","middle")
        .attr("transform","translate(" + -40 + " " + this.size.height/2+") rotate(-90)");
  }


};


ReportGraph.prototype.update = function() {


  var self = this;
  this.vis.selectAll("path").remove();


  //-------------------------------------------------------------------------------------
  this.colorScale = d3.scale.category10();
  self = this;//capture the value held by this so it doesn't change
  //draw all trending lines

var p = {'x':0, 'y':0};



    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        console.log(d);
        return "<strong>Transponder:</strong> <span style='color:red'>" + d.txpId + "</span>"
        + '<br /><strong>Min: </strong>' + d3.min(d.data.filter(function(d) {
            return self.x(d.date) > 0 && self.x(d.date) < self.cx;
        }), function(d){ return +d.value; })
        + '<br /><strong>Max: </strong>' + d3.max(d.data.filter(function(d) {
            return self.x(d.date) > 0 && self.x(d.date) < self.cx;
        }), function(d){ return +d.value; })
        + '<br /><strong>Avg: </strong>' + d3.mean(d.data.filter(function(d) {
            return self.x(d.date) > 0 && self.x(d.date) < self.cx;
        }), function(d){ return +d.value; });
      });

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

this.vis.call(tip);



this.points.forEach(function(line){
  self.vis.append("svg")
      .attr("top", 0)
      .attr("left", 0)
      .attr("width", self.size.width)
      .attr("height", self.size.height)
      .attr("viewBox", "0 0 "+self.size.width+" "+self.size.height)
      .attr("class", "line")
      .append("path")
        .attr("class", "line")
        .style("stroke", self.colorScale(line.txpId))

        .attr("d", self.line(line.data));});

//draw legend
var offset = 0;//the number of legends drawn, each one moves slightly more
var distance = 14;//number of pixels between each legends
self = this;
this.points.forEach(function(line){
  self.vis.append("text")
  .attr("x", self.cx - 200)
  .attr("y", offset * distance)
  .text(line.txpId)
  .style("fill", self.colorScale(line.txpId));
  offset = offset + 1;
});

//-------------------------------------------------------------------------------------
  //draw threshold line
  this.vis.append("svg")
      .attr("top", 0)
      .attr("left", 0)
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .attr("viewBox", "0 0 "+this.size.width+" "+this.size.height)
      .attr("class", "line")
      .append("path")
          .attr("class", "line")
          .style("stroke", "red")
          .attr("d", this.line2(this.thresPoints));

//-------------------------------------------------------------------------------------

}

*/


/*
This file  does all the graphing.
*/


ReportGraph = function(elemid, options) {
  //remove old graph


  var self = this;
  this.chart = document.getElementById(elemid);
  this.cx=$(window).width()-240;
  this.cy= this.cx / 1.5;
  //this.cx=850;
  //this.cy=550;
  this.options = options || {};
  this.options.xmax = options.xmax || 30;
  this.options.xmin = options.xmin || 0;
  this.options.ymax = options.ymax || 10;
  this.options.ymin = options.ymin || 0;

  this.padding = {
     "top":    this.options.title  ? 40 : 20,
     "right":                 30,
     "bottom": this.options.xlabel ? 60 : 10,
     "left":   this.options.ylabel ? 70 : 45
  };

  this.size = {
    "width":  this.cx - this.padding.left - this.padding.right,
    "height": this.cy - this.padding.top  - this.padding.bottom
  };

  this.x = d3.time.scale()
    .domain([this.options.xmin, this.options.xmax])
    .range([0, this.size.width]);


  // drag x-axis logic
  this.downx = Math.NaN;

  // y-scale (inverted domain)
  this.y = d3.scale.linear()
      .domain([this.options.ymax, this.options.ymin])
      .nice()
      .range([0, this.size.height])
      .nice();

  // drag y-axis logic
  this.downy = Math.NaN;

  this.dragged = this.selected = null;

  this.line = d3.svg.line()
      .x(function(d, i) { return this.x(d.date); })
      .y(function(d, i) { return this.y(d.value); })
      .interpolate("basis");


//-------------------------------------------------------------------------------------
  this.line2 = d3.svg.line()
      .x(function(d, i) { return this.x(this.thresPoints[i].date); })
      .y(function(d, i) { return this.y(this.thresPoints[i].threshold); });
//-------------------------------------------------------------------------------------


  var xrange =  (this.options.xmax - this.options.xmin),
      yrange2 = (this.options.ymax - this.options.ymin) / 2,
      yrange4 = yrange2 / 2,
      datacount = this.size.width/30;

    this.points = options.dataPoints;
    console.log(this.points);
    this.thresPoints = options.thresPoints;



  this.vis = d3.select(this.chart).append("svg")
      .attr('class','theChart')
      .attr("width",  this.cx)
      .attr("height", this.cy)
      .append("g")
        .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");

  this.plot = this.vis.append("rect")
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .style("fill", "#f5f5f5")
      .attr("pointer-events", "all")
      self = this;

      //dummy svg element to move the tooltip around
      this.vis.append("rect")
       .attr("id", "dummy")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", 0)
       .attr("height", 0)
       .style("opacity", 1);

   //create empty text for min/max information
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 0)
     .attr("id", "info_name")
     .text("");
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 10)
     .attr("id", "info_min")
     .text("");
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 20)
     .attr("id", "info_max")
     .text("");
   this.vis.append("text")
     .attr("x", 0)
     .attr("y", 30)
     .attr("id", "info_avg")
     .text("");

   this.colorScale = d3.scale.category10();



  this.points.forEach(function(line){
    self.vis.append("svg")
        .attr("top", 0)
        .attr("left", 0)
        .attr("width", self.size.width)
        .attr("height", self.size.height)
        .attr("viewBox", "0 0 "+self.size.width+" "+self.size.height)
        .attr("class", "line")
        .append("path")
            .attr("class", "line")
            .attr("d", self.line(line.data));
    })


//-------------------------------------------------------------------------------------

  this.vis.append("svg")
      .attr("top", 0)
      .attr("left", 0)
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .attr("viewBox", "0 0 "+this.size.width+" "+this.size.height)
      .attr("class", "line")
      .append("path")
          .attr("class", "line")
          .style("stroke", "red")
          .attr("d", this.line2(this.thresPoints));


//-------------------------------------------------------------------------------------


  // add Chart Title
  if (this.options.title) {
    this.vis.append("text")
        .attr("class", "axis")
        .text(this.options.title)
        .attr("x", this.size.width/2)
        .attr("dy","-0.8em")
        .style("text-anchor","middle");
  }

  // Add the x-axis label
  if (this.options.xlabel) {
    this.vis.append("text")
        .attr("class", "axis")
        .text(this.options.xlabel)
        .attr("x", this.size.width/2)
        .attr("y", this.size.height)
        .attr("dy","2.4em")
        .style("text-anchor","middle");

  }




  // add y-axis label
  if (this.options.ylabel) {
    this.vis.append("g").append("text")
        .attr("class", "axis")
        .text(this.options.ylabel)
        .style("text-anchor","middle")
        .attr("transform","translate(" + -40 + " " + this.size.height/2+") rotate(-90)");
  }



  this.redraw()();

//REMOVE LOADING SCREEN
//removeLoader();

};

//
// SimpleGraph methods
//

ReportGraph.prototype.plot_drag = function() {
  var self = this;
  return function() {
    d3.select('body').style("cursor", "move");

  }
};

ReportGraph.prototype.update = function() {


  var self = this;
  this.vis.selectAll("path").remove();


  //-------------------------------------------------------------------------------------
  this.colorScale = d3.scale.category10();
  self = this;//capture the value held by this so it doesn't change
  //draw all trending lines

var p = {'x':0, 'y':0};




this.points.forEach(function(line){
  self.vis.append("svg")
      .attr("top", 0)
      .attr("left", 0)
      .attr("width", self.size.width)
      .attr("height", self.size.height)
      .attr("viewBox", "0 0 "+self.size.width+" "+self.size.height)
      .attr("class", "line")
      .append("path")
        .attr("class", "line")
        .style("stroke", self.colorScale(line.txpId))
        .attr("d", self.line(line.data));});

//draw legend
var offset = 0;//the number of legends drawn, each one moves slightly more
var distance = 14;//number of pixels between each legends
self = this;
this.points.forEach(function(line){
  self.vis.append("text")
  .attr("x", self.cx - 200)
  .attr("y", offset * distance)
  .text(line.txpId)
  .style("fill", self.colorScale(line.txpId));
  offset = offset + 1;
});

//-------------------------------------------------------------------------------------
  //draw threshold line
  this.vis.append("svg")
      .attr("top", 0)
      .attr("left", 0)
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .attr("viewBox", "0 0 "+this.size.width+" "+this.size.height)
      .attr("class", "line")
      .append("path")
          .attr("class", "line")
          .style("stroke", "red")
          .attr("d", this.line2(this.thresPoints));

//-------------------------------------------------------------------------------------


}


ReportGraph.prototype.redraw = function() {
  var self = this;
  return function() {
    var tx = function(d) {
      return "translate(" + self.x(d) + ",0)";
    },
    ty = function(d) {
      return "translate(0," + self.y(d) + ")";
    },
    stroke = function(d) {
      return d ? "#ccc" : "#666";
    },
    fx = self.x.tickFormat(10),
    fy = self.y.tickFormat(10);




    // Regenerate x-ticks…
    var gx = self.vis.selectAll("g.x")
        .data(self.x.ticks(7), String)
        .attr("transform", tx);

    gx.select("text")
        .text(fx);

    var gxe = gx.enter().insert("g", "a")
        .attr("class", "x")
        .attr("transform", tx);

    gxe.append("line")
        .attr("stroke", stroke)
        .attr("y1", 0)
        .attr("y2", self.size.height);

    gxe.append("text")
        .attr("class", "axis")
        .attr("y", self.size.height)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(fx);

    gx.exit().remove();

    // Regenerate y-ticks…
    var gy = self.vis.selectAll("g.y")
        .data(self.y.ticks(7), String)
        .attr("transform", ty);

    gy.select("text")
        .text(fy);

    var gye = gy.enter().insert("g", "a")
        .attr("class", "y")
        .attr("transform", ty)
        .attr("background-fill", "#FFEEB6");

    gye.append("line")
        .attr("stroke", stroke)
        .attr("x1", 0)
        .attr("x2", self.size.width);

    gye.append("text")
        .attr("class", "axis")
        .attr("x", -3)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(fy)
        .style("cursor", "ns-resize");


    gy.exit().remove();
    self.plot.call(d3.behavior.zoom().x(self.x).y(self.y).on("zoom", self.redraw()));
    self.update();
  }
}
