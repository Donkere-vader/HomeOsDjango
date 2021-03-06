// Wow this so bad code...
// Yeah It's not the best I've ever written.
// BUT IT WORKS! >:(

import React, { Component }  from 'react';
import getIcon from '../scripts/get_icon';
import '../static/css/admin.css';
import $ from 'jquery';
import { get, post } from '../scripts/server';


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
            parentValueType: "",
        }

        this.valuesInDict = 0;
        
        this.getCurrentKeys = this.getCurrentObj.bind(this);
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

    getCurrentObj() {
        var obj = this.state.databaseObj;

        this.state.path.forEach(function(path_item) {
            obj = obj[path_item]
        });

        return obj;
    }

    keyValueChange(idx) {
        console.log(idx);
        var key = $(`#key_input_${ idx }`).val();

        var value;
        var new_value;
        if (this.state.editingValueType === "dict") {
            value = {};
        } else if (this.state.editingValueType === "array") {
            value = [];
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

        var obj = this.getCurrentObj();

        if ((this.state.editingValueType === "array" || this.state.editingValueType === "dict") && obj[this.state.editingKey].constructor === this.state.editingValueType) {
            obj[key] = obj[this.state.editingKey];
        } else if (this.state.parentValueType === "array") {
            this.deleteItem();
            obj.push(value);
        } else {
            obj[key] = value;
        }

        if (key !== this.state.editingKey) {
            delete obj[this.state.editingKey];
        }
    }

    newItem() {
        var obj = this.getCurrentObj();

        var value = "";
        var key = "key";
        var num = 0;
        while (key in obj) {
            num += 1;
            key = `key (${num})`;
        }

        console.log("editingParentValueType", this.state.parentValueType);
        if (this.state.parentValueType === "dict") {
            obj[key] = value;
        } else {
            obj.push(key);
        }

        this.setState({
            editingIdx: this.valuesInDict,
            editingKey: key,
            editingValue: value,
            editingIsNew: true,
            editingValueType: "value",
        });

        console.log(key);
        console.log(obj);
    }

    deleteItem() {
        var obj = this.getCurrentObj();
        
        if (this.state.parentValueType === "dict") {
            delete obj[this.state.editingKey];
        } else if (this.state.parentValueType === "array") {
            obj.splice(obj.indexOf(this.state.editingValue), 1);
        }
    }

    save() {
        console.log("saving");
        post(
            "/admin",
            {
                "db_obj": JSON.stringify(this.state.databaseObj),
            },
            function(data) {
                console.log(data);
            }
        );
    }

    render() {
        var key_list = [];
        var ths = this;

        var obj = this.getCurrentObj();
        var parentType;

        if (obj.constructor === Array) {
            parentType = "array";
        } else if (obj.constructor === Object) {
            parentType = "dict";
        }

        var values;
        if (parentType === "array") {
            values = obj;
        } else if (parentType === "dict") {
            values = Object.keys(obj);
        }

        // Must ignore otherwise it will end up in a infinite render loop
        // eslint-disable-next-line
        this.state.parentValueType = parentType;

        var idx = 0;
        values.forEach(function(k) {
            var i;
            if (parentType === "dict") {
                i = `${ths.state.path.join("")}${k}`;
            } else {
                i = `${ths.state.path.join("")}${ idx }`;
            }

            var key = k;

            var value;
            if (parentType === "dict") {
                value = obj[k];

                var valueType;

                if (value.constructor === Array) {
                    valueType = "array";
                } else if (value.constructor === Object) {
                    valueType = "dict";
                } else {
                    valueType = "value";
                }
            } else {
                value = key;
            }
            

            if (ths.state.editingIdx === i) {
                value = ths.state.editingValue;

                if (parentType === "dict") {
                    key = ths.state.editingKey;
                    valueType = ths.state.editingValueType;
                }
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
                            editingValueType: valueType,
                            editingParentValueType: parentType,
                        });
                    }}>
                        <span>{ (parentType === "dict" ? key : value) }</span>
                        { valueType === "value" && 
                            <p>=</p>
                        }
                        { valueType === "value" && 
                        <span>{ value.toString() }</span>
                        }
                        { (valueType === "array" || valueType === "dict") && 
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
                            { parentType !== "array" && 
                                <input type="text" autoFocus id={ `key_input_${ i }` } defaultValue={ key } />
                            }
                            { valueType === "value" && 
                                <p>=</p>
                            }
                            { (valueType === "value" || parentType === "array") &&
                                <input type="text" id={ `value_input_${ i }` } defaultValue={ value } />
                            }
                        </div>
                        { parentType === "dict" && 
                            <div className="checkboxes">
                                <div>
                                    <input type="radio" name={ `radio_${ i }` } id={ `checkbox_object_${ i }` } checked={ valueType === "dict"} onChange={ function() {
                                        ths.setState({
                                            editingValueType: "dict",
                                            editingValue: {},
                                        });
                                    }} />
                                    <p>Dict</p>
                                </div>
                                <div>
                                    <input type="radio" name={ `radio_${ i }` } id={ `checkbox_value_${ i }` } checked={ valueType === "array"} onChange={ function() {
                                        ths.setState({
                                            editingValueType: "array",
                                            editingValue: [],
                                        });
                                    }} />
                                    <p>Array</p>
                                </div>
                                <div>
                                    <input type="radio" name={ `radio_${ i }` } id={ `checkbox_value_${ i }` } checked={ valueType === "value"} onChange={ function() {
                                        ths.setState({
                                            editingValueType: "value",
                                            editingValue: "",
                                        });
                                    }} />
                                    <p>Value</p>
                                </div>
                            </div> 
                        }
                        <div>
                            <button className="delete" onClick={ function() {
                                ths.deleteItem();
                                ths.setState({
                                    editingIdx: -1,
                                });
                                ths.save();
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
                                ths.save();
                            } }>Ok</button>
                        </div>
                    </div>
                </div>
            );

            idx += 1;
        });
        this.valuesInDict = idx;

        if (!("New key" in obj)) {
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
                        ths.setState({
                            editingIdx: -1,
                            path: [],
                        });
                    }}/>
                    <div className="path_info">
                        <span className="path">{ `/${this.state.path.join("/")}` }</span>
                        <span>{ this.state.parentValueType }</span>
                    </div>
                    <img src={ getIcon("arrow_left", "white") } alt="" onClick={ function() {
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
