import React, { useState, useEffect} from "react";
import axios from 'axios';
import { useTheme } from "./ThemeContext"; 
import styles from "./DataFetcher.module.css"; 

function DataFetcher() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseApiUrl = import.meta.env.VITE_API_TODOS_URL || "https://jsonplaceholder.typicode.com/todos";

    const { theme } = useTheme();
    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const response = await axios.get(baseApiUrl, {
                    params: { _limit: 5 }
                });
                setData(response.data);
            } catch (e) {
                setError(e.message);
                console.error("Gagal mengambil data:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [baseApiUrl]) 

    const loadingMessageStyle = {
        color: theme === 'light' ? '#004085' : '#cce5ff',
    };

    const errorMessageStyle = {
        color: theme === 'light' ? '#721c24' : '#f8d7da',
        backgroundColor: theme === 'light' ? '#f8d7da' : 'rgba(114, 28, 36, 0.3)',
        border: `1px solid ${theme === 'light' ? '#f5c6cb' : '#721c24'}`, 
    };

    const todoItemStyle = {
        borderBottom: `1px solid ${theme === 'light' ? '#eeeeee' : '#444444'}`,
    }

    const spinnerStyle = {
        borderLeftColor: theme === 'light' ? '#007bff' : '#66aaff',
    };

    if (isLoading) {
        return (
            <div className={styles.spinnerContainer}>
                <div className={styles.spinner} style={spinnerStyle}></div>
                <p style={loadingMessageStyle}>Memuat data...</p>
            </div>
        );
    }

    if (error) {
        return <p className={styles.errorMessage} style={errorMessageStyle}>Terjadi kesalahan: {error}</p>
    }

    return (
            <>
            {data ? (
                <ul className={styles.todoList}>
                    {data.map(todo => (
                        <li key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.completedTodo : ''}`} style={todoItemStyle}>
                            {todo.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noDataMessage}>Tidak ada data.</p>
            )}
            </>
    )

}

export default DataFetcher;
