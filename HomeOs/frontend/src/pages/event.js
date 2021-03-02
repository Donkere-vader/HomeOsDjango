import React, { Component } from 'react';
import { get, post } from '../scripts/server';
import $ from 'jquery';


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
            }
        }

        this.toggleEnabled = this.toggleEnabled.bind(this);
        this.setTime = this.setTime.bind(this);
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
                }),
                function(data) {
                    console.log(data);
                }
            },

        );
    }

    render() {
        return (
            <main>
                <div className="card event_page">
                    <div className={ "event_name" + (this.state.enabled ? " active" : "")}>
                        <h1>{ this.state.name }</h1>
                    </div>
                    <div className="event_control">
                        <h2>Control event</h2>
                        <button className={ "event_enabled_button" + (this.state.enabled ? " active" : "") } onClick={ this.toggleEnabled }>{ this.state.enabled ? "Disable" : "Enable" }</button>

                        <h3>Event planning</h3>
                        <h4>Time</h4>
                        <div>
                            <input id="event_hour_input" onChange={ this.setTime } type="number" min="0" max="23" placeholder={ this.state.time['hour'] } />
                            <input id="event_minute_input" onChange={ this.setTime } type="number" min="0" max="59" placeholder={ this.state.time['minute'] } />
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default Event;
