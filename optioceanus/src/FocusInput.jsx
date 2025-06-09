import React, { useRef, useEffect } from "react";

function FocusInput() {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            console.log('Input field difokuskan!')
        }
    }, []);

    return (
        <div style={{ border: '1px solid sienna', margin: '10px', padding:'10px' }}>
            <h3>Fokus Otomatis ke Input</h3>
            <p>Input di bawah ini akan otomatis terfokus saat komponen dimuat.</p>
            <input type="text" ref={inputRef} placeholder="Ketik di sini..." />
        </div>
    )
}

export default FocusInput;