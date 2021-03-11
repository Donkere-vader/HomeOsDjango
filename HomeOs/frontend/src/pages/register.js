import React, { Component } from 'react';
import '../static/css/style.css';
import '../static/css/form.css';
import $ from 'jquery';
import { auth } from '../scripts/auth';
import { post } from '../scripts/server';


class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form_error: "",
        };

        this.register = this.register.bind(this);
    }

    register() {
        var username = $("#username_input").val();
        var password = $("#password_input").val();
        var password_confirm = $("#password_confirm_input").val();

        if (password !== password_confirm) {
            this.setState({form_error: "Passwords don't match"});
            return;
        } else if (password.length < 4) {
            this.setState({form_error: "Password must be at least 4 characters"});
            return;
        } else if (username.length < 3) {
            this.setState({form_error: "username must be at least 3 characters"});
            return;
        }

        var ths = this;

        post(
            "/register",
            {
                username: username,
                password: password,
            },
            function(data) {
                if ('form_error' in data) {
                    ths.setState({form_error:  data['form_error']});
                } else {
                    auth(username, password);
                }
            },
            false
        );
    }

    render() {
        return (
            <main className="horizontal-center vertical-center">
                <div className="form card" style={{ width: "300px"}}>
                    <h3>Register</h3>

                    { this.state.form_error &&
                        <div className="form_error">
                            <span>{ this.state.form_error }</span>
                        </div>
                    }
    
                    <label htmlFor="username_input">Username: </label>
                    <input type="text" name="username" id="username_input" autoComplete="off" />
    
                    <label htmlFor="password_input">Password: </label>
                    <input type="password" name="password" id="password_input"/>
    
                    <label htmlFor="password_confirm_input">Confirm password: </label>
                    <input type="password" name="password_confirm" id="password_confirm_input"/>
    
                    <div style={{height: "20px"}}></div>
    
                    <button className="submit" onClick={ this.register }>Login</button>
                </div>
            </main>
        )
    }
}

export default RegisterPage;
