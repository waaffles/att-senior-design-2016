/** Login Form React Class
  This class contains logic and view information to generate a login form
 */
var LoginForm = React.createClass({
  /** Sets class varaibles(states)*/
  getInitialState: function() {
    return {
            username: '',
            password: ''
          };
  },
  /** Changes the class' username state.*/
  setUsername: function(event) {

    var value=event.target.value;
    this.setState({username: value});
  },
  /** Changes the class' password state.*/
  setPassword:function(event){

    var value=event.target.value;
    this.setState({password: value});
  },
  /** HTML code for login window */
  render: function() {
    return (

      <div className='wrapper'>
        <div className="logo">VLAD: MIR</div>
        <div className="login-block">
          <form className='login'action="/login" method="post" >
              <h1>Login</h1>
              <input type="text" value={this.state.username} placeholder="Username" id="username" name='username' onChange={this.setUsername}/>
              <input type="password" value={this.state.password} placeholder="Password" id="password" name='password' onChange={this.setPassword}/>
              <input type='submit' className='button btn ' value='Submit'/>
          </form>
        </div>
        <p className='smallTxt'>
          <a href='#'>Forgot Password</a>
        </p>
        <p className='smallTxt'>
          <a href='signup'>Signup</a>
        </p>
      </div>
    );
  }
});

/** Renders a react component. In this case, the LoginForm component within the 'login' DOM element*/
ReactDOM.render(
  <LoginForm source='/login'/>,
  document.getElementById('login')
);
