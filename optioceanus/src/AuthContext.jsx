import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Pastikan path ini benar

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Untuk menangani state loading awal

    useEffect(() => {
        // Listener ini akan terpanggil setiap kali status autentikasi pengguna berubah
        // (login, logout, atau saat token di-refresh)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false); // Selesai loading setelah status auth diketahui
        });

        // Cleanup listener saat komponen unmount
        return unsubscribe;
    }, []);

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        logout,
        // Anda bisa menambahkan fungsi lain seperti login, signup di sini jika ingin
        // mengelolanya melalui context, tapi untuk sekarang kita fokus pada currentUser dan logout
    };

    // Jangan render children sampai status auth selesai dimuat
    // untuk menghindari flash of unauthenticated content
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}