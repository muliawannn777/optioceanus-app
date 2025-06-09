import React from "react";
import { Link, Outlet } from "react-router-dom";
import ShipList from "../ShipList";
import { useTheme } from "../ThemeContext";

function DashboardPage() {
    const { theme } = useTheme();

    const dashboardStyles = {
        padding: '15px',
        border: `1px solid ${theme === 'light' ? '#007bff' : '#66aaff'}`,
        borderRadius: '5px',
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#444444',
    };

    const navDashboardStyles = { margin: '15px 0', paddingBottom: '10px', borderBottom: `1px solid ${theme === 'light' ? '#ddd' : '#555'}`};

    return (
        <div style={dashboardStyles}>
            <h2>Dashboard Aplikasi OptiOceanus</h2>
            <nav style={navDashboardStyles}>
                <ul style={{ listStyleType: "none", padding: '0', display: 'flex', gap: '20px'}}>
                    <li><Link to="">Ringkasan</Link></li>
                    <li><Link to="reports">Laporan</Link></li>
                    <li><Link to="shiplist">Daftar Kapal</Link></li>
                </ul>
            </nav>
            <div style={{ marginTop: '20px' }}>
            <Outlet />
            </div>
        </div>
    )
}

export default DashboardPage;