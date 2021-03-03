import React from 'react';
import '../static/css/device.css';
import getIcon from '../scripts/get_icon';


function DeviceListCard({id, name, icon, color, selected}) {
    return (
        <div className={ "device_list_card" + (selected ? " selected" : "")}>
            <div className="device_icon" style={{backgroundColor: `#${ color }` }}>
                <img src={ getIcon(icon, 'white') } alt=""/>
            </div>
            <div className="device_info">
                <span>{ name }</span>
            </div>
        </div>
    )
}

export default DeviceListCard;
