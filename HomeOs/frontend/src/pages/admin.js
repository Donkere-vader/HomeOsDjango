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
            path: []
        }

        this.valuesInDict = 0;
        
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

    keyValueChange() {
        console.log(this.valuesInDict);

        var value = "";
        if (value === "false") {
            value = false;
        } else if (value === "true") {
            value = true;
        } else if (!isNaN(Number(value))) {
            value = Number(value);
        }
        
        var obj = this.getCurrentKeys();
    }

    newItem() {

    }

    save() {

    }

    render() {
        var key_list = [];
        var ths = this;

        var keys = this.getCurrentKeys();

        var idx = 0;
        Object.keys(keys).forEach(function(key) {
            var i = idx;
            if (typeof keys[key] ===  "object") {
                key_list.push(
                    <div key={ i } className="key_option" >
                        <span>{ key }</span>
                        <img src={getIcon("arrow_right", "white") } alt="" onClick={ function() {
                        ths.state.path.push(key);
                        ths.setState({
                            path: ths.state.path,
                        });
                    } }/>
                    </div>
                );
            } else {
                key_list.push(
                    <div key={ i } className="key_input" >
                        <input type="text" name={ `key_input_${key}` } id={ `key_input_${key}` } defaultValue={ key }  onChange={ ths.keyValueChange } />
                        <span>=</span>
                        <input type="text" name={ `value_input_${key}` } id={ `value_input_${key}` } defaultValue={ keys[key] }  onChange={ ths.keyValueChange } />
                    </div>
                );
            }
            idx += 1;
        });
        this.valuesInDict = idx;

        if (!("New key" in keys)) {
            key_list.push(
                <div className="key_option new_item" onClick={ this.newItem }>
                    <img src={ getIcon("add", "white") } alt=""/>
                    <span>New item</span>
                </div>
            );
        }

        return (
            <div className="admin_page">
                <div className="browse_header">
                    <img src={ getIcon("home", "white") } alt="" onClick={ function() {
                        ths.save();
                        ths.setState({
                            path: [],
                        });
                    }}/>
                    <img src={ getIcon("arrow_left", "white") } alt="" onClick={ function() {
                        ths.save();
                        ths.state.path.splice(-1,1);
                        ths.setState({
                            path: ths.state.path,
                        });
                    }}/>
                </div>
                <div className="key_list">
                    { key_list }
                </div>
                <div id="floating_action_button" onClick={ this.save }>
                    <img src={ getIcon("save", "white") } alt=""/>
                </div>
            </div>
        )
    }
}

export default Admin;
