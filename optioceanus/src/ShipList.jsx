import React from "react";
import ShipItem from "./ShipItem";
import { Link } from "react-router-dom";

function ShipList() {
    const shipsData = [
        { id: 'P001', name: 'Pertamina Amaryllis', type: 'Tanker' },
        { id: 'P002', name: 'Pertamina Pride', type: 'Tanker' },
        { id: 'G001', name: 'Pertamina Gas 1', type: 'LPG Carrier' },
        { id: 'E001', name: 'Pertamina Energy', type: 'Tanker' },
    ];

    return (
        <div style={{ border: '1px solid purple', padding: '10px', margin: '10px' }}>
            <h3>Daftar Kapal (dengan Komponen Anak)</h3>
            <ul>
                {shipsData.map((ship) => (
                    <li key={ship.id}>
                        <Link to={`/ship/${ship.id}`} style={{ textDecoration: 'none', color: 'inherit' }}><ShipItem ship={ship} /></Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ShipList;