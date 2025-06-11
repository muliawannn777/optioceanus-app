import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import useUserData from './hooks/useUserData'; // Untuk mendapatkan daftar kapal & fungsi addVoyage
import { Timestamp } from 'firebase/firestore'; // Impor Timestamp dari Firestore
import styles from './AddVoyageForm.module.css'; // Buat file CSS Module ini nanti
import Panel from './Panel'; // Opsional, untuk konsistensi tampilan

function AddVoyageForm({ onVoyageAdded, existingVoyageData, onCancelEdit, defaultShipId }) {
    const { theme } = useTheme();
    const { ships, loadingShips, addVoyage, updateVoyage } = useUserData(); // Ambil fungsi addVoyage dan updateVoyage
    // Gunakan defaultShipId jika ada dan tidak dalam mode edit
    const [selectedShipId, setSelectedShipId] = useState(existingVoyageData ? '' : defaultShipId || '');
    const [voyageName, setVoyageName] = useState('');
    const [departurePort, setDeparturePort] = useState('');
    const [arrivalPort, setArrivalPort] = useState('');
    const [etd, setEtd] = useState('');
    const [eta, setEta] = useState('');
    const [atd, setAtd] = useState('');
    const [ata, setAta] = useState('');
    const [distanceSailed, setDistanceSailed] = useState('');
    const [fuelConsumedByFuelType, setFuelConsumedByFuelType] = useState({});
    const [averageSpeed, setAverageSpeed] = useState('');
    const [cargoCarried, setCargoCarried] = useState('');
    const [cargoCarriedUnit, setCargoCarriedUnit] = useState('Tonnes');
    const [notes, setNotes] = useState('');

    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    // Faktor Emisi CO2 (Ton CO2 / Ton Bahan Bakar) - Nilai Ilustratif, perlu diverifikasi dari sumber resmi IMO/Industri
    const CO2_EMISSION_FACTORS = {
        LSFO: 3.151, // Menggunakan faktor MGO/MDO sebagai proxy
        MGO: 3.151,
        HFO: 3.114,
        LPG: 3.000, // Nilai perkiraan
        LNG: 2.750, // Nilai perkiraan (hanya CO2, tanpa methane slip)
        Methanol: 1.375,
        Ethanol: 1.910,
        Ethane: 2.950,
        Other: 3.200, // Faktor default jika jenis lain tidak diketahui
    };


    const isEditing = !!existingVoyageData;

    useEffect(() => {
        if (isEditing && existingVoyageData) {
            setSelectedShipId(existingVoyageData.shipId || '');
            setVoyageName(existingVoyageData.voyageName || '');
            setDeparturePort(existingVoyageData.departurePort || '');
            setArrivalPort(existingVoyageData.arrivalPort || '');
            setEtd(existingVoyageData.etd?.toDate ? existingVoyageData.etd.toDate().toISOString().slice(0, 16) : '');
            setEta(existingVoyageData.eta?.toDate ? existingVoyageData.eta.toDate().toISOString().slice(0, 16) : '');
            setAtd(existingVoyageData.atd instanceof Timestamp ? existingVoyageData.atd.toDate().toISOString().slice(0, 16) : (existingVoyageData.atd || ''));
            setAta(existingVoyageData.ata instanceof Timestamp ? existingVoyageData.ata.toDate().toISOString().slice(0, 16) : (existingVoyageData.ata || ''));
            setDistanceSailed(existingVoyageData.distanceSailed?.toString() || '');
            setFuelConsumedByFuelType(existingVoyageData.fuelConsumedByFuelType || {}); // Pastikan ini objek
            setAverageSpeed(existingVoyageData.averageSpeed?.toString() || '');
            setCargoCarried(existingVoyageData.cargoCarried?.toString() || '');
            setCargoCarriedUnit(existingVoyageData.cargoCarriedUnit || 'Tonnes');
            setNotes(existingVoyageData.notes || '');
        } else if (defaultShipId && !isEditing) {
            // Jika mode tambah baru dan ada defaultShipId, set kapal yang dipilih
            setSelectedShipId(defaultShipId);
        }
    }, [isEditing, existingVoyageData, defaultShipId]);


    const selectedShip = ships.find(ship => ship.id === selectedShipId);

    const handleFuelConsumedChange = (fuelType, value) => {
        setFuelConsumedByFuelType(prev => ({
            ...prev,
            [fuelType]: value ? parseFloat(value) : 0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoadingSubmit(true);

        console.log('Form Values on Submit:', {
            selectedShipId,
            departurePort,
            arrivalPort,
            atd,
            ata,
            distanceSailed,
            fuelConsumedByFuelType // Untuk melihat konsumsi bahan bakar juga
        });

        if (!selectedShipId || !departurePort || !arrivalPort || !atd || !ata || !distanceSailed) {
            setError('Kapal, Pelabuhan, ATD, ATA, dan Jarak Tempuh harus diisi.');
            setIsLoadingSubmit(false);
            return;
        }

        // --- Kalkulasi Metrik ---
        const actualDepartureTime = new Date(atd);
        const actualArrivalTime = new Date(ata);

        // Durasi Perjalanan dalam Jam
        const voyageDurationMs = actualArrivalTime.getTime() - actualDepartureTime.getTime();
        const voyageDurationHours = voyageDurationMs > 0 ? voyageDurationMs / (1000 * 60 * 60) : 0;

        // Total Konsumsi Bahan Bakar (Ton)
        const totalFuelConsumed = Object.values(fuelConsumedByFuelType).reduce((sum, amount) => sum + amount, 0);

        // Emisi CO2 (Ton)
        let co2Emissions = 0;
        for (const fuelType in fuelConsumedByFuelType) {
            const consumed = fuelConsumedByFuelType[fuelType];
            const factor = CO2_EMISSION_FACTORS[fuelType] || CO2_EMISSION_FACTORS['Other']; // Gunakan faktor 'Other' jika jenis tidak dikenal
            if (consumed > 0 && factor) {
                co2Emissions += consumed * factor;
            }
        }

        // Efisiensi Bahan Bakar per NM (Ton / NM)
        const fuelConsumptionPerNm = distanceSailed > 0 ? totalFuelConsumed / parseFloat(distanceSailed) : 0;

        // --- Siapkan Data untuk Disimpan ---
        const voyageData = {
            shipId: selectedShipId,
            shipName: selectedShip?.name || 'Unknown Ship', // Simpan nama kapal untuk kemudahan display
            voyageName,
            departurePort,
            arrivalPort,
            etd: etd ? Timestamp.fromDate(new Date(etd)) : null, // Konversi ke Timestamp Firestore
            eta: eta ? Timestamp.fromDate(new Date(eta)) : null, // Konversi ke Timestamp Firestore
            atd: Timestamp.fromDate(actualDepartureTime), // Konversi ke Timestamp Firestore
            ata: Timestamp.fromDate(actualArrivalTime), // Konversi ke Timestamp Firestore
            distanceSailed: parseFloat(distanceSailed),
            fuelConsumedByFuelType, // Sudah objek
            averageSpeed: averageSpeed ? parseFloat(averageSpeed) : null,
            cargoCarried: cargoCarried ? parseFloat(cargoCarried) : null,
            cargoCarriedUnit: cargoCarried ? cargoCarriedUnit : null,
            notes,
            // Tambahkan hasil kalkulasi ke data yang akan disimpan
            voyageDurationHours: voyageDurationHours,
            totalFuelConsumed: totalFuelConsumed,
            co2Emissions: co2Emissions,
            fuelConsumptionPerNm: fuelConsumptionPerNm,
            // Anda juga bisa menambahkan EEOI di sini jika data cargoCarried tersedia dan sudah dihitung
        };


        try {
            if (isEditing) {
                await updateVoyage(existingVoyageData.id, voyageData);
                // await updateVoyage(existingVoyageData.id, voyageData); // Fungsi ini perlu dibuat di useUserData
                alert('Data perjalanan berhasil diperbarui! (Fungsi update belum diimplementasikan sepenuhnya)');
            } else {
                await addVoyage(voyageData);
                alert('Data perjalanan berhasil ditambahkan!');
            }
            if (onVoyageAdded) onVoyageAdded();
            if (isEditing && onCancelEdit) onCancelEdit();
            if (!isEditing) resetForm();
        } catch (err) {
            setError(err.message);
            console.error("Error submitting voyage data:", err);
            alert(`Gagal menyimpan data perjalanan: ${err.message}`);
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    const resetForm = () => {
        // Reset semua state form
        setSelectedShipId('');
        setVoyageName('');
        setDeparturePort('');
        setArrivalPort('');
        setEtd('');
        setEta('');
        setAtd('');
        setAta('');
        setDistanceSailed('');
        setAverageSpeed('');
        setCargoCarried('');
        setCargoCarriedUnit('Tonnes');
        setNotes('');
        setFuelConsumedByFuelType({});
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

    if (loadingShips) return <p>Memuat daftar kapal...</p>;

    return (
        <Panel title={isEditing ? "Edit Data Perjalanan" : "Tambah Data Perjalanan Baru"}>
            <form onSubmit={handleSubmit} className={styles.voyageForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="selectedShipId">Pilih Kapal:</label>
                    <select id="selectedShipId" value={selectedShipId} onChange={(e) => setSelectedShipId(e.target.value)} style={inputStyle} required>
                        <option value="">-- Pilih Kapal --</option>
                        {ships.map(ship => (
                            <option key={ship.id} value={ship.id}>{ship.name} (IMO: {ship.imoNumber || 'N/A'})</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="voyageName">Nama/Kode Perjalanan (Opsional):</label>
                    <input type="text" id="voyageName" value={voyageName} onChange={(e) => setVoyageName(e.target.value)} style={inputStyle} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="departurePort">Pelabuhan Keberangkatan:</label>
                    <input type="text" id="departurePort" value={departurePort} onChange={(e) => setDeparturePort(e.target.value)} style={inputStyle} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="arrivalPort">Pelabuhan Tujuan:</label>
                    <input type="text" id="arrivalPort" value={arrivalPort} onChange={(e) => setArrivalPort(e.target.value)} style={inputStyle} required />
                </div>

                {/* Input untuk ETD, ETA, ATD, ATA, distanceSailed, averageSpeed, cargoCarried, cargoCarriedUnit, notes */}
                {/* ... (field lainnya yang sudah ada atau akan ditambahkan) ... */}
                <div className={styles.formGroup}>
                    <label htmlFor="atd">Waktu Keberangkatan Aktual (ATD):</label>
                    <input type="datetime-local" id="atd" value={atd} onChange={(e) => setAtd(e.target.value)} style={inputStyle} required />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="ata">Waktu Kedatangan Aktual (ATA):</label>
                    <input type="datetime-local" id="ata" value={ata} onChange={(e) => setAta(e.target.value)} style={inputStyle} required />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="distanceSailed">Jarak Tempuh (Nautical Miles):</label>
                    <input type="number" step="0.1" id="distanceSailed" value={distanceSailed} onChange={(e) => setDistanceSailed(e.target.value)} style={inputStyle} required />
                </div>

                {/* Input Dinamis untuk Konsumsi Bahan Bakar */}
                {selectedShip && selectedShip.fuelTypes && selectedShip.fuelTypes.length > 0 && (
                    <div className={styles.formSection}>
                        <h5 className={styles.sectionTitle}>Konsumsi Bahan Bakar (Ton)</h5>
                        {selectedShip.fuelTypes.map(fuelType => (
                            <div className={styles.formGroup} key={fuelType}>
                                <label htmlFor={`fuel-${fuelType}`}>{fuelType}:</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id={`fuel-${fuelType}`}
                                    value={fuelConsumedByFuelType[fuelType] || ''}
                                    onChange={(e) => handleFuelConsumedChange(fuelType, e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton} style={buttonStyle} disabled={isLoadingSubmit}>
                        {isLoadingSubmit ? 'Menyimpan...' : (isEditing ? 'Update Perjalanan' : 'Simpan Perjalanan')}
                    </button>
                    {isEditing && onCancelEdit && (
                        <button type="button" onClick={onCancelEdit} className={styles.cancelButton} /* style={cancelButtonStyle} */>
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </Panel>
    );
}

export default AddVoyageForm;