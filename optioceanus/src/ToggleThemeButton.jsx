import React from 'react';
import { useTheme } from './ThemeContext';
import styles from './ToggleThemeButton.module.css'; // Impor CSS Module

function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme();

  const buttonDynamicStyle = {
    backgroundColor: theme === 'light' ? '#e9ecef' : '#495057', // Warna latar yang lebih lembut
    color: theme === 'light' ? '#212529' : '#f8f9fa',
    borderColor: theme === 'light' ? '#ced4da' : '#6c757d',
  };

  return (
    <button 
      onClick={toggleTheme} 
      className={styles.themeButton}
      style={buttonDynamicStyle}>
      Ganti ke Tema {theme === 'light' ? 'Gelap' : 'Terang'}
    </button>
  );
}

export default ToggleThemeButton;