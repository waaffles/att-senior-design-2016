/** ReportForm React Class
  This class contains logic and view information to generate a report form that will create a report based on the user input
 */
var ReportForm = React.createClass({
    /** Options are the lists of current options
      Add to the options list if new ranges are supported on the backend
   */
    getInitialState: function(){
   return {
            selected: '',
            options: ['1-Week', '1-Month', '6-Months', '1-Year']
          };
  },
  /** Provides HTML to render this component
      Iterates over 'options' to create a radio button for each element
   */
  render: function(){
    var opts = this.state.options;
    return (
    //  action='/reportPDF'  OR serverreportPDF
        <form className='form-section center-align bottom-line' method='get' action='/reportPDF'>
        <h4 className='center-align form-field'>Report Generator:</h4>
        <ul className='center-align form-field'>

        {opts.map(function(opt, i) {
          return<li className='form-field' key={i}>
                  <input type="radio" className="radio" name="lengthtime" key={i} value={opt} id={opt}/>{opt}
                </li>;
        }.bind(this))}

        </ul>
        <input type='submit' className='form-field' value='Generate Report'/>
      </form>
    );
  }
});

/** Renders a react component. In this case, the ReportForm component within the 'content' DOM element*/
ReactDOM.render(
    <ReportForm/>
    ,
  document.getElementById('content')
);
