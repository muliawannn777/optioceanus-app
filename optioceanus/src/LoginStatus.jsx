import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserGreeting() {
    return <h1>Selamat Datang Kembali!</h1>
}

function GuestGreeting() {
    return <h1>Silakan Login atau Daftar.</h1>
}

function LoginButton({ onClick }) {
    return <button onClick={onClick}>Login</button>
}

function LogoutButton({ onClick }) {
    return <button onClick={onClick}>Logout</button>
}

function LoginStatus() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setIsLoggedIn(true);
    };

    const handleLogoutClick = () => {
        setIsLoggedIn(false);
        navigate('/dashboard')
    };

    let button;
    let greeting;

    if (isLoggedIn) {
        button = <LogoutButton onClick={handleLogoutClick} />;
        greeting = <UserGreeting />;
    } else {
        button = <LoginButton onClick={handleLoginClick} />;
        greeting = <GuestGreeting />;
    }

    return (
        <div style={{ border: '1px solid green', padding: '10px', margin: '10px'}}>
            {greeting}
            {button}
        </div>
    )
}

export default LoginStatus;