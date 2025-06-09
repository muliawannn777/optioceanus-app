import React from "react";

function AlertMessage({ message }) {
    // Hanya render  jika ada pesan
    return (
        message && (
            <div style={{ backgroundColor: 'yellow', padding: '10px', margin: '10px', border: '10px solid gold' }}>
                <strong>Peringatan:</strong> {message}
            </div>
        )
    )
}

export default AlertMessage;