import React from "react";
import { logout } from "../scripts/auth";


function LogoutPage() {
    logout();

    window.location = "/login";

    return (
        <main>
            <h1>Doei</h1>
        </main>
    )
}

export default LogoutPage;
