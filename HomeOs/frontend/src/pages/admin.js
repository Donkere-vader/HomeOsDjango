import React, { Component }  from 'react';
import getIcon from '../scripts/get_icon';
import '../static/css/admin.css';
import $ from 'jquery';


class Admin extends Component {
    constructor(props) {
        super();

        this.state = {
            databaseObj: {
                "hello": 1,
                "hello2": {
                    "world": {
                        "people": 17000000000,
                        "what": "yes",
                    },
                    "poep": false
                }
            },
            path: [],
            changes: false,
        }
        
        this.getCurrentKeys = this.getCurrentKeys.bind(this);
        this.keyValueChange = this.keyValueChange.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {

    }

    getCurrentKeys() {
        var obj = this.state.databaseObj;

        this.state.path.forEach(function(path_item) {
            obj = obj[path_item]
        });

        return obj;
    }

    keyValueChange(key) {
        var value = $(`#key_input_${key}`).val()

        if (value === "false") {
            value = false;
        } else if (value === "true") {
            value = true;
        } else if (!isNaN(Number(value))) {
            value = Number(value);
        }

        this.getCurrentKeys()[key] = value;
        this.setState({
            changes: true,
        });
    }

    save() {

    }

    render() {
        var key_list = [];
        var ths = this;

        var keys = this.getCurrentKeys();

        Object.keys(keys).forEach(function(key) {
            if (typeof keys[key] ===  "object") {
                key_list.push(
                    <div key={ key } className="key_option" onClick={ function() {
                        ths.state.path.push(key);
                        ths.setState({
                            path: ths.state.path,
                        });
                    } }>
                        <span>{ key }</span>
                        <img src={getIcon("arrow_right", "white") } alt=""/>
                    </div>
                );
            } else {
                key_list.push(
                    <div key={ key } className="key_input" >
                        <span>{ key }</span>
                        <input type="text" name={ `key_input_${key}` } id={ `key_input_${key}` } defaultValue={ keys[key] }  onChange={
                            function() {
                                ths.keyValueChange(key);
                            }
                        } />
                    </div>
                );
            }
        });

        return (
            <div className="admin_page">
                <div className="browse_header">
                    <img src={ getIcon("home", "white") } alt="" onClick={ function() {
                        ths.setState({
                            path: [],
                        });
                    }}/>
                    <img src={ getIcon("arrow_left", "white") } alt="" onClick={ function() {
                        ths.state.path.splice(-1,1);
                        ths.setState({
                            path: ths.state.path,
                        });
                    }}/>
                </div>
                <div className="key_list">
                    { key_list }
                </div>
                { this.state.changes && 
                <div id="floating_action_button" onClick={ this.save }>
                    <img src={ getIcon("save", "white") } alt=""/>
                </div> }
            </div>
        )
    }
}

export default Admin;
