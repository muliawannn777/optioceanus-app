import React, { useState } from "react";

function RouteConfigForm() {
    const [formData, setFormData] = useState ({
        startPoint: '',
        endPoint: '',
        maxSpeed: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Titik Awal: ${formData.startPoint}, Tujuan: ${formData.endPoint}`);
        setFormData({
            startPoint: '',
            endPoint: '',
            maxSpeed: '',
        })
    }

    return (
        <div style={{border: '1px solid brown', padding: '10px', margin: '10px'}}>
            <h3>Konfigurasi Rute</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="startPoint">Titik Awal: </label>
                
                <input
                 type="text"
                 id="startPoint"
                 name="startPoint"
                 value={formData.startPoint}
                 onChange={handleChange}
                />
            </div>
            <div style={{ marginTop: '5px'}}>
                <label htmlFor="endPoint">Tujuan: </label>
                <input
                 type="text" 
                 name="endPoint" 
                 id="endPoint"
                 value={formData.endPoint}
                 onChange={handleChange} 
                 />
            </div>
            <div style={{ marginTop: '5px'}}>
                <label htmlFor="maxSpeed">Kecepatan Maks (knot): </label>
                <input
                 type="text"
                 id="maxSpeed"
                 name="maxSpeed"
                 value={formData.maxSpeed}
                 onChange={handleChange} />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Simpan Konfigurasi</button>
            </form>
            <pre style={{ marginTop: '10px', backgroundColor: '#f0f0f0', padding: '10px' }}>
                Data Form di State: {JSON.stringify(formData,null, 2)}
            </pre>
        </div>
    )
}

export default RouteConfigForm;