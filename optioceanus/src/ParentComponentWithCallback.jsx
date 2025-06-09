import React, { useState, useCallback } from "react";

const ChildComponent = React.memo(({ onIncrement }) => {
    console.log('ChildComponent dirender');
    return <button onClick={onIncrement}>Tambah dari Anak</button>
});

function ParentComponentWithCallback() {
    const [count, setCount] = useState(0);
    const [otherState, setOtherState] = useState(0);

    const handleIncrement = useCallback(() => {
        setCount(c => c + 1);
    }, []);

    return (
        <div style={{ border: '1px solid orangered', padding: '10px', margin: '10px'}}>
            <h3>Parent dengan useCallback</h3>
            <p>Count: {count}</p>
            <p>Other State: {otherState}</p>
            <button onClick={() => setOtherState(s => s + 1)} style={{ marginRight: '5px'}}>
                Ubah Other State (Picu Render Parent)
            </button>
            <ChildComponent onIncrement={handleIncrement} />
        </div>
    )
}

export default ParentComponentWithCallback;