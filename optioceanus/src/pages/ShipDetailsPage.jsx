import React from "react";
import { useParams, Link } from "react-router-dom";

const shipsData = [
    { id: 'P001', name: 'Pertamina Amaryllis', type: 'Tanker', speed: 12, year: 2021 },
    { id: 'P002', name: 'Pertamina Pride', type: 'Tanker', speed: 14, year: 2020 },
    { id: 'G001', name: 'Pertamina Gas 1', type: 'LPG Carrier', speed: 15, year: 2019 },
    { id: 'E001', name: 'Pertamina Energy', type: 'Tanker', speed: 11, year: 2022 },
];

function ShipDetailsPage() {
    const { shipId } = useParams();

    const ship = shipsData.find(s => s.id === shipId);

    if (!ship) {
        return (
            <div>
                <h2>Kapal Tidak Ditemukan</h2>
                <p>Kapal dengan ID "{shipId}" tidak ditemukan.</p>
                <Link to="/dashboard">Kembali ke Dashboard (Daftar Kapal)</Link>
            </div>
        );
    }

    return (
        <div>
            <h2>Detail Kapal: {ship.name}</h2>
            <p><strong>ID:</strong> {ship.id}</p>
            <p><strong>Tipe:</strong> {ship.type}</p>
            <p><strong>Kecepatan:</strong> {ship.speed} knot</p>
            <p><strong>Tahun Pembuatan:</strong> {ship.year}</p>
            <br />
            <Link to="/dashboard">Kembali ke Dashboard</Link>
        </div>
    );
}

export default ShipDetailsPage;