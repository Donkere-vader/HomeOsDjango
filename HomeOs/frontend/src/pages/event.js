import React, { Component } from 'react';
import { get, post } from '../scripts/server';
import $ from 'jquery';
import arrayRemove from '../scripts/remove_array';


class Event extends Component {
    constructor({match}) {
        super();

        this.event_id = match.params.event_id;
        
        this.state = {
            name: "Loading...",
            enabled: false,
            time: {
                hour: 0,
                minute: 0,
            },
            hour: 0,
            minute: 0,
            weekdays: [],
        }

        this.weekday_lets = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.setTime = this.setTime.bind(this);
        this.setWeekday = this.setWeekday.bind(this);
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

    render() {
        var weekdays_selector = [];
        var event = this;

        var active_weekdays = [];
        this.state.weekdays.forEach(function(weekday_idx) {
            active_weekdays.push(event.weekday_lets[weekday_idx]);
        });

        this.weekday_lets.forEach(function(weekday_let) {
            var active = (active_weekdays.indexOf(weekday_let) >= 0);
            weekdays_selector.push(
                <button onClick={ function() {event.setWeekday(weekday_let, !active)} } className={ "weekday_selector_button" + (active ? " active" : "") }>{ weekday_let.charAt(0) }</button>
            );
        });

        return (
            <main>
                <div className="card event_page">
                    <div className={ "event_name" + (this.state.enabled ? " active" : "")}>
                        <h1>{ this.state.name }</h1>
                        <span className="timestamp">{ this.state.hour }:{ this.state.minute }</span>
                    </div>
                    <div className="event_control">
                        <h2>Control event</h2>
                        <button className={ "event_enabled_button" + (this.state.enabled ? " active" : "") } onClick={ this.toggleEnabled }>{ this.state.enabled ? "Disable" : "Enable" }</button>

                        <h3>Event planning</h3>
                        <h4>Time</h4>
                        <div className="time_selector">
                            <input id="event_hour_input" onChange={ this.setTime } type="number" min="0" max="23" placeholder={ this.state.time['hour'] } />
                            <input id="event_minute_input" onChange={ this.setTime } type="number" min="0" max="59" placeholder={ this.state.time['minute'] } />
                        </div>

                        <h4>Weekdays</h4>
                        <div className="weekday_selector">
                            { weekdays_selector }
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default Event;
