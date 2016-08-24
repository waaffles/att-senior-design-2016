/** Signup Form React Class
  This class contains logic and view information to generate a signup form
 */
var SignupForm = React.createClass({
  /** Sets class varaibles(states)*/
  getInitialState: function() {
    return {
            username: '',
            email:'',
            password: '',
            isAlerted: false
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
  /** Changes the class' email state.*/
  setEmail:function(event){
    var value=event.target.value;
    this.setState({email: value});
  },
  /** Changes the class' alert state.*/
  setAlert: function(event){
    this.setState({alert: !this.state.alert});
  },
  /** Makes an AJAX call to the server when the submit button is clicked. Sends class' state varaibles.*/
  submit:function(){
    var url = this.props.source;

    var data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };

  // Submit form via jQuery/AJAX
  $.ajax({
    type: 'POST',
    url: url,
    data: data
  })
  .done(function(data) {
    console.log('success');
  })
  .fail(function(jqXhr) {
    console.log('failed');
  });
  },
  /** Provides the html that will be rendered within the .html file when called.*/
  render: function() {
    return (

      <div className='wrapper'>
        <div className="logo">VLAD: MIR</div>
        <div className="login-block">
          <form className='login' action='/signup' method='post'>
              <h1>Signup</h1>
              <input type="text" value={this.state.username} placeholder="Username" id="username" name='username' onChange={this.setUsername}/>
              <input type="text" value={this.state.email} placeholder="Email" id="email" name='email' onChange={this.setEmail}/>
              <input type="password" value={this.state.password} placeholder="Password" id="password" name='password' onChange={this.setPassword}/>
              <div className='center'>
                <p className='checkbox'>Alert Me: </p>
                <input className='checkbox' type="checkbox" value={this.state.isAlerted}  id="alertable" name='alertable' onChange={this.setAlert}/>
              </div>
              <input type='submit' className='button btn' value='Submit'/>

          </form>
        </div>
        <p className='smallTxt'>
        <a href='/'>Login</a>
        </p>
      </div>
    );
  }
});

/** Renders a react component. In this case, the SignupForm component within the 'signup' DOM element*/
ReactDOM.render(
  <SignupForm source='/signup'/>,
  document.getElementById('signup')
);
