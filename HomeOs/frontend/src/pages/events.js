import React, { Component } from 'react';
import EventCard from '../components/event_card';
import { get } from '../scripts/server';

// CSS
import '../static/css/event.css';


class Events extends Component {
    constructor(props) {
        super();

        this.state = {
            events: {},
        };
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
            </main>
        )
    }
}

export default Events;
