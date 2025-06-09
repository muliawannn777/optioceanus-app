import React, { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        setCount(count - 1);
    };

    return (
        <div style={{ border: '1px solid lightblue', padding: '10px', margin: '10px', textAlign: 'center'}}>
            <h3>Counter Sederhana</h3>
            <p>Nilai saat ini: {count}</p>
            <button onClick={handleIncrement} style={{ marginRight: '5px' }}>Tambah (+)</button>
            <button onClick={handleDecrement}>Kurang (-)</button>
        </div>
    )
}

export default Counter;