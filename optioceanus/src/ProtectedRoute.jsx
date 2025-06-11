import React from 'react';
import { Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Impor LoginPage
import { useAuth } from './AuthContext';

function ProtectedRoute() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        // Jika tidak ada pengguna yang login, arahkan ke halaman login
       return <LoginPage />;
    }

    return <Outlet />; // Jika sudah login, render konten rute (children)
}

export default ProtectedRoute;