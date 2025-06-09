import React, { useState, useEffect} from "react";
import axios from 'axios';

function DataFetcher() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
               
                setData(response.data);
            } catch (e) {
                setError(e.message);
                console.error("Gagal mengambil data:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [])

    if (isLoading) {
        return <p style={{ color: 'blue'}}>Memuat data...</p>
    }

    if (error) {
        return <p style={{ color: 'red'}}>Terjadi kesalahan: {error}</p>
    }

    return (
            <div style={{ border: '1px solid dodgerblue', margin: '10px', padding: '10px'}}>
            <h3>Data Todos dari API (JSONPlaceholder)</h3>
            {data ? (
                <ul>
                    {data.map(todo => (
                        <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Tidak ada data.</p>
            )}
            </div>
    )
    
}

export default DataFetcher;