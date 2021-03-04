import React, { Component }  from 'react';
import getIcon from '../scripts/get_icon';
import '../static/css/admin.css';


class Admin extends Component {
    constructor(props) {
        super();

        this.state = {
            databaseObj: {
                "hello": 1,
                "hello2": {
                    "world": "yes",
                    "poep": false
                }
            },
            path: []
        }
        
        this.getCurrentKeys = this.getCurrentKeys.bind(this);
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

    render() {
        console.log(this.state.path);
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
                        <input type="text" name={ `key_input_${key}` } id={ `key_input_${key}` } defaultValue={ keys[key] } />
                    </div>
                );
            }
        });

        return (
            <div className="admin_page">
                <div className="header">
                    <img src={ getIcon("arrow_right", "white") } alt="" onClick={ function() {
                        ths.state.path.splice(-1,1);
                        ths.setState({
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
