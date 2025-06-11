import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext'; // Impor useTheme
import styles from './NotFoundPage.module.css'; // Impor CSS Module

function NotFoundPage() {
  const { theme } = useTheme();

  const linkStyle = {
    backgroundColor: theme === 'light' ? '#007bff' : '#66aaff',
    color: theme === 'light' ? '#ffffff' : '#212529',
  };

  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.title}>404 - Halaman Tidak Ditemukan</h1>
      <p className={styles.message}>Maaf, halaman yang Anda cari tidak ada.</p>
      <Link to="/" className={styles.homeLink} style={linkStyle}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFoundPage;