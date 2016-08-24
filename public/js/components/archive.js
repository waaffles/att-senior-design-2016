const {Table, Column, Cell} = FixedDataTable;
//var alerts = [];
var windowWidth = $(window).width()-240;
var tableHeight = $(window).height();



var ResolveButton = React.createClass({
    getInitialState: function() {
        return {resolved: this.props.data[this.props.rowIndex]["resolved"],
                comment: this.props.data[this.props.rowIndex]["comment"]
        };
    },

    handleCommentChange: function(e) {
        this.setState({comment: e.target.value});
    },

    resolve: function(event) {
        
        var index = this.props.rowIndex;
        var that = this; //proxy
        var data = {
            alertUpdates: {
                "_id": this.props.data[index]["_id"],
                "comment": that.state.comment,
                "resolved": !that.state.resolved
            }
        }

        $.ajax({
            url: window.location.origin + "/alerts/update",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                onComplete(data);
            }
        });

        function onComplete(data){//code executes once ajax request is successful
            that.setState({resolved: !that.state.resolved});
        }
    },

    render: function() {
        var text = this.state.resolved ? 'Resolved' : 'Not Resolved';
        const {rowIndex, field, data, ...props} = this.props;
        return (
            <div>
                <input
                    className="resolve-comment"
                    type="text"
                    placeholder={this.props.data[this.props.rowIndex]["comment"]}
                    //value={this.props.data[this.props.rowIndex]["comment"]}
                    onChange={this.handleCommentChange}
                    size="10"
                />
                <p className="resolve-button" onClick={this.resolve}>
                    {text}.
                </p>
            </div>
      
        );
    }
});


const DateCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col].toLocaleString()}
  </Cell>
);

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

const NullCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data}
  </Cell>
);

var AlertTable = React.createClass({

    getInitialState: function() {
        return {dataList: []};
    },

    componentWillMount: function() {
      this.getAllAlerts();
    },

    getAllAlerts: function() {
        var tableAlerts = this.state.dataList;
        var that = this; //proxy

        $.ajax({
            type: "GET",
            dataType: "json",
            url: window.location.origin + "/alerts/all",
            success: function(data) {
                setDataListOnComplete(data);
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.status);
            }           
        });

        function setDataListOnComplete(data){//code executes once ajax request is successful
            that.setState({ dataList: data});
        }
    },

    render: function() {
        var {dataList} = this.state;
       
       console.log(dataList.length + " alert(s) were found");
        if (dataList.length == 0) {
            return (
                <div>
                    <Table
                        rowHeight={50}
                        headerHeight={50}
                        rowsCount={1}
                        width={windowWidth}
                        height={100}
                        {...this.props}>
                        
                        <Column
                          header={<Cell>Site</Cell>}
                          cell={<NullCell/>}
                          fixed={true}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Sat.</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Txp.</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={windowWidth * 0.08}
                        />
                        <Column
                          header={<Cell>Type</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Threshold</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={windowWidth * 0.10}
                        />
                        <Column
                          header={<Cell>Value</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Category</Cell>}
                          cell={<NullCell/>}
                          fixed={false}
                          width={windowWidth * 0.08}
                        />
                        <Column
                          header={<Cell>Time</Cell>}
                          cell={<NullCell/>}
                          width={windowWidth * 0.20}
                        />
                        
                        <Column
                          header={<Cell>Resolve</Cell>}
                          cell={<NullCell data={"No alerts found"} />}
                          fixed={false}
                          width={windowWidth * 0.30}
                        />      
                    </Table>
                </div>
            );
        } else {
            return(
                <div> 
                    <Table
                        rowHeight={50}
                        headerHeight={50}
                        rowsCount={dataList.length}
                        width={windowWidth}
                        height={tableHeight}
                        {...this.props}>
                        
                        <Column
                          header={<Cell>Site</Cell>}
                          cell={<TextCell data={dataList} col="site"/>}
                          fixed={true}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Sat.</Cell>}
                          cell={<TextCell data={dataList} col="sat"/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Txp.</Cell>}
                          cell={<TextCell data={dataList} col="transponder"/>}
                          fixed={false}
                          width={windowWidth * 0.08}
                        />
                        <Column
                          header={<Cell>Type</Cell>}
                          cell={<TextCell data={dataList} col="data_type"/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Threshold</Cell>}
                          cell={<TextCell data={dataList} col="threshold"/>}
                          fixed={false}
                          width={windowWidth * 0.10}
                        />
                        <Column
                          header={<Cell>Value</Cell>}
                          cell={<TextCell data={dataList} col="current_value"/>}
                          fixed={false}
                          width={windowWidth * 0.06}
                        />
                        <Column
                          header={<Cell>Category</Cell>}
                          cell={<TextCell data={dataList} col="category"/>}
                          fixed={false}
                          width={windowWidth * 0.08}
                        />
                        <Column
                          header={<Cell>Time</Cell>}
                          cell={<DateCell data={dataList} col="created_on" />}
                          width={windowWidth * 0.20}
                        />
                        
                        <Column
                          header={<Cell>Resolve</Cell>}
                          cell={<ResolveButton data={dataList} />}
                          fixed={false}
                          width={windowWidth * 0.30}
                        />      
                    </Table>
                </div>
            );
        }
    }
});

ReactDOM.render(
    <div>
        <AlertTable/>
    </div>,
    document.getElementById('archive-table-div')
);