import React from "react";
import { useTheme } from './ThemeContext.jsx';

function ThemedComponent() {
    const { theme, toggleTheme } = useTheme();

    const style = {
        backgroundColor: theme === 'dark' ? '#333' : '#FFF',
        color: theme === 'dark' ? '#FFF' : '#333',
        padding: '20px',
        margin: '10px',
        border: '1px solid gray',
        textAlign: 'center',
    };

    return (
        <div style={style}>
            <p>Tema saat ini adalah: {theme}</p>
            <button onClick={toggleTheme}>
                Ganti ke Tema {theme === 'dark' ? 'Terang' : 'Gelap'}
            </button>
        </div>
    )
}

export default ThemedComponent;