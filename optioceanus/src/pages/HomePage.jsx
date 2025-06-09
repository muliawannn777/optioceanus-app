import React from "react";
import { Link } from "react-router-dom";
import Salam from "../Salam";
import ShipNameForm from "../ShipNameForm";
// import LoginStatus from "../LoginStatus"; // Komentari atau hapus jika tidak digunakan

function HomePage() {
    return (
        <div>
            <Salam nama="Pengguna OptiOceanus" asal="Pelabuhan Utama" />
            <h1>Selamat Datang di Aplikasi OptiOceanus</h1>
            <p>Platform terintegrasi untuk manajemen operasional kapal.</p>
            <ShipNameForm />
            <nav>
                <ul>
                    <li><Link to="/dashboard">Pergi ke Dashboard</Link></li>
                    </ul>
            </nav>
        </div>
    )
}

export default HomePage;