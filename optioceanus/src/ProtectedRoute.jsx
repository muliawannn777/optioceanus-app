import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        // Jika tidak ada pengguna yang login, arahkan ke halaman login
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Jika sudah login, render konten rute (children)
}

export default ProtectedRoute;