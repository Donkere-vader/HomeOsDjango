import React from 'react';


function EventCard({id, name, enabled, time}) {
    return (
        <div className={ "card padding event_card" + (enabled ? " active" : "")} onClick={ function() { window.location = `/event/${id}` } }>
            <h2>{ name }</h2>
            <span className="timestamp">{ time['hour'] }:{ (time['minute']).toString().padStart(2, '0') }</span>
        </div>
    )
}

export default EventCard;
