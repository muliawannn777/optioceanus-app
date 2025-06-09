import React from "react";
import useFormInput from "./hooks/useFormInput";
import { useNavigate } from "react-router-dom";

function ShipNameForm() {
    const shipNameInput = useFormInput('');
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Nama kapal yang dimasukkan: ${shipNameInput.value}`);
        shipNameInput.reset();
        navigate('/dashboard');
    }
    
    return (
        <div style={{ border: '1px solid teal', padding: '10px', margin: '10px' }}>
            <h3>Form Input Nama Kapal</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="shipNameInput">Nama Kapal: </label>
                <input
                 type="text"
                 id="shipNameInput"
                 onChange={shipNameInput.onChange}
                 value={shipNameInput.value}
                 style={{ marginRight: '5px'}} 
                 />
                 <button type="submit">Kirim</button>
            </form>
            <p>Nama kapal saat ini di state: {shipNameInput.value}</p>
        </div>
    )
}

export default ShipNameForm;