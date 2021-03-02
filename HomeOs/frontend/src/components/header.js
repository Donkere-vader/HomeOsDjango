import '../static/css/header.css';
import { Link } from 'react-router-dom';
import hambugerIcon from '../static/icons/hamburger.svg';
import React, { useState } from 'react';


function DesktopMenu() {
    return (
        <ul id="desktop_menu">
            <li><Link className="no-link" to="/">Home</Link></li>
            <li><Link className="no-link" to="/programs">Programs</Link></li>
            <li><Link className="no-link" to="/logout">Logout</Link></li>
        </ul>
    )
}

function MobileMenu() {

    const [showing, setShowing] = useState(false);

    return (
        <div id="mobile_menu">
            <img src={ hambugerIcon } onClick={ function() {setShowing(!showing); } } alt="" />
            <div id="mobile_ul" style={{display: showing ? 'flex' : 'none'}} onClick={ function() {setShowing(!showing); } }>
                <ul>
                    <li><Link className="no-link" to="/">Home</Link></li>
                    <li><Link className="no-link" to="/programs">Programs</Link></li>
                    <li><Link className="no-link" to="/logout">Logout</Link></li>
                </ul>
            </div>
        </div>
    )
}

function Header() {
    return (
        <header>
            <nav>
                <h1><Link to="/" className="no-link">HomeOs</Link></h1>
                <DesktopMenu />
                <MobileMenu />
            </nav>
        </header>
    )
}

export default Header;
