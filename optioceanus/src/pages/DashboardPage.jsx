import React from "react";
import { Link, Outlet } from "react-router-dom";
import Panel from "../Panel";
import DataFetcher from "../DataFetcher";
import Counter from "../Counter";
import ShipList from "../ShipList";

function DashboardPage() {
    return (
        <div style={{ padding: '15px', border: '1px solid #007bff', borderRadius: '5px' }}>
            <h2>Dashboard Aplikasi OptiOceanus</h2>
            <nav style={{ margin: '15px 0', paddingBottom: '10px', borderBottom: '1px solid #ddd'}}>
                <ul style={{ listStyleType: "none", padding: '0', display: 'flex', gap: '20px'}}>
                    <li><Link to="">Ringkasan</Link></li>
                    <li><Link to="reports">Laporan</Link></li>
                    <li><Link to="shiplist">Daftar Kapal</Link></li>
                </ul>
            </nav>
            <Outlet />
        </div>
    )
}

export default DashboardPage;