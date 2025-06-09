import React from 'react';
import { useTheme } from './ThemeContext';

function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={{ padding: '8px 12px', cursor: 'pointer' }}>
      Ganti ke Tema {theme === 'light' ? 'Gelap' : 'Terang'}
    </button>
  );
}

export default ToggleThemeButton;