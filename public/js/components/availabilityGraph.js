//----------------------------------------------DATA STATISTICS---------------------------------------------------
function getMedian(values) {

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function getMean(total, length){
  return total/length;
}


function getTotal(values){
  var i = 0;
  var total = 0;
  while ( i < values.length)
  {
    total += values[i];
    i++;
  }
  return total;
}

function getBelow(values, threshold){
  var x = 0;
  var belows = [];
  while (x <values.length)
  {
    if(values[x]<threshold)
    {
      belows.push(values[x]);
    }
    x++;
  }
  return belows;
}




// Availability Graph  -------------------------------------------------------------------



var AvailabilityGraph= React.createClass({
  getInitialState: function() {
    return {
            showAvail: false,
            site: '',
            transponder: '',
            thres: '',
            start: '',
            end: '',
            data: []

            };
  },

  componentDidMount: function(){

      window.addEventListener('createAvailabilityGraph', function(event) {

        console.log(event.detail);


          if(true)//event.detail.site && event.detail.tran && event.detail.start && event.detail.end && event.detail.thres)
          {
           //CALL TO SERVER FOR NEW DATA
           var dps = [];



var data = dps;

  //GET TIME FOR X AXIS
    var count = 0;  
    var dates = [];
    var esnoPoints = [];
    var threshold = 6.0;//event.detail.tran;


    //CONVERT TO NUMBERS
   while (count < data.length)
   {
   
    if(data && data[count] && data[count].date && data[count].esno && data[count].type)
    {
      var ndate = new Date(data[count].date);
      var milis = ndate.getTime() * 1.00;
      data[count].date = milis;
      esnoPoints.push(data[count].esno);
      dates.push(milis);
    }
    else
    {console.log("ERROR");}

    count++;

   }

//SORT //REMOVE THIS LINE ON MERGE   

  var xcount=0;
   while (xcount < data.length)
   {
   
    data[xcount].date = dates[xcount];
    xcount++;

   }


    var today = new Date(data[data.length-1].date);
    var before = new Date(data[0].date);
    

//average

  var total = getTotal(esnoPoints);
  var mean = getMean(total, esnoPoints.length);
  var belowPoints = getBelow(esnoPoints, threshold);
  var below = belowPoints.length;
  var above = esnoPoints.length - below;
  var min;
  var max;
  if(esnoPoints.length > 100000)
  {
    min = 'N/A';
    max = 'N/A';
  }
  else
  {
    min = Math.min.apply(null, esnoPoints);
    max = Math.max.apply(null, esnoPoints);
  }
  var reliability = ( above/esnoPoints.length)*100;
  var tpoints = [];

  tpoints.push({'date':before,'threshold':threshold});
  tpoints.push({'date':today,'threshold':threshold});

  //createLegend();


    var graph = new SimpleGraph("chart1", {
              "xmax": today, "xmin": before,
              "ymax": max+2, "ymin": min-2, 
              "title": "",
              "xlabel": "Date",
              "ylabel": "Esno "+event.detail.tran+"(dB)" ,
              "dataPoints": data,
              "threshold":threshold,
              "dates":dates,
              "thresPoints":tpoints
            });

          }




      });

  },

  showA: function(event) {
    this.setState({showAvail: !this.state.showAvail});
  },
  showN:function(event){
    this.setState({showSignal: !this.state.showSignal});
  },
  render: function() {
    return (
    
      <div id="chart1" className="chart"></div>
              
    );
  }
});




ReactDOM.render(
  <div>
    <AvailabilityGraph/>
  </div>
    ,
  document.getElementById('content')
);