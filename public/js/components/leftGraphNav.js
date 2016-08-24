/* React style*/
var inlineStyle =  {
  width:100+'%'
};

/*React style*/
var ddheight = {
  maxHeight:300+'px'
};

/* Global javascript array*/
var txps = [];

/* Wrapper List Item React component
    Displays list items (li) given the inner html when called and updates parent Component when the li is clicked
*/
var Wrapper = React.createClass({
  /** Calls parent react component's update function and passes the value inside the li*/
   updateClicked: function(){
    var value = this.refs.content.innerHTML;
    this.props.update(value);
  },
  /* HTML that will be rendered when this class is called.
    onClick calls state's function to call inherited parent function.
    this.props.data is an inherited variable from the parent React component.
  */
  render: function() {
    return (
        <li onClick={this.updateClicked} ref='content'>{this.props.data}</li>
      );
  }
});

/* Wrapper Checkbox React component
    Displays checkbox list items given the inner html when called and updates parent Component when the li is clicked
*/
var Wrapper_Checkbox = React.createClass({
  /** Calls parent react component's update function and passes the value inside the li*/
   checked: null, //whether a checkbox should be checked by default(reopening txp selection)
   updateClicked: function(){

    var value = this.refs.content.innerHTML;
    var t_id=value;

    for(var p = 0; p < txps.length; p++)
    {
      if(txps[p].num.toString() == value.toString())
      {
        t_id = txps[p].id;
        break;
      }
    }
    this.props.update(t_id);
  },
  /* HTML that will be rendered when this class is called.
    onClick calls state's function to call inherited parent function.
    this.props.data is an inherited variable from the parent React component.
  */
  render: function() {
    var t_id=null;

    for(var p = 0; p < txps.length; p++)
    {
      if(txps[p].num.toString() == this.props.data)
      {
        t_id = txps[p].id;
        break;
      }
    }
    this.checked = this.props.selected.indexOf(t_id) > -1 ? true : false;
    var classN = 'filled-in ' + t_id;
    return (

      <li>

        <input type="checkbox" className={classN} id={this.props.data} defaultChecked={this.checked}/>
        <label ref='content'  htmlFor={this.props.data} onClick={this.updateClicked}>{this.props.data}</label>
      </li>

      );
  }



});


/* Dropdown Sites React component
    Displays a dropdown of sites by making an api call and then creating a Wrapper react component for each site
*/
var DropDown_Sites = React.createClass({
  /** Class' state variables
      'values' are values to be displayed in the dropdown
  */
   getInitialState: function() {
    return {
      values: [],
      selected: ''
    };
  },

  /** Updates the state variable selected when a site is clicked */
  updateSite: function(selected){
    //console.log(selected);
    this.props.update(selected);
  },

  /** Called when component is rendered, makes an api call to the url given when the class is rendered(this.props.source) */
  componentDidMount: function() {
    var sites = [];
    $.getJSON(window.location.origin + this.props.source, function(results) {
      console.log('DROP DOWN SITES API-DATA LENGTH: '+results.length)

        for(var i = 0; i <results.length; i++)
        {
          sites.push(results[i].site);
        }

        sites = sites.sort();


        this.setState({values: sites});


    }.bind(this));
  },
  /** Html provided to render this component
      Iterates over the state variable 'values' to create Wrapper List Item components.
      Gives each Wrapper Component this state's updateSite function and an element of 'values' to display
  */
  render: function() {
    var btnClick = function(e) {
      //Stop the bar from automatically closing
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      //Show the modal
      var mod = document.getElementById('myModal');
      mod.style.display = 'block';
    };
    var results = this.state.values;
    var options = <ul className='horizontal scrollable' onClick={this.props.close}> {results.map(function(results, i) {
    return <Wrapper update={this.updateSite} key={i} data={results} />;
  }.bind(this))}
  </ul>;
    var header = <h2>Select a site</h2>;

    return (
      <div>
        <Modal content={options} contentHeader={header}/>
        <ul style={ddheight} className='scrollable'>
        <button onClick={btnClick}>
            Open Modal
            </button>
          {results.map(function(results, i) {
          return <Wrapper update={this.updateSite} key={i} data={results} />;
           }.bind(this))}
        </ul>
      </div>
    );
  }
});


/* Dropdown Satellite React component
    Displays a dropdown of satellite by making an api call and then creating a Wrapper react component for each satellite
*/
var DropDown_Sats = React.createClass({
  /** Class' state variables
      'values' are values to be displayed in the dropdown
  */
   getInitialState: function() {
    return {
      values: [],
      selected: ''
    };
  },

  /** Updates the state variable selected when a satellite is clicked */
  updateSat: function(selected){
    //console.log(selected);
    this.props.update(selected);
  },

  /** Called when component is rendered, makes an api call to the url given when the class is rendered(this.props.source) */
  componentDidMount: function() {
    var url = this.props.source;
  console.log(url);

    var sats = [];
    $.getJSON(window.location.origin + this.props.source, function(results) {
      console.log('DROP DOWN SATELLITES API-DATA LENGTH: '+results.length);

        for(var i = 0; i <results.length; i++)
        {
          sats.push(results[i]._id);
        }

       sats = sats.sort();
 //     sats = results;

        this.setState({values: sats});
    }.bind(this));
  },
  /** Html provided to render this component
      Iterates over the state variable 'values' to create Wrapper List Item components.
      Gives each Wrapper Component this state's updateSat function and an element of 'values' to display
  */
  render: function() {
      var results = this.state.values;
      var btnClick = function(e) {
        //Stop the bar from automatically closing
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        //Show the modal
        var mod = document.getElementById('myModal');
        mod.style.display = 'block';
      };
      var options = <ul style={ddheight} className='horizontal scrollable' onClick={this.props.close}>
        {results.map(function(results, i) {
        return <Wrapper update={this.updateSat} key={i} data={results} />;
         }.bind(this))}
      </ul>;
      var header = <h2>Select a Satellite</h2>;
    return (
      <div>
        <Modal content={options} contentHeader={header}/>
        <ul style={ddheight} className='scrollable'>
          <button onClick={btnClick}>Open Modal</button>
          {results.map(function(results, i) {
          return <Wrapper update={this.updateSat} key={i} data={results} />;
           }.bind(this))}
        </ul>
      </div>
    );
  }
});

/* Dropdown DataType React component
    Displays a dropdown of Data Types by making an api call and then creating a Wrapper react component for each data type
*/
var DropDown_Types = React.createClass({
  /** Class' state variables
      'values' are values to be displayed in the dropdown
  */
   getInitialState: function() {
    return {
      values: [],
      selected: ''
    };
  },
  /** Updates the state variable selected when a data type is clicked */
  updateSite: function(selected){
    this.props.update(selected);
  },

  /** Called when component is rendered, makes an api call to the url given when the class is rendered(this.props.source) */
  componentDidMount: function() {
    var url = this.props.source;
    console.log(url);

    var types = [];
    $.getJSON(window.location.origin + this.props.source, function(results) {
        console.log('DROP DOWN DATA TYPE API-DATA LENGTH: '+results.length)


        for(var i = 0; i <results.length; i++)
        {
          types.push(results[i].type);
        }

       types = types.sort();
      //types = results;

        this.setState({values: types});


    }.bind(this));
  },
  /** Html provided to render this component
      Iterates over the state variable 'values' to create Wrapper List Item components.
      Gives each Wrapper Component this state's updateType function and an element of 'values' to display
  */
  render: function() {

      var results = this.state.values; //for results from db
      var btnClick = function(e) {
        //Stop the bar from automatically closing
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        //Show the modal
        var mod = document.getElementById('myModal');
        mod.style.display = 'block';
      };
      //var results = this.props.source;  //for results from source array
      var options = <ul style={ddheight} className='horizontal scrollable' onClick={this.props.close}>
        {results.map(function(results, i) {
        return <Wrapper update={this.updateSite} key={i} data={results} />;
         }.bind(this))}
      </ul>;
      var header = <h2>Select a Data type</h2>;
    return (
      <div>
        <Modal content={options} contentHeader={header} />
        <ul style={ddheight} className='scrollable'>
          <button onClick={btnClick}>Open Modal</button>
          {results.map(function(results, i) {
          return <Wrapper update={this.updateSite} key={i} data={results} />;
           }.bind(this))}
        </ul>
      </div>
    );
  }
});

//Modal React component
var Modal = React.createClass({

  componentDidMount: function() {
    //Remove existing Modal
    var existingModal = document.getElementById('myModal');
    if(existingModal != null){
      existingModal.remove();
    }

    //Outer Modal container
    this.modal = document.createElement('div');
    this.modal.id = 'myModal';//Internet explorer
    this.modal.setAttribute('id', 'myModal');//Firefox
    this.modal.className = 'modal';//IE
    this.modal.setAttribute('class', 'modal');//FF
    document.body.appendChild(this.modal);//attach modal to main body of page

    //Inner Modal Content
    this.modalContent = document.createElement('div');
    this.modalContent.className = 'modal-content';//IE
    this.modalContent.setAttribute('class', 'modal-content');//FF
    this.modal.appendChild(this.modalContent);

    //Modal Header
    this.modalHeader = document.createElement('div');
    this.modalHeader.className = 'modal-header';
    this.modalHeader.setAttribute('class', 'modal-header');
    this.modalContent.appendChild(this.modalHeader);

    //Close button
    //Gets added to the header section of modal
    var close = function() {
      var modal = document.getElementById('myModal');
      modal.style.display = 'none';
    }
    var exit = document.createElement('div');
    exit.className = 'close';//IE
    exit.setAttribute('class', 'close');//FF
    exit.onclick = function() {close();};//IE
    exit.innerHTML =  'x';
    this.modalHeader.appendChild(exit);

    //The div where the passed in header component is rendered to
    this.modalHeaderRender = document.createElement('div');
    this.modalHeader.appendChild(this.modalHeaderRender);

    //Modal Body
    this.modalBody = document.createElement('div');
    this.modalBody.className = 'modal-body';
    this.modalBody.setAttribute('class', 'modal-body');
    this.modalContent.appendChild(this.modalBody);

    //The div where the passed in components is rendered to
    this.modalRender = document.createElement('div');
    this.modalBody.appendChild(this.modalRender);

    //Modal Footer
    this.modalFooter = document.createElement('div');
    this.modalFooter.className = 'modal-footer';
    this.modalFooter.setAttribute('class', 'modal-footer');
    this.modalContent.appendChild(this.modalFooter);

    //The div where the passed in componenets is rendered to
    this.modalFooterRender = document.createElement('div');
    this.modalFooter.appendChild(this.modalFooterRender);

    this._renderLayer();
  },


  componentDidUpdate: function() {
    this._renderLayer();
  },


  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.modal);
    document.body.removeChild(this.modal);
  },


  _renderLayer: function() {
    React.render(this.props.content, this.modalRender);
    React.render(this.props.contentHeader, this.modalHeaderRender);
    if(this.props.contentFooter != null){
      React.render(this.props.contentFooter, this.modalFooterRender);
    }
  },


  render: function() {
    // Render a placeholder
    return React.DOM.div(this.props);
  }

});

/* Dropdown DataType React component
    Displays a dropdown of Transponders by making an api call and then creating a WrapperCheckbox react component for each transponder
*/
var DropDown_Trans = React.createClass({
  /** Class' state variables
      'values' are values to be displayed in the dropdown
  */
   getInitialState: function() {
    return {
      values: [],
      selected: ''
    };
  },

  /** Updates the state variable selected when a transponder is clicked */
  updateTran: function(selected){
    //console.log(selected);

    this.props.update(selected);
  },

  /** Called when component is rendered, makes an api call to the url given when the class is rendered(this.props.source) */
  componentDidMount: function() {
    var url = this.props.source;

    var trans = [];
    $.getJSON(window.location.origin + this.props.source, function(results) {
      console.log('DROP DOWN TRANSPONDERS API-DATA LENGTH: '+results.length)

        //Dictionary to convert txp_id to txp_num
        var txpLookup = new Array();
        for(var i = 0; i <results.length; i++)
        {
          if(trans.indexOf(results[i]._id.txp_num) < 0)
          {
            trans.push(results[i]._id.txp_num);
            txps.push({'num':results[i]._id.txp_num , 'id':results[i]._id.txp_id});
            txpLookup[txps[txps.length - 1].id + ""] = txps[txps.length - 1].num + "";
          }

        }
        //Store dictionary in document body
        var invisible = document.createElement('div');
        invisible.id = 'dictionary';
        invisible.setAttribute('id', 'dictionary');
        invisible.data = txpLookup;
        invisible.setAttribute('data', txpLookup);
        document.body.appendChild(invisible);
        
        trans = trans.sort();
        this.setState({values: trans});


    }.bind(this));

  },
  selectAll: function() {
    var selected = this.props.selected;
    var checkboxes = document.getElementsByClassName('filled-in');
    //Add all transponders to the array of selected transponders
    for (var i = 0; i < txps.length; i++){
      if(selected.indexOf(txps[i].id) < 0){
        selected.push(txps[i].id);
      }
    }
    //Check all checkboxes
    for(var i = 0; i < checkboxes.length; i++){
      checkboxes[i].checked = true;
    }
  },
  clearAll: function() {
    var selected = this.props.selected;
    var checkboxes = document.getElementsByClassName('filled-in');
    //Remove all transponders from array of selected
    selected.splice(0, selected.length);
    //Uncheck checkboxes
    for(var i = 0; i < checkboxes.length; i++){
      checkboxes[i].checked = false;
    }
  },
  /** Html provided to render this component
      Iterates over the state variable 'values' to create Wrapper Checkbox components.
      Gives each Wrapper Component this state's updateTran function and an element of 'values' to display
  */
  render: function() {
    var results = this.state.values;

    //Make the list items horizontal
    var options =
      (<ul className='horizontal scrollable'>
        {results.map(function(results, i) {
        return <Wrapper_Checkbox className='something' update={this.updateTran} key={i} data={results} selected={this.props.selected}/>;
      }.bind(this))}
      </ul>);
    var header = <div><h2>Select Transponder(s)</h2>
        <button onClick={this.selectAll}>Select All</button>
        <br/>
        <button onClick={this.clearAll}>Clear All</button></div>;
    var footer = <button onClick={this.props.remove}>Confirm</button>;

    var btnClick = function() {
      var mod = document.getElementById('myModal');
      mod.style.display = 'block';
    };
    return (
        <div>
        <Modal content={options} contentHeader={header} contentFooter={footer}/>
        <ul style={ddheight} className='scrollable'>
            <button onClick={btnClick}>
            Open Modal
            </button>
            <li onClick={this.props.remove}>
              Collapse
            </li>
            <li onClick={this.selectAll}>
              Select All
            </li>
            <li onClick={this.clearAll}>
              Clear All
            </li>

          {results.map(function(results, i) {
          return <Wrapper_Checkbox className='something' update={this.updateTran} key={i} data={results} selected={this.props.selected}/>;
           }.bind(this))}
        </ul>
        </div>
    );
  }
});


// DROP DOWN PROP ARRAY DATA-------------------------------------------------------------------

var DropDown_Props_Data = React.createClass({

    updateSelected: function(value){

    this.props.update(value);
  },

  render: function() {
    var results = this.props.source;
    return (

        <ul className='scrollable'>
          {results.map(function(results, i) {
            return <Wrapper update={this.updateSelected} key={i} data={results} />;
           }.bind(this))}
        </ul>


    );
  }
});

/* SignalNav React component
    Displays a nested nav menu for generating a rfcc signal graph
*/
var SignalNav = React.createClass({
 getInitialState: function() {
    return {
            siteDropdown: false,
            satelliteDropDown: false,
            typeDropdown: false,
            tranDropdown: false,
            site: '',
            satellite: '',
            tran: [],
            type: '',
            thres: this.getThres(),
            start_day: '',
            start_month: '',
            start_year: '',
            end_day: '',
            end_month: '',
            end_year: '',
            start:'',
            end:'',
            datatype_source: '/datatypes/get/',
            site_source: '/sites/',
            sat_source: '/sites',
            tran_source:'/sites/',
            data_source : ''
          };
  },

  getNowYear: function(){
    return new Date().getFullYear()
  },
  getNowDay: function(){
    return new Date().getDate()
  },
  getNowMonth: function(){
    return new Date().getMonth() + 1
  },
  getThres: function(){
    return '12'
  },
  /** Updates the site state variable and appends that value to the sat_source state variable for future api calls */
  updateSite: function(value){
    console.log(value);
    this.setState({site: value});
    this.setState({sat_source: '/sites/'+value+'/sats'});
  },
  /** Updates the satellite state variable and appends that value to the tran_source state variable for future api calls */
  updateSatellite: function(value){
    console.log(value);
    this.setState({satellite: value});
    this.setState({tran_source: '/sites/'+this.state.site+'/'+value+'/trans'});
  },
  /** Updates the tran array state variable by adding a checked transponder or removing an unchecked transponder */
  updateTran: function(value){
    var array = this.state.tran;
    var checked = null;
    if(this.state.tran.indexOf(value) > -1)
    {
      var index = this.state.tran.indexOf(value);
      this.state.tran.splice(index, 1);
      checked = false;
    }
    else
    {
      this.state.tran.push(value);
      checked = true;
    }
    var checkboxes = document.getElementsByClassName(value);
    checkboxes[1].checked = checked;//Only the 2nd one doesn't change automatically

  },
  /** Updates the type state variable  */
  updateType: function(value){
    this.setState({type: value});
  },
  /** Updates the threshold state variable */
  setStartDay: function(event){
     var value=event.target.value;
    this.setState({start_day: value});
  },
  /** Updates the start state variable */
  setStartMonth: function(event){
     var value=event.target.value;
    this.setState({start_month: value});
  },
  /** Updates the start year variable */
  setStartYear: function(event){
     var value=event.target.value;
    this.setState({start_year: value});
  },
  /** Updates the end state variable */
  setEndDay: function(event){
    var value=event.target.value;
    this.setState({end_day: value});
  },
  /** Updates the end state variable */
  setEndMonth: function(event){
    var value=event.target.value;
    this.setState({end_month: value});
  },
  /** Updates the end state variable */
  setEndYear: function(event){
    var value=event.target.value;
    this.setState({end_year: value});
  },
  /** Updates the state variable siteDropdown that when true, displays the dropdown list. when false, hide the siteDropdown*/
  siteDropdown: function(event) {
    this.setState({siteDropdown: !this.state.siteDropdown});
  },
  /** Updates the state variable satelliteDropdown that when true, displays the dropdown list. when false, hide the satelliteDropdown
    Only displays when a site has already been selected
  */
  satelliteDropdown: function(event) {
    if(this.state.site != '')
    {
      this.setState({satelliteDropdown: !this.state.satelliteDropdown});
    }
  },
  /** Updates the state variable typeDropdown that when true, displays the dropdown list. when false, hide the typeDropdown
      Only displays when a satellite has already been selected
  */
  typeDropdown: function(event) {
    if(this.state.satellite != '')
    {
      this.setState({typeDropdown: !this.state.typeDropdown});
    }
  },
  /** Updates the state variable tranDropdown that when true, displays the dropdown list. when false, hide the tranDropdown
      Only displays when a type has already been selected
  */
  tranDropdown: function(event) {
    if(this.state.type != '' && !this.state.tranDropdown)
    {
      this.setState({tranDropdown: !this.state.tranDropdown});
    }
  },
  /** Updates the state variable siteDropdown that when true, displays the dropdown list. when false, hide the siteDropdown*/
  closeTran: function(event)
  {
     this.setState({tranDropdown: !this.state.tranDropdown});
  },
  setEnd: function(){
    var e = this.state.end_year +'-'+ this.state.end_month+'-'+this.state.end_day;
    this.setState({end: e});

  },
  setStart: function(){
    var s = this.state.start_year +'-'+ this.state.start_month+'-'+this.state.start_day;
    this.setState({start:s});

  },
  AllEntered: function(){
    if(this.state.site != '' && this.state.satellite != '' && this.state.tran.length != 0 && this.state.type != '' && this.state.start_day != '' && this.state.start_month != '' && this.state.start_year != '' && this.state.end_day != '' && this.state.end_month != '' && this.state.end_year != '')
      return true
    else
      return false
  },
  CreateGraph: function(){
    if(this.AllEntered())
      {
       var e = this.state.end_year +'-'+ this.state.end_month+'-'+this.state.end_day;
        this.setState({end: e}, function(){
          var s = this.state.start_year +'-'+ this.state.start_month+'-'+this.state.start_day;
             this.setState({start:s}, function(){
               this.createSignalGraph();
             });


        });
      }

  },

  /** Creates a window-wide javascript event 'createSignalGraph' to trigger a graph to be created
      Passes this class' state data to event
      Called when generate graph button is clicked
  */
  createSignalGraph: function(event){


    //if every field is set
    if(this.AllEntered())
    {
      this.setEnd();
      this.setStart();

      var url = '/sites/'+this.state.site+'/trans?txpId='+this.state.tran[0];

      var ts = this.state.tran;

      var i =0;
    while(i < this.state.tran.length)
    {
        url = url + '&txpId='+this.state.tran[i];
        i++;
        console.log(url+'|||'+i);
    }

    url = url + '&dataType='+this.state.type.toLowerCase()+'&date1='+this.state.start+'&date2='+this.state.end;
    this.setState({data_source:url }, function(){

    console.log(this.state.data_source);

         if(this.state.data_source != '')
          {
            var myEvent = new CustomEvent("createSignalGraph", {detail: this.state});

            window.dispatchEvent(myEvent);

             console.log('created signalevent');
          }
          else
          {
            console.log('not ready yet');
          }
    });
    }
    else{
      console.log('enter all parameter');
    }
  },
  /** Provides HTML to render this component */
  render: function() {
    return (

 <ul className='hide-scrollbar'>

                    <li className='sm   ' onClick={this.siteDropdown}>
                      <a className="dropdown-buttons1 sm" href="#!" id='sdd1'>Site:  {this.state.site}
                           { this.state.siteDropdown ?<DropDown_Sites source={this.state.site_source} update={this.updateSite} close={this.siteDropdown}/> : null }
                      </a>
                    </li>


                     <li className='sm waves-att ' onClick={this.satelliteDropdown}>
                      <a className="dropdown-buttons2 sm" href="#!" id='sdd2'>Satellite: {this.state.satellite}
                        { this.state.satelliteDropdown ?<DropDown_Sats source={this.state.sat_source} update={this.updateSatellite} close={this.satelliteDropdown}/> : null }

                      </a>
                    </li>

                    <li className='sm waves-att ' onClick={this.typeDropdown}>
                      <a className="dropdown-buttons2 sm" href="#!" id='sdd2'>Data Type: {this.state.type}
                      { this.state.typeDropdown ?<DropDown_Types source={this.state.datatype_source} update={this.updateType} close={this.typeDropdown} /> : null}

                      </a>
                    </li>

                  <li className='sm waves-att ' onClick={this.tranDropdown} >
                      <a className="dropdown-buttons2 sm" href="#!" id='sdd2'>Transponders:
                         { this.state.tranDropdown ?<DropDown_Trans source={this.state.tran_source} update={this.updateTran} remove={this.closeTran} selected={this.state.tran}/> : null }

                      </a>
                    </li>
                  <li className='sm '>
                    <a  className='sm waves-effect waves-att h'> Start Date: <br/>
                    <ul className='horizontal hide-scrollbar'>
                      <input placeholder="MM" className="sm waves-effect waves-att " type="number"  min='01' max='12'  onChange={this.setStartMonth}/>
                      <input placeholder="DD" className="sm waves-effect waves-att " type="number"   min='01' max='31' id="sStartDay"  onChange={this.setStartDay}/>
                      <input placeholder="YYYY" className="sm year waves-effect waves-att " type="number"   min='1990' max={this.getNowYear()} id="sStartYear" onChange={this.setStartYear}/>

                    </ul>

                    </a>
                  </li>

                  <li className='sm'>
                    <a  className='sm waves-effect waves-att '>End Date: <br/>
                     <ul className='horizontal hide-scrollbar'>
                      <input placeholder="MM" className="textbox-n sm waves-effect waves-att " type="number" min='01' max='12'  id="sEndMonth" onChange={this.setEndMonth}/>
                      <input placeholder="DD" className="textbox-n sm waves-effect waves-att " type="number"  min='01' max='31'   id="sEndDay" onChange={this.setEndDay}/>
                      <input placeholder="YYYY" className="textbox-n sm year waves-effect waves-att " type="number" min='1990' max={this.getNowYear()} id="sEndYear" onChange={this.setEndYear}/>
                      </ul>
                    </a>
                  </li>
                  <li className='sm waves-effect waves-att  blue-button text-button' >
                      <a className="sm center-align text-button" href="#!"  id="generate"  onClick={this.CreateGraph}>Generate Graph
                      </a>
                    </li>
                </ul>


    );
  }
});

/** SideNav React Class
  This class contains logic and view information to generate the basic left navigation menu
  While simiar to LeftNav.js' SideNav, this SideNav includes the SignalNav
 */
var SideNav = React.createClass({
  getInitialState: function() {
    return { username: "Employee"};
  },
  componentDidMount: function() {
    var that = this;
    $.getJSON(window.location.origin + '/username', function (user) {
        that.setState({username:user.username})
    });
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
        <div className='center-align'>Welcome, {this.state.username}! </div>

            <li >
                <a className="collapsible-header  waves-effect waves-att bold" href='/home'>Dashboard</a>
            </li>

            <li ><a className="collapsible-header  waves-effect waves-att bold" href='/archive'>Archive</a>
            </li>

    {/*  ----------------- AVAILABILITY NAV ----------------- */}
    {/*
            <li >

               <a className="collapsible-header  waves-effect waves-att bold" onClick={this.showAvailNav} >Availability</a>
                 { this.state.showAvailNav ?<AvailabilityNav/> : null }
            </li>

      */}

       {/*----------------- SIGNAL TO NOISE NAV ------------------*/}
            <li>

              <a className="collapsible-header  waves-effect waves-att bold" href=''>RFCC Data Grapher</a>

               <SignalNav/>
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

/** Renders a react component. In this case, the SideNav component within the 'leftSide' DOM element*/
ReactDOM.render(
  <SideNav/>,
  document.getElementById('leftSide')
);
