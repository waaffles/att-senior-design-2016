var AdminForm = React.createClass({

  getInitialState: function() {
    return {
      esno: {},
      cnr:{},
      mer:{},
      eff_freq:{},
      power:{},
      fail: false,
      success: false

    };
  },
  componentWillMount: function(){
     var that = this;
    $.getJSON(window.location.origin + '/thresholds/cnr', function (data) {
        console.log(data[0]);
        that.setState({cnr:data[0]})
    });

     var that = this;
    $.getJSON(window.location.origin + '/thresholds/power', function (data) {
      console.log(data[0]);
        that.setState({power:data[0]})
    });

     var that = this;
    $.getJSON(window.location.origin + '/thresholds/mer', function (data) {
      console.log(data[0]);
        that.setState({mer:data[0]})
    });

     var that = this;
    $.getJSON(window.location.origin + '/thresholds/esno', function (data) {
      console.log(data[0]);
        that.setState({esno:data[0]})
    });

     var that = this;
    $.getJSON(window.location.origin + '/thresholds/eff_freq', function (data) {
      console.log(data[0]);
        that.setState({eff_freq:data[0]})
    });

  },

  setVal: function(event){
    var value= event.target.value;
    var type = event.target.id;
    console.log(type+value);
    this.setState({type: value});

    if(type == "cnr_low_d")
      this.state.cnr.lowerDanger = value;
    else if (type == "cnr_low_w")
      this.state.cnr.lowerWarning = value;
    else if (type == "cnr_up_w")
      this.state.cnr.upperWarning = value;
    else if (type == "cnr_up_d")
      this.state.cnr.upperDanger = value;
    else if(type == "esno_low_d")
      this.state.esno.lowerDanger = value;
    else if (type == "esno_low_w")
      this.state.esno.lowerWarning = value;
    else if (type == "esno_up_w")
      this.state.esno.upperWarning = value;
    else if (type == "esno_up_d")
      this.state.esno.upperDanger = value;
    else if(type == "power_low_d")
      this.state.power.lowerDanger = value;
    else if (type == "power_low_w")
      this.state.power.lowerWarning = value;
    else if (type == "power_up_w")
      this.state.power.upperWarning = value;
    else if (type == "power_up_d")
      this.state.power.upperDanger = value;
    else if(type == "mer_low_d")
      this.state.mer.lowerDanger = value;
    else if (type == "mer_low_w")
      this.state.mer.lowerWarning = value;
    else if (type == "mer_up_w")
      this.state.mer.upperWarning = value;
    else if (type == "mer_up_d")
      this.state.mer.upperDanger = value;
    else if(type == "ef_low_d")
      this.state.eff_freq.lowerDanger = value;
    else if (type == "ef_low_w")
      this.state.eff_freq.lowerWarning = value;
    else if (type == "ef_up_w")
      this.state.eff_freq.upperWarning = value;
    else if (type == "ef_up_d")
      this.state.eff_freq.upperDanger = value;



  },
  save: function(event){
    var id = event.target.id;

    if (id =="cnr")
    {
      this.saveType("cnr");
    }
    else if (id == "ef")
    {
      this.saveType("eff_freq");
    }
    else if (id == "esno")
    {
      this.saveType("esno");
    }
    else if (id == "mer")
    {
      this.saveType("mer");
    }
    else if (id == "power")
    {
      this.saveType("power");
    }

  },
  saveType: function(type){
    var that = this;
    var levels = ["lowerDanger", "lowerWarning", "upperWarning", "upperDanger"];
    var ok = true;


    levels.forEach(function(level, index){
      if (index +1 == levels.length)
      {
        that.done(ok);
      }

      var obj = {"type":that.state[type].type};
      obj[level] = that.state[type][level];
      console.log(obj);

       $.ajax({
            url: '/admin/updateDataType',
            type: 'post',
            dataType: 'json',
            data:obj,
            success: function (data) {
              if (data.ok != 1)
                ok = false;

            },
        });
    });


    

  },
  done: function(status){
    console.log(status);
    if (status)
    {

      this.setState({success: true});
      this.setState({fail: false});
      var that = this;
      setTimeout(function () {
            that.setState({success: false});
      }, 5000);
    }
    else
    {
      this.setState({success: false});
      this.setState({fail: true});
      var that = this;
      setTimeout(function () {
            that.setState({fail: false});
      }, 5000);
    }

  },
  render: function() {


    return (

    <div className='center-align container'>
      <h4 className='center-align'>Thresholds:</h4>
      <table className='striped'>
        <thead>
          <tr>
              <th data-field="type">Type:</th>
              <th data-field="lowerDanger">Lower Danger</th>
              <th data-field="lowerWarning">Lower Warning</th>
              <th data-field="upperWarning">Upper Warning</th>
              <th data-field="upperDanger">Upper Danger</th>
              <th data-field="save">Save</th>
          </tr>
        </thead>


          
        <tbody>
          <tr>
            <td>
              CNR:
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="cnr_low_d" value={this.state.cnr.lowerDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="cnr_low_w" value={this.state.cnr.lowerWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="cnr_up_w" value={this.state.cnr.upperWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="cnr_up_d" value={this.state.cnr.upperDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input type="submit" value="save"  id="cnr" onClick={this.save}/>
            </td>

          </tr>

           <tr>
            <td>
              Effective Frequency:
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="ef_low_d" value={this.state.eff_freq.lowerDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="ef_low_w" value={this.state.eff_freq.lowerWarning} onChange={this.setVal}/>
            </td>
            <td>
               <input  className="sm waves-effect waves-att validate" type="number" id="ef_up_w" value={this.state.eff_freq.upperWarning} onChange={this.setVal}/>
            </td>
            <td>
               <input  className="sm waves-effect waves-att validate" type="number" id="ef_up_d" value={this.state.eff_freq.upperDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input type="submit" value="save"  id="ef" onClick={this.save}/>
            </td>

          </tr>

           <tr>
            <td>
              ESNO:
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="esno_low_d" value={this.state.esno.lowerDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="esno_low_w" value={this.state.esno.lowerWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="esno_up_w" value={this.state.esno.upperWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="esno_up_d" value={this.state.esno.upperDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input type="submit" value="save"  id="esno" onClick={this.save}/>
            </td>

          </tr>

           <tr>
            <td>
              MER:
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="mer_low_d" value={this.state.mer.lowerDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="mer_low_w" value={this.state.mer.lowerWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="mer_up_w" value={this.state.mer.upperWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="mer_up_d" value={this.state.mer.upperDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input type="submit" value="save"  id="mer" onClick={this.save}/>
            </td>

          </tr>

           <tr>
            <td>
              POWER:
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="power_low_d" value={this.state.power.lowerDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="power_low_w" value={this.state.power.lowerWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="power_up_w" value={this.state.power.upperWarning} onChange={this.setVal}/>
            </td>
            <td>
              <input  className="sm waves-effect waves-att validate" type="number" id="power_up_d" value={this.state.power.upperDanger} onChange={this.setVal}/>
            </td>
            <td>
              <input type="submit" value="save"  id="power" onClick={this.save} />
            </td>

          </tr>
          
          


        </tbody>
      </table>

        <div className="center-align">
        { this.state.fail ? <p>Error Saving</p> : null }
        { this.state.success ? <p> Successfully Saved</p> : null }
      </div>

    </div>  

     




    );
  }
});



ReactDOM.render(
  <AdminForm/>,
  document.getElementById('content')
);
