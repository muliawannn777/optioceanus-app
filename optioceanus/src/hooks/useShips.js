import { useState, useEffect } from 'react';

// Nama kunci untuk menyimpan data di localStorage
const LOCAL_STORAGE_KEY = 'optioceanus_ships';

const initialShipsData = [
    { id: 'P001', name: 'Pertamina Amaryllis', type: 'Tanker', speed: 12, year: 2021 },
    { id: 'P002', name: 'Pertamina Pride', type: 'Tanker', speed: 14, year: 2020 },
    { id: 'G001', name: 'Pertamina Gas 1', type: 'LPG Carrier', speed: 15, year: 2019 },
    { id: 'E001', name: 'Pertamina Energy', type: 'Tanker', speed: 11, year: 2022 },
];

function useShips() {
    const [ships, setShips] = useState(() => {
        // Ambil data dari localStorage saat inisialisasi
        const storedShips = localStorage.getItem(LOCAL_STORAGE_KEY);
        try {
            return storedShips ? JSON.parse(storedShips) : initialShipsData;
        } catch (e) {
            console.error("Gagal memuat data kapal dari localStorage", e);
            return initialShipsData; // Kembali ke data awal jika ada error parsing
        }
    });

    // Efek untuk menyimpan data kapal ke localStorage setiap kali state 'ships' berubah
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ships));
        } catch (e) {
            console.error("Gagal menyimpan data kapal ke localStorage:", e);
            // Handle error penyimpanan jika perlu (misal: kuota penuh)
        }
    }, [ships]); // Dependensi: jalankan efek setiap kali 'ships' berubah

    // Fungsi untuk menambah kapal baru
    const addShip = (newShip) => {
        // Buat ID unik sederhana (bisa disempurnakan jika perlu)
        const id = `S${Date.now()}`; 
        setShips([...ships, { ...newShip, id }]);
        alert(`Kapal "${newShip.name}" berhasil ditambahkan!`);
    };

    // Fungsi untuk mengedit kapal
    const updateShip = (id, updatedShipData) => {
        setShips(ships.map(ship => 
            ship.id === id ? { ...ship, ...updatedShipData } : ship
        ));
        alert(`Kapal "${updatedShipData.name}" berhasil diperbarui!`);
    };

    // Fungsi untuk menghapus kapal
    const deleteShip = (id) => {
        const shipToDelete = ships.find(ship => ship.id === id);
        setShips(ships.filter(ship => ship.id !== id));
        if (shipToDelete) alert(`Kapal "${shipToDelete.name}" berhasil dihapus!`);
    };

    // Mengembalikan data kapal dan fungsi-fungsi manipulasi
    return {
        ships,
        addShip,
        updateShip,
        deleteShip,
    };
}

export default useShips;
