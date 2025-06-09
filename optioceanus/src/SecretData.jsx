import React from "react";

function SecretData({ show }) {
    if (!show) {
        return null;
    }

    return (
        <div style={{ border: '1px dashed red', padding: '10px', margin: '10px' }}>
            Ini adalah data rahasia yang hanya muncul jika 'show' adalah true.
        </div>
    )
}

export default SecretData;