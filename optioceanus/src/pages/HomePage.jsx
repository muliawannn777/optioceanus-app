import React from "react";
import LoginStatus from "../LoginStatus";

function HomePage() {
    return (
        <div>
            <h2>Halaman Beranda OptiOceanus</h2>
            <p>Selamat datang di aplikasi optimasi rute kapal Anda!</p>
            <LoginStatus />
        </div>
    )
}

export default HomePage;