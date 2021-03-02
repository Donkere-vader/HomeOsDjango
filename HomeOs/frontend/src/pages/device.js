import React, { Component } from 'react';
import getIcon from '../scripts/get_icon';
import { get } from '../scripts/server';


// CSS
import '../static/css/device.css';

class Device extends Component {
    constructor({match}) {
        super();

        this.device_id = match.params.device_id;

        this.state = {
            name: "Loading...",
            description: "Loading...",
            iconObj: null,
            active: false,
            color: "212121",
            programs: {},
            activeProgram: null,
        };

        // Bind methods
        this.powerToggle = this.powerToggle.bind(this);
        this.selectColor = this.selectColor.bind(this);
        this.selectProgram = this.selectProgram.bind(this);
        this.getDeviceInfo = this.getDeviceInfo.bind(this);
        this.getProgramsInfo = this.getProgramsInfo.bind(this);
    }

    componentDidMount() {
        this.getDeviceInfo();
    }

    getDeviceInfo() {
        var device = this;
        get(
            "/dev",
            {
                "device_id": this.device_id,
            },
            function(data) {
                console.log(data);

                device.setState({
                    active: data['active'],
                    name: data['name'],
                    description: data['description'],
                    color: data['color'],
                    iconObj: getIcon(data['icon'], "white"),
                });

                device.getProgramsInfo(data['programs']);
            }
        );
    }

    getProgramsInfo(program_ids) {
        var programs = {};
        var device = this;
        
        program_ids.forEach(function(id) {
            get(
                "/program",
                {
                    "program_id": id,
                },
                function(data) {
                    programs[id] = data;
                    
                    device.setState({
                        programs: programs
                    });
                }
            )
        });
    }

    powerToggle() {
        this.setState({
            active: !this.state.active,
        });
    }

    selectColor(color) {
        this.setState({
            color: color,
        });
    }

    selectProgram(program_id) {
        this.setState({
            activeProgram: program_id,
        });
    }

    render() {
        var device = this;  // for use in anonymous funtions

        // Color picker buttons
        var color_picker_buttons = [];
        var colors = [
            "FFFFFF",
            "FF0000",
            "00FF00",
            "0000FF",
            "FFFF00",
            "FF00FF",
            "00FFFF",
        ];

        colors.forEach(function(color) {
            var icon = null;

            if (device.state.color === color) {
                icon = <img src={ getIcon("check", (color === "FFFFFF" ? "black" : "white")) } alt=""/>;
            }

            color_picker_buttons.push(
                <button key={ `color_picker_button_${color}` } className="color_picker_button" style={{ backgroundColor: `#${color}`}} onClick={ function() {device.selectColor(color) }}>
                    { icon }
                </button>
            );
        });

        // Program picker buttons
        var program_picker_buttons = [];
        
        Object.keys(this.state.programs).forEach(function(program_id) {
            var activeClass = "";

            if (device.state.activeProgram === program_id) {
                activeClass = "active";
            }

            program_picker_buttons.push(
                <button key={ `program_picker_button_${program_id}` } className={ "program_picker_button " + activeClass } onClick={ function() {device.selectProgram(program_id) }}>
                    { device.state.programs[program_id]['name'] }
                </button>
            );
        });

        return (
            <main>
                <div className="card device_page">
                    <div className="device_icon" style={{ backgroundColor: this.state.active ? `#${this.state.color}` : "#212121" }}>
                        <img src={ this.state.iconObj } alt="" />
                    </div>
                    <div className="device_info">
                        <div className="device_active" style={{
                            "color": this.state.active ? "#8bc34a" : "#f44336"
                        }}>
                            <div className="device_active_circle" style={{
                                backgroundColor: this.state.active ? "#8bc34a" : "#f44336"
                            }}></div>
                            <span>{this.state.active ? "on" : "off"}</span>
                        </div>
                        <h2>{ this.state.name }</h2>
                        <p>{ this.state.description }</p>
                    </div>
                    <div className="device_control">
                        <h3>Device control</h3>
                        <button className="device_power_button" style={{
                            backgroundColor: this.state.active ? "#f44336": "#8bc34a",
                            color: this.state.active ? "#FFFFFF" : "#212121"
                        }} onClick={ this.powerToggle }>{ this.state.active ? "Turn off" : "Turn on" }</button>

                        <h4>Select color</h4>
                        <div className="color_picker">
                            { color_picker_buttons }
                        </div>

                        <h4>Select program</h4>
                        <div className="program_picker">
                            { program_picker_buttons }
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

export default Device;
