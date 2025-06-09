import React, { useState, useRef, useEffect } from "react";

function RenderCounter() {
    const [triggerRender, setTriggerRender] = useState(0);
    const renderCountRef =  useRef(0);

    useEffect(() => {
        renderCountRef.current = renderCountRef.current + 1;
        console.log(`Komponen dirender ${renderCountRef.current} kali.`);
    });

    return (
        <div style={{ border: '1px solid slateblue', padding: '10px', margin: '10px'}}>
            <h3>Penghitung Render (dengan useRef)</h3>
            <p>Komponen ini telah dirender: {renderCountRef.current} kali.</p>
            <p>(Nilai di atas mungkin tidak update langsung di UI karena perubahan ref tidak memicu rendering)</p>
            <button onClick={() => setTriggerRender(c => c + 1)}>
                Picu Re-render ({triggerRender})
            </button>
        </div>
    )
}

export default RenderCounter;