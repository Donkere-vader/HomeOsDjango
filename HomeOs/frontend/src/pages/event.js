import React, { Component } from 'react';
import { get, post } from '../scripts/server';


class Event extends Component {
    constructor({match}) {
        super();

        this.event_id = match.params.event_id;
        
        this.state = {
            name: "Loading...",
            enabled: false,
        }

        this.toggleEnabled = this.toggleEnabled.bind(this);
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

    render() {
        return (
            <main>
                <div className="card event_page">
                    <div className={ "event_name" + (this.state.enabled ? " active" : "")}>
                        <h1>{ this.state.name }</h1>
                    </div>
                    <div className="event_control">
                        <h3>Control event</h3>
                        <button className={ "event_enabled_button" + (this.state.enabled ? " active" : "") } onClick={ this.toggleEnabled }>{ this.state.enabled ? "Disable" : "Enable" }</button>

                        <input type="time" name="" id=""/>
                    </div>
                </div>
            </main>
        )
    }
}

export default Event;
