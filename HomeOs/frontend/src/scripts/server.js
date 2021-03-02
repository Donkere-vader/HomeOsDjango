import $ from 'jquery';
import { getAuthData } from '../scripts/auth';


const API_URL = "http://localhost:8000/api";


function post(url, user_data, handler, authenticated=true) {
    var data = authenticated ? getAuthData() : {};

    Object.keys(user_data).forEach(function(key) {
        data[key] = user_data[key];
    })

    $.post(
        API_URL + url,
        data,
        function(data) {
            if ('error' in data && data['error']) {
                alert(data['error']);
            } else {
                handler(data);
            }
        }
    );
}


function get(url, user_data, handler) {
    var data = getAuthData();

    Object.keys(user_data).forEach(function(key) {
        data[key] = user_data[key];
    })

    $.get(
        API_URL + url,
        data,
        function(data) {
            if ('error' in data) {
                alert(data['error']);
            }

            handler(data);
        }
    );
}

export { get, post };
