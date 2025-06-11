import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import Panel from '../Panel'; 
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebaseConfig'; 
import styles from './AuthPage.module.css'; 

function SignUpPage() {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null); 
        setIsLoading(true); 

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed up:', user);
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Error signing up:', error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
                    break;
                case 'auth/invalid-email':
                    setError('Format email tidak valid.');
                    break;
                case 'auth/weak-password':
                    setError('Password terlalu lemah (minimal 6 karakter).');
                    break;
                default:
                    setError('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
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
        <Panel title="Daftar Akun Baru">
            <form onSubmit={handleSignUp} className={styles.authForm}>
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
                    {isLoading ? 'Memproses...' : 'Daftar'}
                </button>
            </form>
            <p className={styles.switchAuth}>
                Sudah punya akun? <Link to="/login">Login di sini</Link>
            </p>
        </Panel>
    );
}

export default SignUpPage;