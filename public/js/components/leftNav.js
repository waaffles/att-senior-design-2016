/* React Styling*/
var inlineStyle =  {
  width:100+'%'
};

/** SideNav React Class
  This class contains logic and view information to generate the basic left navigation menu
 */
 var SideNav = React.createClass({
  getInitialState: function() {
    return {
      showAvailNav: false,
      showSignalNav: false,
      showAdminNav: false,
      username: "Employee"
    };
  },
  componentDidMount: function() {
    var that = this;
    $.getJSON(window.location.origin + '/username', function (user) {
        that.setState({username:user.username})
    });
  },
  showAvailNav: function(event) {
    this.setState({showAvailNav: !this.state.showAvailNav});
  },
  showSignalNav:function(event){
    this.setState({showSignalNav: !this.state.showSignalNav});
  },
  showAdminNav:function(event){
    this.setState({showAdminNav: !this.state.showAdminNav});
  },
  /** Provides the html that will be rendered within the .html file when called.
      Each li is a row in the nav bar. href is a link to an api route
      Comments within the render function must be within {}
  */
  render: function() {
    return (
    <div className='nav-wrapper blackTxt'>
      <ul id="nav-mobile" className="side-nav fixed">
        <img src="assets/pictures/logo.jpg" style={inlineStyle} alt="att logo"/>
        <div className='center-align'>Welcome, {this.state.username}!</div>


            <li >
                <a className="collapsible-header  waves-effect waves-att bold" href='/home'>Dashboard</a>
            </li>

            <li ><a className="collapsible-header  waves-effect waves-att bold" href='/archive'>Archive</a>
            </li>

       {/*----------------- SIGNAL TO NOISE ------------------*/}
            <li>

              <a className="collapsible-header  waves-effect waves-att bold" href='/grapher'>RFCC Data Grapher</a>

               { this.state.showSignalNav ?<SignalNav/> : null }
            </li>

        {/*----------------- Reports ------------------*/}
             <li>

              <a className="collapsible-header  waves-effect waves-att bold" href='/reports'>Reports</a>

            </li>

       {/*----------------- ADMIN NAV ------------------*/}
             <li>

              <a className="collapsible-header  waves-effect waves-att bold" href='/admin'>Admin</a>

            </li>


       {/*----------------- LOGOUT ------------------*/}
             <li>

                    <form action='/logout' method='POST'>
                      <input type='submit' value='Logout'></input>
                    </form>

            </li>




      </ul>
    </div>

    );
  }
});



ReactDOM.render(
  <SideNav/>,
  document.getElementById('leftSide')
);
