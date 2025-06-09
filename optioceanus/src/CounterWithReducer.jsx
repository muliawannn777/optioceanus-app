import React, { useReducer } from "react";

function counterReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        case 'RESET':
            return { count: 0};
        case 'SET_VALUE':
            return { count: action.payload };
        default:
            return state;
    }
}

function CounterWithReducer() {
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });

    return (
        <div style={{ border: '1px solid limegreen', padding: '10px', margin: '10px', textAlign: 'center' }}>
            <h3>Counter dengan useReducer</h3>
            <p>Nilai saat ini: {state.count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })} style={{ marginRight: '5px' }}>
                Tambah
            </button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })} style={{ marginRight: '5px' }}>
                Kurang
            </button>
            <button onClick={() => dispatch({ type: 'RESET' })} style={{ marginRight: '5px' }}>
                RESET
            </button>
            <button onClick={() => dispatch({ type: 'SET_VALUE', payload: 100 })}>
                Set ke 100
            </button>
        </div>
    )
}

export default CounterWithReducer;