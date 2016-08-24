//----------------------------------------------DATA STATISTICS---------------------------------------------------
/** Javascript function to get median*/
function getMedian(values) {

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

/** Javascript function to get mean*/
function getMean(total, length){
  return total/length;
}

/** Javascript function to get total*/
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

/** Javascript function to get points below the threshold*/
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

/* SignalGraph React component
  Creates a D3 graph
*/
var SignalGraph= React.createClass({
  getInitialState: function() {
    return {
            showSignal: false,
            site: '',
            transponder: '',
            thres: '',
            start: '',
            end: '',
            data: []

            };
  },
  /** Creates a window-wide event listener to listen for 'createSignalGraph' event
      On event, fetches data from server, cleans data, and Multiline graph object
  */
  componentDidMount: function(){
      window.addEventListener('createSignalGraph', function(event) {

          window.addLoading();

          var dps = [];
          var type = event.detail.type.toLowerCase();


            //GET NEW DATA POINTS
            console.log("searching");
          $.getJSON(window.location.origin + event.detail.data_source, function( data ) {
            //TEST URLS
           //$.getJSON('http://localhost:3000/sites/SCUT/trans?txpId=f989&txpId=f1105&txpId=f1840ke12&dataType=esno&date1=2009-09-19&date2=2012-9-20', function( data ) {
          //$.getJSON('http://localhost:3000//sites/ABTX/trans?txpId=f1840ko12&txpId=f1840ko12&txpId=f1840ke12&txpId=f1880ko12&txpId=f1880ke12&txpId=f1920ko12&txpId=f1920ke12&dataType=esno&date1=2011-01-01&date2=2012-01-01', function( data ) {

             var iso;
             var lineAmount = data.length;
             console.log(data);


              var hasData = false
              $.each( data, function(i, item ) {
                if(item.trans_data.length > 0)
                {
                  hasData = true;
                  return false;
                }

              });

              if(data && data.length > 0 && hasData)
              {

                $.each(data, function(i, trans){

                  var aLine = [];
                  var txpId = trans._id.trans_id;
                  var object = {'txpId': txpId, 'type': type};

                  if( trans.trans_data.length > 0 )
                  {

                    $.each( trans.trans_data, function( i, t_data ) {

                      if( !isNaN(t_data[type]) && t_data.date_time.length > 0)
                      {

                          var date = new Date(t_data.date_time);
                          iso = +date;
                          var ob={'date':iso};

                          ob['value']=t_data[type];

                          aLine.push(ob);

                      }
                      else
                      {
                        //invalid data(null or is zero)
                      }

                    });

                    object['data']=aLine;
                    dps.push(object);

                  }
                  else
                  {
                    console.log('Transponder empty '+txpId + '. removed from graph');
                  }
                });

              var data = dps;

                //GET TIME FOR X AXIS
                  var count = 0;
                  var dates = [];
                  var dataValues = [];
                  var threshold = event.detail.thres;
                  var minNums = [];
                  var maxNums = [];

                  //CONVERT TO NUMBERS
                for(var i = 0; i <data.length; i++)
                {

                  var aDates = [];
                  var aValues = [];
                 while (count < data[i].data.length)
                 {
                  if( data[i].data[count].date && data[i].data[count].value)
                  {
                    var ndate = new Date(data[i].data[count].date);
                    var milis = ndate.getTime() * 1.00;
                    data[i].data[count].date = milis;
                    aValues.push(data[i].data[count].value);
                    aDates.push(milis);
                  }
                  else
                  {console.log("ERROR");}

                  count++;

                 }
                 count = 0;
                 dates.push(aDates);


                  if(aValues.length > 100000)
                  {
                    minNums.push(0);
                    maxNums.push(20);
                  }
                  else
                  {
                    minNums.push(Math.min.apply(null, aValues));
                    maxNums.push(Math.max.apply(null, aValues));
                  }


                 dataValues.push(aValues);
                }
                console.log(data);



              if(dates.length > 0){

                  var today = new Date(dates[0][dates[0].length-1]);
                  var before = new Date(dates[0][0]);
              }


              //average

                var total = getTotal(dataValues);
                var mean = getMean(total, dataValues.length);
                var belowPoints = getBelow(dataValues, threshold);
                var below = belowPoints.length;
                var above = dataValues.length - below;
                var min = Math.min.apply(null, minNums);
                var max = Math.min.apply(null, maxNums);

                var reliability = ( above/dataValues.length)*100;
                var tpoints = [];

                tpoints.push({'date':before,'threshold':threshold});
                tpoints.push({'date':today,'threshold':threshold});

                console.log(before);
                console.log(today);

          //REMOVE OLD GRAPH
          window.removeEsnoGraph();

                  var graph = new MultiGraph("chart1", {
                            "xmax": today, "xmin": before,
                            "ymax": max+2, "ymin": min-2,
                            "title": "RFCC Data Trending Graph",
                            "xlabel": "Date",
                            "ylabel": type +"(dB)" ,
                            "dataPoints": data,
                            "threshold":threshold,
                           // "dates":dates,
                            "thresPoints":tpoints

                          });

                  window.removeLoading();

             }
             else
             {
              console.log('no data');
              window.removeLoading();
              window.removeEsnoGraph();
              window.displayNoData();
             }
            });
      });
  },
  showA: function(event) {
    this.setState({showAvail: !this.state.showAvail});
  },
  showN:function(event){
    this.setState({showSignal: !this.state.showSignal});
  },
  /** Provides HTML to render this component
      This div provides a place for D3 to insert a chart
        -The id of this div must be the same as the first parameter given to the D3 MultiGraph object
  */
  render: function() {
    return (

      <div id="chart1" className="chart theChart"></div>

    );
  }
});




ReactDOM.render(
  <div>
    <SignalGraph/>
  </div>
    ,
  document.getElementById('content')
);
