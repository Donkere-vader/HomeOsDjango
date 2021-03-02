import React, { Component } from 'react';

// CSS
import '../static/css/style.css';

// React components
import DeviceCard from '../components/device_card';
import { get } from '../scripts/server';


class Index extends Component {
    // var devices = [
    //     <DeviceCard key={ `device_card_ledstrip_bedroom_south` } id="ledstrip_bedroom_south" name="Ledstrip bedroom Cas" description="Hello this is a ledstrip" icon="light" color="FF00FF" active={true} />
    // ];

    constructor() {
        super();

        this.state = {
            devices: {}
        }

        // Bind this to functions
        this.getDevicesInfo = this.getDevicesInfo.bind(this);
    }

    componentDidMount() {
        this.getDevicesInfo();
    }

    getDevicesInfo() {
        var device = this;

        get(
            "/devices",
            {},
            function(data) {
                device.setState({ devices: data});
            }
        )
    }

    render() {
        var device_cards = [];

        var device = this;
        Object.keys(this.state.devices).forEach(function(device_id) {
            var device_info = device.state.devices[device_id];
            device_cards.push(
                <DeviceCard key={ `device_card_${device_id}` } id={ device_id } name={ device_info['name'] } description={ device_info['description'] } icon={ device_info['icon'] } color={ device_info['color'] } active={ device_info['active'] } />
            );
        });


        return (
            <main>
                <div className="cards">
                    { device_cards }
                </div>
            </main>
        )
    }
}

export default Index;
