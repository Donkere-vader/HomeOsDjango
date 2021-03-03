import React, { Component } from 'react';
import EventCard from '../components/event_card';
import getIcon from '../scripts/get_icon';
import { get, post } from '../scripts/server';

// CSS
import '../static/css/event.css';
import '../static/css/floating_action_button.css'


class Events extends Component {
    constructor(props) {
        super();

        this.state = {
            events: {},
        };

        this.newEvent = this.newEvent.bind(this);
    }

    componentDidMount() {
        var events = this;
        // API CALLS
        get(
            "/events",
            {},
            function(data) {
                console.log(data);
                events.setState({
                    events: data
                });
            }
        );
    }

    newEvent() {
        post(
            "/event/new",
            {},
            function(data) {
                if ('id' in data['response']) {
                    window.location = `/event/${data['response']['id']}`;
                }
            }
        );
    }

    render() {
        var event_doms = [];

        var events = this;
        Object.keys(this.state.events).forEach(function(event_id) {
            var event = events.state.events[event_id];
            event_doms.push(
                <EventCard  key={ `event_card_${ event_id }` } id={ event_id } name={ event['name'] } enabled={ event['enabled']  } time={ event['time'] } />
            );
        });

        console.log(event_doms);

        return (
            <main className="events_list">
                { event_doms }
                <div id="floating_action_button" onClick={ function() { events.newEvent() }}>
                    <img src={ getIcon("add", "white") } alt=""/>
                </div>
            </main>
        )
    }
}

export default Events;
