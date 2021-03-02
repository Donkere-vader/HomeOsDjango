import Cookies from 'js-cookie';
import { post } from '../scripts/server';


function auth(username, password) {
    post(
        "/auth",
        {
            username: username,
            password: password,
        },
        function(data) {
            Cookies.set("username", username, { expires: 100, path: '/', sameSite: "strict", secure: true });
            Cookies.set("key", data['key'], { expires: 100, path: '/', sameSite: "strict", secure: true })
            
            window.location = "/";
        },
        false
    )
}


function logout() {
    Cookies.remove('username');
    Cookies.remove('key');
}


function getAuthData() {
    var username = Cookies.get("username");
    var key = Cookies.get("key");

    if (username === undefined || key === undefined) {
        window.location = "/login";
    }

    return {
        "auth_username": username,
        "auth_key": key,
    };
}

export { getAuthData, auth, logout };
