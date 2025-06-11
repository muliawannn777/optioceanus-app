import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import Panel from '../Panel';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import styles from './AuthPage.module.css'; // Menggunakan CSS Module yang sama dengan SignUpPage

function LoginPage() {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User logged in:', user);
            // Redirect ke halaman dashboard setelah berhasil login
            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setError('Email atau password salah.');
                    break;
                case 'auth/invalid-email':
                    setError('Format email tidak valid.');
                    break;
                default:
                    setError('Terjadi kesalahan saat login. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        backgroundColor: theme === 'light' ? '#ffffff' : '#495057',
        color: theme === 'light' ? '#495057' : '#f8f9fa',
        borderColor: theme === 'light' ? '#ced4da' : '#6c757d',
    };

    return (
        <Panel title="Login Akun">
            <form onSubmit={handleLogin} className={styles.authForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Login'}
                </button>
            </form>
            <p className={styles.switchAuth}>
                Belum punya akun? <Link to="/signup">Daftar di sini</Link>
            </p>
        </Panel>
    );
}

export default LoginPage;