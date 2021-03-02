// React
import React from "react";

// Css
import '../static/css/device.css';

// Scripts
import getIcon from '../scripts/get_icon';


function DeviceCard({id, name, description, icon, color, active}) {
    var iconObj = getIcon(icon, "white");

    return (
        <div id={`device_card_${id}`} className="card device_card" onClick={function() {alert("test")}}>
            <div className="device_icon" style={{backgroundColor: active ? `#${color}`:  "#212121"}}>
                <img src={ iconObj } alt=""/>
            </div>
            <div className="device_info">
                <div className="device_active" style={{
                    "color": active ? "#8bc34a" : "#f44336"
                    }}>
                    <div className="device_active_circle" style={{
                        backgroundColor: active ? "#8bc34a" : "#f44336"
                    }}></div>
                    <span>{ active ? "on" : "off" }</span>
                </div>
                <h3>{ name }</h3>
                <p>{ description }</p>
            </div>
        </div>
    )
}

export default DeviceCard;
