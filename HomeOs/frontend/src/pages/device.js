import React, { Component } from 'react';
import getIcon from '../scripts/get_icon';


// CSS
import '../static/css/device.css';

class Device extends Component {
    constructor() {
        super();

        this.state = {
            active: false,
            color: "FF0000",
            programs: {
                "1": {name: "loading..."},
                "2": {name: "wake"}
            },
            activeProgram: "1",
        };

        this.name = "Ledstrip bedroom south";
        this.description = "Ledstrip/ wake light bedroom Cas";
        this.icon = "light";
        this.iconObj = getIcon(this.icon, "white");

        // Bind methods
        this.powerToggle = this.powerToggle.bind(this);
        this.selectColor = this.selectColor.bind(this);
        this.selectProgram = this.selectProgram.bind(this);
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

        var program_id;
        var program_ids = []
        for (program_id in this.state.programs) {
            program_ids.push(program_id);
        }
        
        program_ids.forEach(function(program_id) {
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
                        <img src={ this.iconObj } alt="" />
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
                        <h2>{ this.name }</h2>
                        <p>{ this.description }</p>
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
