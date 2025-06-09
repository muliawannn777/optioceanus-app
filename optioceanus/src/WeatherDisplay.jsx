import React, { useState } from "react";

function WeatherDisplay() {
    const [temperature, setTemperature] = useState(25);
    const isHot = temperature > 25;

    return (
        <div style={{ border: '1px solid orange', padding: '10px', margin: '10px'}}>
            <h3>Info Cuaca</h3>
            <p>Cuaca saat ini: {temperature}C</p>
            <p>
                {isHot ? (
                    <span style={{ color: 'red' }}>Cuaca Panas!</span>
                ) : (
                    <span style={{ color: 'blue' }}>Cuaca Sejuk.</span>
                )}
            </p>
            <button onClick={() => setTemperature(temperature + 5)}>Tambah Suhu</button>
            <button onClick={() => setTemperature(temperature - 5)} style={{marginLeft: '5px'}}>Kurangi Suhu</button>
        </div>
    )
}

export default WeatherDisplay;