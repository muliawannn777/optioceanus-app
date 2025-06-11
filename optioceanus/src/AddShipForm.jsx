import React, { useState, useEffect } from 'react'; // Impor useEffect
import { useTheme } from './ThemeContext';
import styles from './AddShipForm.module.css'; // Kita akan buat file CSS Module ini nanti

function AddShipForm({ onAddShip, isEditing, currentShip, onUpdateShip, onCancelEdit }) {
    const { theme } = useTheme();
    // State untuk field form
    const [name, setName] = useState('');
    const [type, setType] = useState(''); // Kembalikan ke string kosong agar "Pilih Tipe Kapal" muncul
    const [imoNumber, setImoNumber] = useState('');
    const [yearBuilt, setYearBuilt] = useState(new Date().getFullYear().toString()); // Default ke tahun sekarang
    const [owner, setOwner] = useState('PT Pertamina International Shipping (PIS)'); // Default owner
    const [dwt, setDwt] = useState('');
    const [gt, setGt] = useState('');
    const [loa, setLoa] = useState(''); // Length Overall
    const [cargoCapacity, setCargoCapacity] = useState('');
    const [cargoCapacityUnit, setCargoCapacityUnit] = useState('m³'); // Default unit
    const [maxSpeed, setMaxSpeed] = useState('');
    const [serviceSpeed, setServiceSpeed] = useState('');
    const [fuelSystemType, setFuelSystemType] = useState('Conventional'); // Default
    const [availableFuelTypes, setAvailableFuelTypes] = useState({ // Sesuaikan dengan daftar Cf
        'Heavy Fuel Oil (HFO)': false,
        'Light Fuel Oil (LFO)': false,
        'Diesel/Gas Oil': false, // Ini bisa mencakup MGO
        LNG: false,
        Methanol: false,
    });
    const [primaryFuelType, setPrimaryFuelType] = useState('');
    // const [currentCIIRating, setCurrentCIIRating] = useState(''); // State untuk CII Rating DIHAPUS
    // Tambahkan state lain jika diperlukan (engineModel, propulsionType, hasEnergySavingDevices, dll.)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false); // Deklarasikan state isLoadingSubmit

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingSubmit(true);

        // Validasi sederhana, bisa diperluas
        if (!name || !type || !serviceSpeed || !yearBuilt || !imoNumber || !owner) {
            alert('Nama, Tipe, Nomor IMO, Kecepatan Servis, Tahun Pembuatan, dan Pemilik harus diisi!');
            setIsLoadingSubmit(false); // Hentikan loading jika validasi gagal
            return;
        }

        const selectedFuelTypes = Object.keys(availableFuelTypes).filter(ft => availableFuelTypes[ft]);

        const shipData = {
            name,
            type,
            imoNumber,
            yearBuilt: parseInt(yearBuilt, 10),
            owner,
            DWT: dwt ? parseFloat(dwt) : null,
            GT: gt ? parseFloat(gt) : null,
            LoA: loa ? parseFloat(loa) : null,
            cargoCapacity: cargoCapacity ? parseFloat(cargoCapacity) : 0, // Default ke 0 jika kosong
            cargoCapacityUnit,
            maxSpeed: maxSpeed ? parseFloat(maxSpeed) : null,
            serviceSpeed: parseFloat(serviceSpeed),
            fuelSystemType,
            fuelTypes: selectedFuelTypes,
            primaryFuelType: selectedFuelTypes.includes(primaryFuelType) ? primaryFuelType : (selectedFuelTypes.length > 0 ? selectedFuelTypes[0] : ''),
            // currentCIIRating, // CII Rating DIHAPUS dari data kapal yang disimpan
            // Tambahkan field lain ke shipData
        };

        try {
            if (isEditing) {
                await onUpdateShip(currentShip.id, shipData); // Panggil fungsi update jika sedang edit
                alert(`Kapal "${shipData.name}" berhasil diperbarui!`);
            } else {
                await onAddShip(shipData); // Panggil fungsi add jika tidak sedang edit
                alert(`Kapal "${shipData.name}" berhasil ditambahkan!`);
            }
            // Reset form dan mode edit hanya jika sukses
            resetForm();
            if (isEditing && onCancelEdit) {
                onCancelEdit(); // Keluar dari mode edit setelah update
            }
        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            setIsLoadingSubmit(false); // Hentikan loading
        }

    };

    const resetForm = () => {
        setName('');
        setType(''); // Reset ke string kosong
        setImoNumber('');
        setYearBuilt(new Date().getFullYear().toString());
        setOwner('PT Pertamina International Shipping (PIS)');
        setDwt('');
        setGt('');
        setLoa('');
        setCargoCapacity('');
        setCargoCapacityUnit('m³');
        setMaxSpeed('20'); // Default max speed untuk slider
        setServiceSpeed('15'); // Default service speed untuk slider
        setFuelSystemType('Conventional');
        setAvailableFuelTypes({ 
            'Heavy Fuel Oil (HFO)': false,
            'Light Fuel Oil (LFO)': false,
            'Diesel/Gas Oil': false,
            LNG: false,
            Methanol: false,
        });
        setPrimaryFuelType('');
        // setCurrentCIIRating(''); // Reset CII Rating DIHAPUS
        // Reset state lain
    };

    // Efek untuk mengisi form jika sedang dalam mode edit dan currentShip berubah
    useEffect(() => {
        if (isEditing && currentShip) {
            setName(currentShip.name || '');
            setType(currentShip.type || ''); // Gunakan tipe dari data lama, atau kosong jika baru
            setImoNumber(currentShip.imoNumber || '');
            setYearBuilt(currentShip.yearBuilt?.toString() || new Date().getFullYear().toString());
            setOwner(currentShip.owner || 'PT Pertamina International Shipping (PIS)');
            setDwt(currentShip.DWT?.toString() || '');
            setGt(currentShip.GT?.toString() || '');
            setLoa(currentShip.LoA?.toString() || '');
            setCargoCapacity(currentShip.cargoCapacity?.toString() || '');
            setCargoCapacityUnit(currentShip.cargoCapacityUnit || 'm³');
            setMaxSpeed(currentShip.maxSpeed?.toString() || '20');
            setServiceSpeed(currentShip.serviceSpeed?.toString() || '15');
            setFuelSystemType(currentShip.fuelSystemType || 'Conventional');
            
            const currentFuels = {};
            for (const key in availableFuelTypes) {
                currentFuels[key] = currentShip.fuelTypes?.includes(key) || false;
            }
            setAvailableFuelTypes(currentFuels);
            setPrimaryFuelType(currentShip.primaryFuelType || '');
            // setCurrentCIIRating(currentShip.currentCIIRating || ''); // Isi CII Rating DIHAPUS
            // Isi state lain dari currentShip
        } else {
            resetForm(); // Reset form jika tidak dalam mode edit
        }
    }, [isEditing, currentShip]);

    const handleFuelTypeChange = (event) => {
        const { name, checked } = event.target;
        setAvailableFuelTypes(prev => ({ ...prev, [name]: checked }));
    };

    const possiblePrimaryFuels = Object.keys(availableFuelTypes).filter(ft => availableFuelTypes[ft]);

    const formStyle = {
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#3e444a',
        borderColor: theme === 'light' ? '#dee2e6' : '#5a6268',
    };

    const inputStyle = {
        backgroundColor: theme === 'light' ? '#ffffff' : '#495057',
        color: theme === 'light' ? '#495057' : '#f8f9fa',
        borderColor: theme === 'light' ? '#ced4da' : '#6c757d',
    };

    const buttonStyle = {
        backgroundColor: theme === 'light' ? '#007bff' : '#66aaff',
        color: theme === 'light' ? '#ffffff' : '#212529',
    };

    const cancelButtonSyle = {
        backgroundColor: theme === 'light' ? '#6c757d' : '#5a6268', // Warna abu-abu untuk cancel
        color: 'white',
        marginLeft: '10px',
    }

    return (
        <div className={styles.formWrapper} style={formStyle}>
            <h4 className={styles.formTitle}>{isEditing ? `Edit Kapal: ${currentShip?.name}` : 'Tambah Kapal Baru'}</h4>
            <form onSubmit={handleSubmit} className={styles.addShipForm}>
                {/* Bagian Informasi Umum */}
                <div className={styles.formGroup}>
                    <label htmlFor="shipName">Nama Kapal:</label>
                    <input
                        type="text"
                        id="shipName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="shipType">Tipe Kapal:</label>
                    <select
                        id="shipType"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={inputStyle}
                        required // Tetap required
                        // Hapus atribut disabled agar dropdown bisa dipilih
                    >
                        <option value="">Pilih Jenis Tanker</option>
                        <option value="Tanker (General Purpose)">Tanker (General Purpose)</option>
                        <option value="Crude Oil Tanker">Crude Oil Tanker</option>
                        <option value="Product Tanker">Product Tanker</option>
                        <option value="Chemical Tanker">Chemical Tanker</option>
                        <option value="VLGC (Very Large Gas Carrier)">VLGC (Very Large Gas Carrier)</option>
                        <option value="Gas Carrier (LNG)">Gas Carrier (LNG)</option>
                        <option value="Gas Carrier (LPG)">Gas Carrier (LPG)</option>
                        <option value="Other">Lainnya (Other)</option>
                    </select>
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="imoNumber">Nomor IMO:</label>
                    <input type="text" id="imoNumber" value={imoNumber} onChange={(e) => setImoNumber(e.target.value)} style={inputStyle} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="yearBuilt">Tahun Pembuatan:</label>
                    <input
                        type="number"
                        id="yearBuilt"
                        value={yearBuilt}
                        onChange={(e) => setYearBuilt(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="owner">Pemilik/Operator:</label>
                    <input 
                        type="text" 
                        id="owner" 
                        value={owner} 
                        onChange={(e) => setOwner(e.target.value)} // Tetap bisa diubah jika diperlukan, atau buat readOnly
                        style={inputStyle} 
                        readOnly // Membuat field ini read-only
                    />
                </div>

                {/* Bagian Spesifikasi Teknis */}
                <h5 className={styles.sectionTitle}>Spesifikasi Teknis</h5>
                <div className={styles.formGroup}>
                    <label htmlFor="dwt">DWT (Deadweight Tonnage):</label>
                    <input type="number" id="dwt" value={dwt} onChange={(e) => setDwt(e.target.value)} style={inputStyle} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="gt">GT (Gross Tonnage):</label>
                    <input type="number" id="gt" value={gt} onChange={(e) => setGt(e.target.value)} style={inputStyle} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="loa">LoA (Length Overall) (m):</label>
                    <input type="number" id="loa" value={loa} onChange={(e) => setLoa(e.target.value)} style={inputStyle} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="cargoCapacity">Kapasitas Muatan:</label>
                    <input type="number" id="cargoCapacity" value={cargoCapacity} onChange={(e) => setCargoCapacity(e.target.value)} style={inputStyle} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="cargoCapacityUnit">Satuan Kapasitas Muatan:</label>
                    <select id="cargoCapacityUnit" value={cargoCapacityUnit} onChange={(e) => setCargoCapacityUnit(e.target.value)} style={inputStyle}>
                        <option value="m³">m³ (meter kubik)</option>
                        <option value="TEU">TEU</option>
                        <option value="barrels">Barrels</option>
                        <option value="tonnes">Tonnes</option>
                        <option value="DWT">DWT</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="maxSpeed">Kecepatan Maksimum (knot): {maxSpeed} knot</label>
                    <input 
                        type="range" 
                        id="maxSpeed" 
                        min="0" 
                        max="40" // Sesuaikan rentang maks
                        step="0.5"
                        value={maxSpeed} 
                        onChange={(e) => setMaxSpeed(e.target.value)} 
                        className={styles.slider} // Tambahkan kelas untuk styling slider
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="serviceSpeed">Kecepatan Servis (knot): {serviceSpeed} knot</label>
                    <input
                        type="range"
                        id="serviceSpeed"
                        min="0"
                        max="30" // Sesuaikan rentang maks
                        step="0.5"
                        value={serviceSpeed}
                        onChange={(e) => setServiceSpeed(e.target.value)}
                        className={styles.slider} // Tambahkan kelas untuk styling slider
                        // required tidak berlaku untuk type="range" secara default, validasi di handleSubmit
                    />
                    {/* Jika ingin input number juga untuk serviceSpeed, bisa ditambahkan di sini */}
                    {/* <input type="number" value={serviceSpeed} onChange={(e) => setServiceSpeed(e.target.value)} style={inputStyle} required /> */}
                </div>

                {/* Bagian Bahan Bakar & Emisi */}
                <h5 className={styles.sectionTitle}>Informasi Bahan Bakar & Emisi</h5>
                <div className={styles.formGroup}>
                    <label htmlFor="fuelSystemType">Tipe Sistem Bahan Bakar:</label>
                    <select id="fuelSystemType" value={fuelSystemType} onChange={(e) => setFuelSystemType(e.target.value)} style={inputStyle}>
                        <option value="Conventional">Konvensional</option>
                        <option value="Dual Fuel">Dual Fuel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Listrik Penuh</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Jenis Bahan Bakar yang Dapat Digunakan:</label>
                    <div className={styles.checkboxGroup}>
                        {Object.keys(availableFuelTypes).map(fuelKey => (
                            <div key={fuelKey} className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    id={`fuel-${fuelKey}`}
                                    name={fuelKey}
                                    checked={availableFuelTypes[fuelKey]}
                                    onChange={handleFuelTypeChange}
                                />
                                <label htmlFor={`fuel-${fuelKey}`}>{fuelKey}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {possiblePrimaryFuels.length > 0 && (
                    <div className={styles.formGroup}>
                        <label htmlFor="primaryFuelType">Bahan Bakar Utama Digunakan:</label>
                        <select 
                            id="primaryFuelType" 
                            value={primaryFuelType} 
                            onChange={(e) => setPrimaryFuelType(e.target.value)} 
                            style={inputStyle}
                            disabled={possiblePrimaryFuels.length === 0}
                        >
                            <option value="">Pilih Bahan Bakar Utama</option>
                            {possiblePrimaryFuels.map(fuel => (
                                <option key={fuel} value={fuel}>{fuel}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 
                Tambahkan field untuk:
                - engineModel (text)
                - propulsionType (text atau select)
                - hasEnergySavingDevices (checkboxes)
                - attainedEEXI (number)
                - requiredEEXI (number)
                - currentCIIRating (select A-E)
                */}

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton} style={buttonStyle} disabled={isLoadingSubmit}>
                        {isLoadingSubmit ? 'Memproses...' : (isEditing ? 'Update Kapal' : 'Tambah Kapal')}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={onCancelEdit} className={styles.cancelButton} style={{...buttonStyle, ...cancelButtonSyle}}>
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default AddShipForm;