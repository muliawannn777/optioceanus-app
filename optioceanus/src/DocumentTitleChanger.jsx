import React, { useState } from "react";
import useDocumentTitle from "./hooks/useDocumentTitle";

function DocumentTitleChanger() {
    const [count, setCount] = useState(0);
    const title = `Anda mengklik ${count} kali. (dari hook)`;

    useDocumentTitle(title);

    return (
        <div style={{ border: '1px solid magenta', padding: '10px', margin: '10px' }}>
            <h3>Pengubah Judul Dokumen (dengan Custom Hook)</h3>
            <p>Anda telah mengklik tombol {count} kali.</p>
            <button onClick={() => setCount(count + 1)}>
                klik Saya
            </button>
        </div>
    )
}

export default DocumentTitleChanger;