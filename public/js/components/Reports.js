//-----------File information-------------
/*
In React, a parent child relationship allows for communciation of variables and functions between components via this.props.<name>
When no relationship is available, a window-wide event must be created to communicate between components

Parent-Child Relationsihps:
  Reports is a parent of ReportSites
  ReportSites is a parent of ReportSatellites

Events:
  'createSignalGraph':
      -Listener: SignalGraph
      -Trigger: ReportSatellite

*/
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




// Signal Graph  -------------------------------------------------------------------
/* SignalGraph React component
  Creates a D3 graph
*/
var SignalGraph= React.createClass({
  getInitialState: function() {
    return {
            site: this.props.site,
            satellite: this.props.sat,
            transponders: this.props.trans,
            data: this.props.data,
            thres: '12',
            start: '',
            end: ''

            };
  },
  /** Creates a window-wide event listener to listen for 'createSignalGraph' event
+      On event, fetches data from server, cleans data, and Multiline graph object
+  */
  componentDidMount: function(){

    window.addEventListener("graph_"+this.state.site+'_'+this.state.satellite, function(event) {
      var data = event.detail;
      console.log('creating graph...'+data.length);
          var dps = [];

          var iso;
          var lineAmount = this.state.data.length;
          var type = 'mer';


              if(data && data[0] && data[0].trans_data && data[0].trans_data.length > 0)
              {
                $.each(data, function(i){
                  var aLine = [];
                  var txpId = data[i]._id.trans_id;
                  var object = {'txpId': txpId, 'type':'mer'};

                  $.each( data[i].trans_data, function( item ) {

                    if(data && ((data[i].trans_data[item].esno != 0 && !isNaN(data[i].trans_data[item].esno) ) || (data[i].trans_data[item].cnr != 0 && !isNaN(data[i].trans_data[item].cnr)) || (data[i].trans_data[item].mer != 0 && !isNaN(data[i].trans_data[item].mer))))
                    {

                        var date = new Date(data[i].trans_data[item].date_time);
                        iso = +date;
                        var ob={'date':iso};//, 'esno':parseFloat(data[0].trans_data[item].esno)};

                        var typeString = type.toLowerCase();

                        if (data[i].trans_data[item][typeString] != 0 && !isNaN(data[i].trans_data[item][typeString]) )
                        {
                          ob['value']=data[i].trans_data[item][typeString];
                        }

                        aLine.push(ob);

                    }
                    else
                    {
                      //invalid data(null or is zero)
                    }



                  });
                  object['data']=aLine;
                  dps.push(object);

                });

              var data = dps;

                //GET TIME FOR X AXIS
                  var count = 0;
                  var dates = [];
                  var dataValues = [];
                  var threshold = 12;
                  var validNums = [];

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


                  // if(aValues.length > 100000)
                  // {
                  //   min = 0;
                  //   max = 25;
                  // }
                  // else
                  // {
                  //   validNums.push(Math.min.apply(null, aValues));
                  //   maxNums.push(Math.max.apply(null, aValues));
                  // }


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
               // var min = Math.min.apply(null, minNums);
                //var max = Math.min.apply(null, maxNums);

                var reliability = ( above/dataValues.length)*100;
                var tpoints = [];

                tpoints.push({'date':before,'threshold':threshold});
                tpoints.push({'date':today,'threshold':threshold});
                  //FIRST PARAMETER IS ID OF DIV TO PUT GRAPH IN
                  var graph = new ReportGraph(this.state.site+'_'+this.state.satellite, {
                            "xmax": today, "xmin": before,
                            "ymax": 20, "ymin": -2,
                            "title": 'MER '+this.state.site+' '+this.state.satellite,
                            "xlabel": "Date",
                            "ylabel": type+"(dB)",
                            "dataPoints": data,
                            "threshold":threshold,
                           // "dates":dates,
                            "thresPoints":tpoints

                          });

             }
             else
             {
              console.log('no data');
             }

      }.bind(this));

  },

  /** Provides HTML to render this component
      This div provides a place for D3 to insert a chart
        -The id of this div must be the same as the first parameter given to the D3 MultiGraph object
        -The id for both are generated by the class' state variables site and satellite which are unique to each graph
  */
  render: function() {
    return (

      <div id={this.state.site+'_'+this.state.satellite} className="chart theChart"></div>

    );
  }
});

/* ReportSatellite React component
  Fetches all transponders for a given satellite
  Creates a React SignalGraph for every satelllite
  Creates a 'createsignalgraph' event once all data is retrived from the server
*/
var ReportSatellite= React.createClass({
  getInitialState: function() {
    return {
            site: this.props.site,
            satellite: this.props.sat,
            transponders: [],
            data: [],
            };
  },

  /** Fetches all transponder for this site and satellite
      Fetches data for all transponder
      Creates 'createSignalGraph' event after all data is loaded
   */
  componentDidMount: function(){
   $.getJSON(window.location.origin + '/sites/'+this.state.site+'/'+this.state.satellite+'/trans', function(results) {

        var data_url = window.location.origin + '/sites/'+this.state.site+'/trans'

        //Add every transponder to url
         var trans = [];
        for(var i = 0; i <results.length; i++)
        {
            if(trans.indexOf(results[i]._id.txp_id) < 0)
            {
              if(trans.length == 0)
              {
                data_url = data_url + '?txpId='+results[i]._id.txp_id;
              }
              else
              {
                data_url = data_url + '&txpId='+results[i]._id.txp_id;

              }
              trans.push(results[i]._id.txp_id);

            }
        }
        this.setState({transponders: trans});


        data_url += '&dataType=mer&range=week';
        //To test our data
        //data_url += '&dataType=mer&date1=2011-01-01&date2=2011-04-01'



        var data = [];
        $.getJSON(data_url, function( retrieved_data ) {
            this.setState({data: retrieved_data});
              var myEvent = new CustomEvent("graph_"+this.state.site+'_'+this.state.satellite, {detail: retrieved_data});

              window.dispatchEvent(myEvent);


        }.bind(this));


  //console.log(results);

    }.bind(this));

  },
  updateData: function(){

  },
  /** Provides HTML to render this component.
      Creates SignalGraph and passes site, satellite, transponder list, and data
 */
  render: function() {
    return (

      <SignalGraph site={this.state.site} sat={this.state.satellite} trans={this.state.transponders} data={this.state.data}/>

    );
  }
});


/* ReportSite React component.
  Fetches all satellites for a given site.
  Creates a React ReportSatellite for every satellite fetched from the server.
*/
var ReportSite= React.createClass({
  getInitialState: function() {
    return {
            site: this.props.data,
            satellites: [],
            };
  },
  /** Fetches all satellites for this site */
  componentDidMount: function(){
     $.getJSON(window.location.origin + '/sites/'+this.state.site+'/sats', function(results) {

        var sats = [];
        for(var i = 0; i <results.length; i++)
        {
          if(sats.indexOf(results[i]._id) < 0)
          {
            sats.push(results[i]._id);
          }
        }

        sats = sats.sort();
        this.setState({satellites: sats});

      // console.log(sats);

    }.bind(this));
  },
  /** Provides HTML to render this component.
      Creates ReportSatellite for every satellite in this class' state variable 'satellite'/
   */
  render: function() {
    var sats = this.state.satellites;
    return (

      <div className='site-section'>
        {sats.map(function(sat, i) {
          return <ReportSatellite key={i} sat={sat} site={this.state.site}/>;
        }.bind(this))}
      </div>
    );
  }
});

/** Reports React component.
    Fetches all sites from the server.
    Creates a reportSite component for every site.
*/
var Reports = React.createClass({
  getInitialState: function(){
   return {
        sites : []
          };
  },
  /** Fetches all sites from the server */
  componentDidMount: function(){

     $.getJSON(window.location.origin + '/sites', function(results) {

        var sites = [];
        for(var i = 0; i <results.length; i++)
        {
          sites.push(results[i].site);
        }

        sites = sites.sort();
        this.setState({sites: sites});

    }.bind(this));

  },
  /** Provides HTML to render this component
      Creates ReportSite for every site in this component's state variable 'sites'
  */
  render: function(){
    var sites = this.state.sites;
    return (
      <div className='site-section'>
        {sites.map(function(site, i) {
          return <ReportSite key={i} data={site} />;
        }.bind(this))}
      </div>
    );
  }
});

/** Renders a react component. In this case, the Reports component within the 'content' DOM element*/
ReactDOM.render(
    <Reports/>
    ,
  document.getElementById('content')
);
