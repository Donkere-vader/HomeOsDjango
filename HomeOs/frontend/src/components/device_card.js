// React
import React from "react";

// Css
import '../static/css/device.css';

// Scripts
import getIcon from '../scripts/get_icon';
import { Link } from "react-router-dom";


function DeviceCard({id, name, description, icon, color, active}) {
    var iconObj = getIcon(icon, "white");

    return (
        <Link to={ `/dev/${id}` } className="no-link">
            <div id={`device_card_${id}`} className="card device_card">
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
        </Link>
    )
}

export default DeviceCard;
