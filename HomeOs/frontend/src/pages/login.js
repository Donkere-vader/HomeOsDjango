import React from 'react';
import { auth } from '../scripts/auth';
import '../static/css/style.css';
import '../static/css/form.css';
import $ from 'jquery';


function Login() {
    var username = $("#username_input").val();
    var password = $("#password_input").val();

    auth(username, password);
}


function LoginPage() {
    return (
        <main className="horizontal-center vertical-center">
            <div className="form card" style={{ width: "300px"}}>
                <h3>Login</h3>

                <label htmlFor="username_input">Username: </label>
                <input type="text" name="username" id="username_input" autoComplete="off" />

                <label htmlFor="password_input">Password: </label>
                <input type="password" name="password" id="password_input"/>

                <div style={{height: "20px"}}></div>

                <button className="submit" onClick={ Login }>Login</button>
            </div>
        </main>
    )
}

export default LoginPage;
