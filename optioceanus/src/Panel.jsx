// c:\Users\har\Documents\React Projects\optioceanus\src\Panel.jsx
import React from 'react';
import { useTheme } from './ThemeContext';
import styles from './Panel.module.css';

function Panel({ title, children }) {
  const { theme } = useTheme();

  const panelDynamicStyle = {
    backgroundColor: theme === 'light' ? '#f9f9f9' : '#3a3a3a', // Warna latar panel
    borderColor: theme === 'light' ? '#e0e0e0' : '#505050',    // Warna border panel
  };

  const titleDynamicStyle = {
    color: theme === 'light' ? '#333' : '#f1f1f1',             // Warna teks judul
    borderBottomColor: theme === 'light' ? '#eee' : '#4a4a4a', // Warna border bawah judul
  };

  const contentDynamicStyle = {
    color: theme === 'light' ? '#555' : '#cccccc',             // Warna teks konten
  };

  return (
    <div className={styles.panelContainer} style={panelDynamicStyle}>
      {title && <h3 className={styles.panelTitle} style={titleDynamicStyle}>{title}</h3>}
      <div className={styles.panelContent} style={contentDynamicStyle}>
        {children}
      </div>
    </div>
  );
}

export default Panel;
