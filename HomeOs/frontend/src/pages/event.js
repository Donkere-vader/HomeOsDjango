import React, { Component } from 'react';
import { get, post } from '../scripts/server';
import $ from 'jquery';
import arrayRemove from '../scripts/remove_array';
import DeviceListCard from '../components/device_list_card';
import readSnakeCase from '../scripts/read_snak_case';
import getIcon from '../scripts/get_icon';


function ActionDataRow({id, k, value, event}) {
    return (
        <div className="action_data_row">
            <input type="text" name={ `action_data_${ id }_key` } id={ `action_data_${ id }_key_input` } value={ k } onChange={ event.setActionData } />
            <input type="text" name={ `action_data_${ id }_value` } id={ `action_data_${ id }_value_input` } value={ value } onChange={ event.setActionData } />
        </div>
    )
}


class Event extends Component {
    constructor({match}) {
        super();

        this.event_id = match.params.event_id;
        
        this.state = {
            name: "Loading...",
            eventName: "Loading...",
            enabled: false,
            time: {
                hour: 0,
                minute: 0,
            },
            hour: 0,
            minute: 0,
            weekdays: [],
            devices: [],
            deviceObjs: {},
            action_data: {},
            actionData: {},
            editingName: false,
        }

        this.weekday_lets = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        this.action_data_ids = [];

        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.setTime = this.setTime.bind(this);
        this.setWeekday = this.setWeekday.bind(this);
        this.getDevicesInfo = this.getDevicesInfo.bind(this);
        this.selectDevice = this.selectDevice.bind(this);
        this.setAction = this.setAction.bind(this);
        this.setActionData = this.setActionData.bind(this);
        this.setEventName = this.setEventName.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    componentDidMount() {
        var event = this;

        get(
            "/event",
            {
                "event_id": this.event_id,
            },
            function(data) {
                console.log(data);
                event.setState(data);

                event.setState({
                    hour: data['time']['hour'],
                    minute: data['time']['minute'].toString().padStart(2, '0'),
                    actionData: data['action_data'],
                    eventName: data['name'],
                });

                event.getDevicesInfo();
            }
        );
    }

    getDevicesInfo() {
        var event = this;

        get(
            "/devices",
            {},
            function(data) {
                event.setState({
                    deviceObjs: data,
                });
            }
        );
    }

    toggleEnabled() {
        var event = this;
        post(
            `/event`,
            {
                "event_id": this.event_id,
                "action": "toggle_enabled",
                "action_data": JSON.stringify({
                    "enabled": !this.state.enabled,
                }),
            },
            function(data) {
                event.setState({
                    enabled: data['response']['enabled'],
                });
            }
        );
    }

    setTime() {
        var hour = $("#event_hour_input").val();

        if (hour === "") {
            hour = this.state.time['hour'];
            $("#event_hour_input").val(
                hour
            );
        }

        var minute = $("#event_minute_input").val();

        if (minute === "") {
            minute = this.state.time['minute'];
            $("#event_minute_input").val(
                minute
            );
        }

        var event = this;

        post(
            "/event",
            {
                "event_id": this.event_id,
                "action": "set_time",
                "action_data": JSON.stringify({
                    "time": {
                        "hour": hour,
                        "minute": minute,
                    },
                })
            },
            function(data) {
                event.setState({
                    hour: data['response']['time']['hour'],
                    minute: data['response']['time']['minute'].toString().padStart(2, '0'),
                });
            }
        );
    }

    setWeekday(weekday_let, active) {
        var event = this;

        var idx = this.weekday_lets.indexOf(weekday_let);

        var weekdays_copy = this.state.weekdays;
        if (!active) {
            weekdays_copy = arrayRemove(weekdays_copy, idx);
        } else if (active) {
            weekdays_copy.push(idx);
        }


        post(
            "/event",
            {
                "event_id": this.event_id,
                "action": "set_weekday",
                "action_data": JSON.stringify({
                    "weekdays": weekdays_copy,
                }),
            },
            function(data) {
                event.setState({
                    weekdays: data['response']['weekdays'],
                });
            }
        );
    }

    selectDevice(device_id, selected) {
        var event = this;
        
        var devices = this.state.devices;

        if (selected) {
            devices.push(device_id);
        } else if (!selected) {
            devices = arrayRemove(devices, device_id);
        }

        post(
            "/event",
            {
                "event_id": this.event_id,
                "action": "set_devices",
                "action_data": JSON.stringify({
                    "devices": devices,
                }),
            },
            function(data) {
                event.setState({
                    devices: data['response']['devices'],
                });
            }
        );
    }

    setAction() {
        var action = $("#action_input").val();
        console.log(action);
    }

    setActionData() {
        var action_data = {};
        
        this.action_data_ids.forEach(function(id) {
            var key = $(`#action_data_${ id }_key_input`).val();
            var value = $(`#action_data_${ id }_value_input`).val();
            
            if (key) {
                action_data[key] = value;
            }
        })

        console.log(action_data);

        this.setState({actionData: action_data});

        post(
            "/event",
            {
                "event_id": this.event_id,
                "action": "set_action_data",
                "action_data": JSON.stringify({
                    "action_data": action_data,
                }),
            },
            function(data) {}
        );
    }

    setEventName() {
        var name = $("#event_name_input").val();

        this.setState({eventName: name});

        var event = this;

        post(
            "/event",
            {
                "event_id": this.event_id,
                "action": "set_name",
                "action_data": JSON.stringify({
                    "name": name,
                }),
            },
            function(data) {
                event.setState({
                    name: data['response']['name'],
                });
            }
        );
    }

    deleteEvent() {
        post(
            "/event/delete",
            {
                "event_id": this.event_id,
            },
            function(data) {
                window.location = "/events";
            }
        );
    }

    render() {
        var event = this;

        var event_name = <h1 onClick={ function() {event.setState({editingName: true}) } }>{ this.state.name }</h1>;
        if (this.state.editingName) {
            event_name = (
                <div className="event_name_change">
                    <input autoFocus type="text" name="event_name" value={ this.state.eventName } id="event_name_input" onChange={ this.setEventName } />
                    <img src={ getIcon("save", "white") } alt="" onClick={ function() {event.setState({editingName: false})} }/>
                </div>
            );
        }

        var weekdays_selector = [];

        var active_weekdays = [];
        this.state.weekdays.forEach(function(weekday_idx) {
            active_weekdays.push(event.weekday_lets[weekday_idx]);
        });

        this.weekday_lets.forEach(function(weekday_let) {
            var active = (active_weekdays.indexOf(weekday_let) >= 0);
            weekdays_selector.push(
                <button key={ weekday_let } onClick={ function() {event.setWeekday(weekday_let, !active)} } className={ "weekday_selector_button" + (active ? " active" : "") }>{ weekday_let.charAt(0) }</button>
            );
        });

        var devices_selector = [];

        Object.keys(this.state.deviceObjs).forEach(function(device_id) {
            var device = event.state.deviceObjs[device_id];
            var selected = (event.state.devices.indexOf(device_id) > -1);
            devices_selector.push(
                <div key={ device_id } onClick={ function() {event.selectDevice(device_id, !selected); } }>
                    <DeviceListCard id={ device_id } name={ device['name'] } selected={ selected } icon={ device['icon'] } color={ device['color'] } />
                </div>
            );
        });

        var actions = ["set_color", "start_program", "power"];

        var actions_list = [];

        actions.forEach(function(action) {
            actions_list.push(
                <option key={ action } value={ action }>{ readSnakeCase(action) }</option>
            );
        });

        this.action_data_ids = [];
        var action_data_list = [];

        var idx = 0;
        var action_data_w_empty = this.state.actionData;
        action_data_w_empty[''] = "";  // add empty

        Object.keys(action_data_w_empty).forEach(function(key) {
            var id = idx;
            action_data_list.push(
                <ActionDataRow key={ id } id={ id } k={ key } value={ event.state.actionData[key] } event={ event }/>
            );
            event.action_data_ids.push(id);
            idx += 1;
        });

        return (
            <main>
                <div className="card event_page">
                    <div className={ "event_name" + (this.state.enabled ? " active" : "")}>
                        { event_name }
                        <span className="timestamp">{ this.state.hour }:{ this.state.minute }</span>
                    </div>
                    <div className="event_control">
                        <h2>Control event</h2>
                        <button className={ "big_button" + (this.state.enabled ? " active" : "") } onClick={ this.toggleEnabled }>{ this.state.enabled ? "Disable" : "Enable" }</button>

                        <h4>Time</h4>
                        <div className="time_selector">
                            <input id="event_hour_input" onChange={ this.setTime } type="number" min="0" max="23" placeholder={ this.state.time['hour'] } />
                            <span>:</span>
                            <input id="event_minute_input" onChange={ this.setTime } type="number" min="0" max="59" placeholder={ this.state.time['minute'] } />
                        </div>

                        <h4>Weekdays</h4>
                        <div className="weekday_selector">
                            { weekdays_selector }
                        </div>

                        <h4>Devices</h4>
                        <div className="devices_list">
                            { devices_selector }
                        </div>

                        <h4>Action</h4>
                        <select name="action" id="action_input" onChange={ function() { event.setAction() } }>
                            { actions_list }
                        </select>

                        <h4>Action data</h4>
                        <div className="action_data">
                            <div className="column_names">
                                <span>Key</span>
                                <span>Value</span>
                            </div>
                            { action_data_list }
                        </div>

                        <h4>Delete event</h4>
                        <button className="big_button delete" onClick={ this.deleteEvent }>Delete</button>
                    </div>
                </div>
                <div style={{ height: "50px" }}></div>
            </main>
        )
    }
}

export default Event;
