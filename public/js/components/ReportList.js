/** ReportList React Class
  This class contains logic and view information to download a report PDF from the server
 */
var ReportList = React.createClass({
  getInitialState: function(){
   return {
            reports: [],

          };
  },

   /** Fetches all currently generated pdf's*/
  componentDidMount: function(){
   // $.getJSON('/report-list', function(results) {
   //      var reports = [];
   //      for(var i = 0; i <results.length; i++)
   //      {
   //        reports.push(results[i].filename);
   //      }

   //      console.log(reports);


   //      this.setState({reports: reports});
   //  }.bind(this));
      this.setState({reports:['test-report_04_24_2016_1week']});

  },
  /** Provides HTML to render the component.
      Iterates through the reports list to create a link for each
   */
  render: function(){
    var reports = this.state.reports;
    return (
      <div className='form-section center-align'>
      <h4 className='center-align form-field'>Generated Reports:</h4>
      <ul className='center-align form-field'>

        {reports.map(function(report, i) {
          return<li className='form-field' key={i}>
                  <a className="radio" href='' key={i}>{report}</a>
                </li>;
        }.bind(this))}
        </ul>
      </div>

    );
  }



});

/** Renders a react component. In this case, the ReportList component within the 'content2' DOM element*/
ReactDOM.render(
    <ReportList/>
    ,
  document.getElementById('content2')
);
