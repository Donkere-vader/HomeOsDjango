// Wow this so bad code...
// Yeah It's not the best I've ever written.
// BUT IT WORKS! >:(

import React, { Component }  from 'react';
import getIcon from '../scripts/get_icon';
import '../static/css/admin.css';
import $ from 'jquery';
import { get } from '../scripts/server';


class Admin extends Component {
    constructor(props) {
        super();

        this.state = {
            databaseObj: {
                "hello": 1,
                "hello2": "test",
                "hello3": {
                    "world": {
                        "people": 17000000000,
                        "what": "yes",
                    },
                    "poep": false
                }
            },
            path: [],
            editingIsNew: false,
            editingIdx: -1,
            editingKey: "",
            editingValue: "",
            editingIsObject: "",
        }

        this.valuesInDict = 0;
        
        this.getCurrentKeys = this.getCurrentKeys.bind(this);
        this.keyValueChange = this.keyValueChange.bind(this);
        this.newItem = this.newItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        var ths = this;

        get(
            "/admin",
            {},
            function(data) {
                if ('database' in data) {
                    ths.setState({
                        databaseObj: data['database'],
                    });
                }
            }
        );
    }

    getCurrentKeys() {
        var obj = this.state.databaseObj;

        this.state.path.forEach(function(path_item) {
            obj = obj[path_item]
        });

        return obj;
    }

    keyValueChange(idx) {
        var key = $(`#key_input_${ idx }`).val();

        var value;
        var new_value;
        if (this.state.editingIsObject) {
            value = {};
        } else {
            value = $(`#value_input_${ idx }`).val();

            if (value === "false") {
                new_value = false;
            } else if (value === "true") {
                new_value = true;
            } else if (!isNaN(Number(value))) {
                new_value = Number(value);
            } else {
                new_value = value;
            }
            if (value === "") {
                new_value = "";
            }
            value = new_value;
        }

        var obj = this.getCurrentKeys();

        if (this.state.editingIsObject && typeof obj[this.state.editingKey] === "object") {
            obj[key] = obj[this.state.editingKey];
        } else {
            obj[key] = value;
        }

        if (key !== this.state.editingKey) {
            delete obj[this.state.editingKey];
        }
    }

    newItem() {
        var obj = this.getCurrentKeys();

        var value = "";
        var key = "key";
        var num = 0;
        while (key in obj) {
            num += 1;
            key = `key (${num})`;
        }

        obj[key] = value;

        this.setState({
            editingIdx: this.valuesInDict,
            editingKey: key,
            editingValue: value,
            editingIsNew: true,
            editingIsObject: false,
        });
    }

    deleteItem() {
        var obj = this.getCurrentKeys();
        delete obj[this.state.editingKey];
    }

    save() {

    }

    render() {
        var key_list = [];
        var ths = this;

        var keys = this.getCurrentKeys();

        var idx = 0;
        Object.keys(keys).forEach(function(k) {
            var i = `${ths.state.path.join("")}${k}`;

            var key = k;
            var value = keys[k];
            var isObject = (typeof value === "object");

            if (ths.state.editingIdx === i) {
                key = ths.state.editingKey;
                value = ths.state.editingValue;
                isObject = ths.state.editingIsObject;
            }

            key_list.push(
                <div key={ i } className={ "key_option" + (ths.state.editingIdx === i ? " editing" : "") }>
                    { ths.state.editingIdx !== i && 
                    <div className="info" onClickCapture={ function (event) {
                        if (event.target.localName === "img") {
                            return;
                        }

                        ths.setState({
                            editingIsNew: false,
                            editingIdx: i,
                            editingKey: key,
                            editingValue: value,
                            editingIsObject: isObject,
                        });
                    }}>
                        <span>{ key }</span>
                        { !isObject && 
                            <p>=</p>
                        }
                        { !isObject && 
                        <span>{ value.toString() }</span>
                        }
                        { isObject && 
                        <img src={ getIcon("arrow_right", "white") } alt="" onClick={
                            function() {
                                ths.state.path.push(key);
                                ths.setState({
                                    editingIdx: -1,
                                    path: ths.state.path
                                })
                            }
                        } />
                        }
                    </div>
                    }
                    <div className="input">
                        <div>
                            <input type="text" autoFocus id={ `key_input_${ i }` } defaultValue={ key } />
                            { !isObject && 
                                <p>=</p>
                            }
                            { !isObject &&
                            <input type="text" id={ `value_input_${ i }` } defaultValue={ value } />
                            }
                        </div>
                        <div className="checkboxes">
                            <div>
                                <input type="radio" name={ `radio_${ i }` } id={ `checkbox_object_${ i }` } checked={ isObject } onChange={ function() {
                                    ths.setState({
                                        editingIsObject: true,
                                        editingValue: {},
                                    });
                                }} />
                                <p>Object</p>
                            </div>
                            <div>
                                <input type="radio" name={ `radio_${ i }` } id={ `checkbox_value_${ i }` } checked={ !isObject } onChange={ function() {
                                    ths.setState({
                                        editingIsObject: false,
                                        editingValue: "",
                                    });
                                }} />
                                <p>Value</p>
                            </div>
                        </div>
                        <div>
                            <button className="delete" onClick={ function() {
                                ths.deleteItem();
                                ths.setState({
                                    editingIdx: -1,
                                });
                            } }>Delete</button>
                            <button onClick={ function() {
                                ths.setState({
                                    editingIdx: -1,
                                });
                            } }>Cancel</button>
                            <button onClick={ function() {
                                ths.keyValueChange(i);
                                ths.setState({
                                    editingIdx: -1,
                                });
                            } }>Ok</button>
                        </div>
                    </div>
                </div>
            );

            idx += 1;
        });
        this.valuesInDict = idx;

        if (!("New key" in keys)) {
            key_list.push(
                <div key={ idx } className="key_option new_item" onClick={ this.newItem }>
                    <div className="info">
                        <img src={ getIcon("add", "white") } alt=""/>
                        <span>New item</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="admin_page">
                <div className="browse_header">
                    <img src={ getIcon("home", "white") } alt="" onClick={ function() {
                        ths.save();
                        ths.setState({
                            editingIdx: -1,
                            path: [],
                        });
                    }}/>
                    <span>{ `/${this.state.path.join("/")}` }</span>
                    <img src={ getIcon("arrow_left", "white") } alt="" onClick={ function() {
                        ths.save();
                        ths.state.path.splice(-1,1);
                        ths.setState({
                            editingIdx: -1,
                            path: ths.state.path,
                        });
                    }}/>
                </div>
                <div className="key_list">
                    { key_list }
                </div>
            </div>
        )
    }
}

export default Admin;
