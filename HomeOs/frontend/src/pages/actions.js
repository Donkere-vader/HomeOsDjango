import React,  { Component } from 'react';
import { post } from '../scripts/server';
import '../static/css/actions.css';
import $ from 'jquery';

class Actions extends Component {
    constructor(props) {
        super();

        this.state = {
            events: {}
        }

        this.triggerAction = this.triggerAction.bind(this);
    }
    
    componentDidMount() {
        var actions = this;

        post(
            "/events",
            {},
            function(data) {
                actions.setState({
                    events: data,
                });
            }
        )
    }

    triggerAction(event_id) {
        post(
            "/action",
            {
                "event_id": event_id,
            },
            function(data) {
                if ('succes' in data && data['succes']) {
                    var miliseconds = 1000;

                    $(`#event_card_${event_id}`).css({"animation": ""});
                    $(`#event_card_${event_id}`).css("animation", `${miliseconds}ms trigger`);

                    setTimeout(function() {
                        $(`#event_card_${event_id}`).css({"animation": ""});
                    }, miliseconds);
                }
            }
        );
    }

    render() {
        var actions = this;
        var action_cards = [];

        Object.keys(this.state.events).forEach(function(event_id) {
            var event = actions.state.events[event_id];
            action_cards.push(
                <div id={ `event_card_${event_id}` } key={ event_id } className="card padding event_card" onClick={ function() { actions.triggerAction(event_id) } }>
                    <h2>{ event['name'] }</h2>
                </div>
            );
        });

        return (
            <main>
                <div className="cards">
                    { action_cards }
                </div>
            </main>
        )
    }
}

export default Actions;
