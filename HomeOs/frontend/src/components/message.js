import React from 'react';
import $ from 'jquery';
import ReactDOMServer from "react-dom/server";

// CSS
import '../static/css/message.css'


function Message({message, error}) {
    return (
        <div id="message" className={ error ? "error" : "message" }>
            <span>{ message }</span>
        </div>
    )
}

function showMessage(message, error=false) {
    var messageHtml = ReactDOMServer.renderToStaticMarkup(<Message message={message} error={error} />);
    $("#message_cointaner").hide();
    $("#message_cointaner").html(messageHtml);
    $("#message_cointaner").fadeIn().delay(5 * 1000).fadeOut();
}

export { Message, showMessage };
