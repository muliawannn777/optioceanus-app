import React, { useState } from "react";
import { useTheme } from "./ThemeContext"; 
import styles from "./Counter.module.css"; 

function Counter() {
    const [count, setCount] = useState(0);
    const { theme } = useTheme();

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        setCount(count - 1);
    };

        const containerStyle = {
            border: `1px solid ${theme === 'light' ? '#adb5bd' : '#495057'}`,
            backgroundColor: theme === 'light' ? '#f8f9fa' : '#343a40',
        };
    
        const buttonStyle = {
            backgroundColor: theme === 'light' ? '#007bff' : '#66aaff',
            color: theme === 'light' ? '#ffffff' : '#212529',
            borderColor: theme === 'light' ? '#007bff' : '#66aaff',
        };
    
    return (
            <div className={styles.counterContainer} style={containerStyle}>
                <h3 className={styles.counterTitle}>Counter Sederhana</h3>
                <p className={styles.countDisplay}>Nilai saat ini: {count}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={handleIncrement} className={styles.counterButton} style={buttonStyle}>Tambah (+)</button>
                    <button onClick={handleDecrement} className={styles.counterButton} style={buttonStyle}>Kurang (-)</button>
                </div>
        </div>
    )
}

export default Counter;
