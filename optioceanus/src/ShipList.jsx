import React, { useState } from "react"; // Impor useState
import ShipItem from "./ShipItem";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import useUserData from "./hooks/useUserData"; // Ganti useShips dengan useUserData
import AddShipForm from "./AddShipForm"; // Impor AddShipForm
import styles from "./ShipList.module.css"; // Impor CSS Module

function ShipList() {
    const { theme } = useTheme();
    // Gunakan hook useUserData
    const { ships, loadingShips, errorShips, addShip, updateShip, deleteShip } = useUserData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentShip, setCurrentShip] = useState(null); // Untuk menyimpan data kapal yang akan diedit
    const [searchTerm, setSearchTerm] = useState(''); // State untuk query pencarian
    const [selectedType, setSelectedType] = useState(''); // State untuk filter tipe kapal

    const containerStyle = {
        border: `1px solid ${theme === 'light' ? '#dee2e6' : '#495057'}`,
        backgroundColor: theme === 'light' ? '#ffffff' : '#343a40',
    };

    const linkStyle = {
        color: theme === 'light' ? '#212529' : '#f8f9fa',
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#495057', // Latar belakang item list
    };

    const deleteButtonStyle = {
        backgroundColor: theme === 'light' ? '#dc3545' : '#e63946',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '0.9em',
    };

    const editButtonStyle = {
        backgroundColor: theme === 'light' ? '#ffc107' : '#f0ad4e', // Warna kuning untuk edit
        color: theme === 'light' ? '#212529' : '#ffffff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '0.9em',
    };

    const handleEdit = (ship) => {
        setIsEditing(true);
        setCurrentShip(ship);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentShip(null);
    };

    const handleDeleteShip = async (shipId, shipName) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus kapal "${shipName}"?`)) {
            try {
                await deleteShip(shipId);
                alert(`Kapal "${shipName}" berhasil dihapus!`);
            } catch (error) {
                alert(`Gagal menghapus kapal: ${error.message}`);
            }
        }
    };
    // Dapatkan tipe kapal yang unik untuk opsi filter
    const uniqueShipTypes = Array.from(new Set(ships.map(ship => ship.type))).sort();

    // Filter kapal berdasarkan searchTerm dan selectedType
    const filteredShips = ships.filter(ship => {
        const nameMatch = ship.name.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = selectedType ? ship.type === selectedType : true; // Jika tidak ada tipe dipilih, anggap cocok
        return nameMatch && typeMatch;
    }

    );

    const searchInputStyle = {
        padding: '8px',
        marginBottom: '15px',
        width: '100%', // Atau sesuaikan lebarnya
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: `1px solid ${theme === 'light' ? '#ced4da' : '#6c757d'}`,
        backgroundColor: theme === 'light' ? '#ffffff' : '#495057',
        color: theme === 'light' ? '#495057' : '#f8f9fa',
    };

    const filterSelectStyle = {
        padding: '8px',
        marginBottom: '15px',
        marginLeft: '10px', // Beri jarak dari input search
        minWidth: '150px', // Lebar minimum untuk dropdown
        borderRadius: '4px',
        border: `1px solid ${theme === 'light' ? '#ced4da' : '#6c757d'}`,
        backgroundColor: theme === 'light' ? '#ffffff' : '#495057',
        color: theme === 'light' ? '#495057' : '#f8f9fa',
    };


    return (
        <div>
            <AddShipForm onAddShip={addShip} isEditing={isEditing} currentShip={currentShip} onUpdateShip={updateShip} onCancelEdit={handleCancelEdit} />
            <div className={styles.shipListContainer} style={containerStyle}>
                <h3 className={styles.shipListTitle}>Daftar Kapal</h3>
                <div className={styles.filterControls}> {/* Tambahkan div pembungkus */}
                    <input
                        type="text"
                        placeholder="Cari kapal berdasarkan nama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInputStyle}
                        className={styles.searchInput} /* Tambahkan kelas jika perlu styling spesifik */
                    />
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={filterSelectStyle}
                        className={styles.filterSelect} /* Tambahkan kelas jika perlu styling spesifik */
                    >
                        <option value="">Semua Tipe</option>
                        {uniqueShipTypes.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div> {/* Penutup untuk filterControls dipindahkan ke sini */}
                {loadingShips && <p>Memuat data kapal...</p>} 
                {errorShips && <p className={styles.errorMessage}>Error memuat kapal: {errorShips}</p>}
                
                {!loadingShips && !errorShips && filteredShips && filteredShips.length > 0 ? (
                    <ul className={styles.shipListUl}>
                        {filteredShips.map((ship) => (
                            <li key={ship.id} className={styles.shipListItem} style={linkStyle /* Terapkan style link ke li agar background konsisten */}>
                                <div className={styles.shipItemContent}>
                                    <Link to={`/ship/${ship.id}`} className={styles.shipListItemLink} > {/* Hapus style dari Link, pindah ke li atau atur di CSS */}
                                        <ShipItem ship={ship} />
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(ship)}
                                        style={editButtonStyle}
                                        className={styles.editButton}>Edit</button>
                                    <button 
                                        onClick={() => handleDeleteShip(ship.id, ship.name)}
                                        style={deleteButtonStyle}
                                        className={styles.deleteButton}>Hapus</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loadingShips && !errorShips && ( // Hanya tampilkan pesan ini jika tidak loading dan tidak ada error
                        <p className={styles.noShipsMessage}>
                            {ships.length > 0 ? 'Tidak ada kapal yang cocok dengan pencarian Anda.' : 'Belum ada data kapal. Silakan tambahkan kapal baru.'}
                        </p>
                    )
                )}
            </div>
        </div>
    )
}

export default ShipList;