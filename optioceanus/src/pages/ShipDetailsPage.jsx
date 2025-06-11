import React, { useState } from 'react'; // useState sudah diimpor
import { useParams, Link } from 'react-router-dom';
import useUserData from '../hooks/useUserData';
import { useTheme } from '../ThemeContext';
import styles from './ShipDetailsPage.module.css';
import Panel from '../Panel';
import AddVoyageForm from '../AddVoyageForm'; // Impor AddVoyageForm
// Impor untuk Chart.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Adapter untuk sumbu waktu

function ShipDetailsPage() {
    const { shipId } = useParams();
    // Ambil juga data voyages dan fungsi terkait
    const { 
        ships, loadingShips, errorShips, 
        voyages, loadingVoyages, errorVoyages, 
        deleteVoyage // Tambahkan deleteVoyage jika ingin implementasi hapus perjalanan
    } = useUserData();
    const { theme } = useTheme();
    const [showAddVoyageForm, setShowAddVoyageForm] = useState(false);
    const [editingVoyageData, setEditingVoyageData] = useState(null); // State untuk voyage yang diedit
    
    // State untuk Slow Steaming Simulator
    const [selectedVoyageForSim, setSelectedVoyageForSim] = useState('');
    const [newTargetSpeedSim, setNewTargetSpeedSim] = useState('');
    const [simulationResult, setSimulationResult] = useState(null);

    // Registrasi elemen Chart.js yang akan digunakan
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        TimeScale, // Untuk sumbu X berbasis waktu
        Title,
        Tooltip,
        Legend
    );

    // Filter dan urutkan voyages untuk kapal saat ini berdasarkan tanggal ATA
    const currentShipVoyages = voyages.filter(voyage => voyage.shipId === shipId);
    const ship = ships.find(s => s.id === shipId);

    console.log('ShipDetailsPage - shipId from URL:', shipId);
    console.log('ShipDetailsPage - ships array:', ships);
    console.log('ShipDetailsPage - found ship object:', ship);

    const linkStyle = {
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 15px',
        borderRadius: '4px',
        textDecoration: 'none',
        backgroundColor: theme === 'light' ? '#007bff' : '#66aaff',
        color: theme === 'light' ? '#ffffff' : '#212529',
        transition: 'filter 0.2s ease-in-out',
    };

    const actionButtonStyle = {
        ...linkStyle,
        backgroundColor: theme === 'light' ? '#28a745' : '#5cb85c', // Warna hijau
        marginRight: '10px',
    };
    
    const voyageActionButtonStyle = { // Style untuk tombol edit/hapus voyage
        padding: '5px 10px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9em',
        marginLeft: '5px',
    };

    const handleEditVoyage = (voyage) => {
        setEditingVoyageData(voyage);
        setShowAddVoyageForm(true); // Tampilkan form dalam mode edit
    };

    const handleCancelEditVoyage = () => {
        setEditingVoyageData(null);
        setShowAddVoyageForm(false);
    };

    // Faktor Emisi CO2 (Ton CO2 / Ton Bahan Bakar) - dari rangkuman IMO
    const CF_FACTORS = {
        'Heavy Fuel Oil (HFO)': 3.114,
        'Light Fuel Oil (LFO)': 3.151,
        'Diesel/Gas Oil': 3.206, 
        'LNG': 2.750,
        'Methanol': 1.375,
        // Tambahkan faktor lain jika ada
        'Other': 3.206, // Default jika tidak diketahui, bisa disesuaikan
    };

    // Konstanta untuk perhitungan CII (berdasarkan rangkuman IMO untuk Tanker)
    const CII_CONSTANTS = {
        BASELINE_A: 4740,    // Parameter 'a' untuk baseline CII tanker
        BASELINE_C: -0.622,  // Parameter 'c' untuk baseline CII tanker
        Z_FACTOR_2023: 0.05, // Faktor reduksi Z% untuk 2023 (5%)
        RATING_THRESHOLDS: { // Batas atas untuk setiap rating relatif terhadap RequiredCII
            A: 0.90, // Attained <= Required * 0.90
            B: 0.95, // Required * 0.90 < Attained <= Required * 0.95
            C: 1.00, // Required * 0.95 < Attained <= Required * 1.00
            D: 1.05, // Required * 1.00 < Attained <= Required * 1.05
            // E: > Required * 1.05
        },
        // Konstanta dari main.js untuk methane slip
        METHANE_SLIP_RATE_LNG: 0.01, // Asumsi 1% slip rate untuk LNG
        METHANE_GWP_100_YEAR: 28,    // GWP untuk CH4 selama 100 tahun
    };

    const getPotentialCIIRating = (attainedAER, requiredCII) => {
        if (attainedAER === null || requiredCII === null || requiredCII <= 0) return 'N/A';
        if (attainedAER <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.A) return 'A';
        if (attainedAER <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.B) return 'B';
        if (attainedAER <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.C) return 'C';
        if (attainedAER <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.D) return 'D';
        return 'E';
    };

    const handleSimulateSlowSteaming = () => {
        if (!selectedVoyageForSim || !newTargetSpeedSim) {
            alert("Pilih perjalanan dan masukkan target kecepatan baru untuk simulasi.");
            setSimulationResult(null);
            return;
        }

        const voyageToSimulate = voyages.find(v => v.id === selectedVoyageForSim);
        const targetSpeed = parseFloat(newTargetSpeedSim);

        if (!voyageToSimulate || isNaN(targetSpeed) || targetSpeed <= 0) {
            alert("Data perjalanan tidak valid atau target kecepatan tidak valid.");
            setSimulationResult(null);
            return;
        }

        const historicalAvgSpeed = voyageToSimulate.averageSpeed || (ship && ship.serviceSpeed); // Prioritaskan averageSpeed dari voyage

        if (!historicalAvgSpeed) {
            alert("Kecepatan rata-rata historis tidak tersedia untuk perjalanan ini atau data kapal.");
            setSimulationResult(null);
            return;
        }

        if (targetSpeed >= historicalAvgSpeed) { // Pastikan historicalAvgSpeed valid sebelum perbandingan
            alert("Target kecepatan baru harus lebih rendah dari kecepatan rata-rata perjalanan historis.");
            setSimulationResult(null);
            return;
        }

        const historicalDuration = voyageToSimulate.voyageDurationHours;
        const historicalFuelConsumed = voyageToSimulate.totalFuelConsumed;
        const historicalCO2Emissions = voyageToSimulate.co2Emissions;
        const distance = voyageToSimulate.distanceSailed;

        if (historicalDuration === undefined || historicalFuelConsumed === undefined || distance === undefined || historicalCO2Emissions === undefined) {
            alert("Data perjalanan historis tidak lengkap untuk simulasi (durasi, konsumsi BBM, CO2, atau jarak tidak ada).");
            setSimulationResult(null);
            return;
        }

        // Menggunakan Hukum Pangkat Tiga (Cube Law) untuk konsumsi bahan bakar
        const estimatedNewFuelConsumed = historicalFuelConsumed * Math.pow((targetSpeed / historicalAvgSpeed), 3);

        // Mendapatkan Faktor Emisi (Cf)
        const primaryFuel = ship?.primaryFuelType;
        const cfValue = CF_FACTORS[primaryFuel] || CF_FACTORS['Other']; 

        let estimatedNewCO2Emissions = estimatedNewFuelConsumed * cfValue;
        let historicalCO2EmissionsForAER = historicalCO2Emissions; // Gunakan CO2 historis apa adanya untuk AER historis

        // Jika bahan bakar utama adalah LNG, tambahkan CO2e dari methane slip untuk estimasi baru
        if (primaryFuel === 'LNG') {
            const methaneEmissionCO2e_simulated = estimatedNewFuelConsumed * CII_CONSTANTS.METHANE_SLIP_RATE_LNG * CII_CONSTANTS.METHANE_GWP_100_YEAR;
            estimatedNewCO2Emissions += methaneEmissionCO2e_simulated;
            
            // Asumsikan methane slip juga terjadi pada kondisi historis jika LNG adalah primary fuel
            const methaneEmissionCO2e_historical = historicalFuelConsumed * CII_CONSTANTS.METHANE_SLIP_RATE_LNG * CII_CONSTANTS.METHANE_GWP_100_YEAR;
            historicalCO2EmissionsForAER = (historicalCO2Emissions || 0) + methaneEmissionCO2e_historical; // Jika CO2 historis hanya pembakaran, tambahkan slip
        }
        
        const estimatedNewDuration = distance / targetSpeed; // jam
        const estimatedHistoricalPureSailingDuration = distance / historicalAvgSpeed; // jam, estimasi durasi pelayaran murni historis

        // Perhitungan Voyage AER
        let voyageAER_historical = null;
        let voyageAER_simulated = null;
        let requiredCII_annual = null;
        let potentialRating_historical = 'N/A';
        let potentialRating_simulated = 'N/A';

        if (ship && ship.DWT && ship.DWT > 0 && distance && distance > 0) {
            // Hitung Required CII Tahunan
            const baselineCII = CII_CONSTANTS.BASELINE_A * Math.pow(ship.DWT, CII_CONSTANTS.BASELINE_C);
            requiredCII_annual = baselineCII * (1 - CII_CONSTANTS.Z_FACTOR_2023);

            if (historicalCO2EmissionsForAER !== undefined) { // Gunakan CO2 historis yang sudah disesuaikan (jika LNG)
                voyageAER_historical = (historicalCO2EmissionsForAER * 1000000) / (ship.DWT * distance); // g CO2/ton-nm
                potentialRating_historical = getPotentialCIIRating(voyageAER_historical, requiredCII_annual);
            }
            if (estimatedNewCO2Emissions !== undefined) {
                voyageAER_simulated = (estimatedNewCO2Emissions * 1000000) / (ship.DWT * distance); // g CO2/ton-nm
                potentialRating_simulated = getPotentialCIIRating(voyageAER_simulated, requiredCII_annual);
            }

            // Tambahkan logging di sini untuk debugging
            console.log("Simulasi - Data:", {
                shipDWT: ship.DWT,
                primaryFuel: primaryFuel,
                distance: distance,
                historicalCO2ForAER: historicalCO2EmissionsForAER, // CO2 historis yang digunakan untuk AER
                historicalAvgSpeed_used: historicalAvgSpeed,
                estimatedHistoricalPureSailingDuration_calc: estimatedHistoricalPureSailingDuration,
                simulatedCO2: estimatedNewCO2Emissions,
                voyageAER_historical: voyageAER_historical,
                voyageAER_simulated: voyageAER_simulated,
                requiredCII_annual: requiredCII_annual,
                potentialRating_historical: potentialRating_historical,
                potentialRating_simulated: potentialRating_simulated,
                // thresholds: CII_CONSTANTS.RATING_THRESHOLDS, // Jika ingin lihat thresholds juga
                calculatedRequiredCII: requiredCII_annual, // Tambahkan ini untuk ditampilkan
            }); // <-- Tambahkan penutup kurung dan titik koma di sini
        } else {
            console.warn("Data DWT kapal atau jarak perjalanan tidak valid untuk menghitung Voyage AER.");
        }

        setSimulationResult({ 
            voyageToSimulate, 
            targetSpeed, 
            estimatedNewDuration, 
            estimatedHistoricalPureSailingDuration, // Tambahkan ini
            estimatedNewFuelConsumed, 
            estimatedNewCO2Emissions,
            voyageAER_historical,
            voyageAER_simulated,
            potentialRating_historical,
            calculatedRequiredCII: requiredCII_annual, // Gunakan requiredCII_annual yang sudah dihitung
            potentialRating_simulated
        });
    };


    if (loadingShips || loadingVoyages) { // Cek loading untuk ships dan voyages
        return (
            <Panel title="Memuat Detail Kapal...">
                <p>Silakan tunggu...</p>
            </Panel>
        );
    }
    
    if (errorShips || errorVoyages) {
        return (
            <Panel title="Error">
                {errorShips && <p>Gagal memuat data kapal: {errorShips}</p>}
                {errorVoyages && <p>Gagal memuat data perjalanan: {errorVoyages}</p>}
            </Panel>
        );
    }

    if (!ship) {
        return (
            <Panel title="Kapal Tidak Ditemukan">
                <p>Kapal dengan ID "{shipId}" tidak ditemukan.</p>
                <Link to="/dashboard/shiplist" style={linkStyle} onMouseOver={(e) => e.target.style.filter = 'brightness(90%)'} onMouseOut={(e) => e.target.style.filter = 'brightness(100%)'}>
                    Kembali ke Daftar Kapal
                </Link>
            </Panel>
        );
    }

    return (
        <Panel title={`Detail Kapal: ${ship.name}`}>
            <div className={styles.detailsGrid}>
                <p><strong>ID Kapal (Firestore):</strong> {ship.id}</p>
                <p><strong>Nama:</strong> {ship.name}</p>
                <p><strong>Tipe:</strong> {ship.type}</p>
                <p><strong>Nomor IMO:</strong> {ship.imoNumber || '-'}</p>
                <p><strong>Tahun Pembuatan:</strong> {ship.yearBuilt || '-'}</p>
                <p><strong>Pemilik/Operator:</strong> {ship.owner || '-'}</p>
                <p><strong>DWT (Deadweight Tonnage):</strong> {ship.DWT ? `${ship.DWT} ton` : '-'}</p>
                <p><strong>GT (Gross Tonnage):</strong> {ship.GT ? `${ship.GT} ton` : '-'}</p>
                <p><strong>Kapasitas Muatan:</strong> {ship.cargoCapacity ? `${ship.cargoCapacity} ${ship.cargoCapacityUnit}` : '-'}</p>
                <p><strong>Kecepatan Maksimum:</strong> {ship.maxSpeed ? `${ship.maxSpeed} knot` : '-'}</p>
                <p><strong>Kecepatan Servis:</strong> {ship.serviceSpeed ? `${ship.serviceSpeed} knot` : '-'}</p>
                <p><strong>Tipe Sistem Bahan Bakar:</strong> {ship.fuelSystemType || '-'}</p>
                <p><strong>Jenis Bahan Bakar Dapat Digunakan:</strong> {ship.fuelTypes && ship.fuelTypes.length > 0 ? ship.fuelTypes.join(', ') : '-'}</p>
                <p><strong>Bahan Bakar Utama Digunakan:</strong> {ship.primaryFuelType || '-'}</p>
                <p><strong>Rating CII Saat Ini:</strong> {ship.currentCIIRating ? <span style={getCIIStyle(ship.currentCIIRating, theme)}>{ship.currentCIIRating} ({getCIIFullText(ship.currentCIIRating)})</span> : '-'}</p>
                {/* 
                Tambahkan tampilan untuk field lain jika ada:
                - engineModel, propulsionType, hasEnergySavingDevices
                - attainedEEXI, requiredEEXI, currentCIIRating
                */}
            </div>
            <div className={styles.actionButtonsContainer}>
                <button 
                    onClick={() => {
                        if (editingVoyageData) { // Jika sedang edit, tombol ini jadi "Batal Edit"
                            handleCancelEditVoyage();
                        } else {
                            setShowAddVoyageForm(!showAddVoyageForm);
                        }
                    }}
                    style={actionButtonStyle}
                    onMouseOver={(e) => e.target.style.filter = 'brightness(90%)'} onMouseOut={(e) => e.target.style.filter = 'brightness(100%)'}
                >
                    {showAddVoyageForm && !editingVoyageData ? 'Sembunyikan Form Tambah' : 
                     showAddVoyageForm && editingVoyageData ? 'Batal Edit Perjalanan' : 
                     'Tambah Data Perjalanan'}
                </button>
                <Link to="/dashboard/shiplist" style={linkStyle} onMouseOver={(e) => e.target.style.filter = 'brightness(90%)'} onMouseOut={(e) => e.target.style.filter = 'brightness(100%)'}>
                    Kembali ke Daftar Kapal
                </Link>
            </div>

            {showAddVoyageForm && ( // Form akan ditampilkan untuk mode tambah atau edit
                <AddVoyageForm 
                    defaultShipId={ship.id} // Teruskan ID kapal saat ini
                    existingVoyageData={editingVoyageData}
                    onVoyageAdded={() => {
                        setShowAddVoyageForm(false);
                        setEditingVoyageData(null);
                    }}
                    onCancelEdit={handleCancelEditVoyage}
                />
            )}

            {/* Bagian untuk menampilkan grafik/chart */}
            {console.log('ShipDetailsPage - currentShipVoyages.length:', currentShipVoyages.length)}
            {console.log('ShipDetailsPage - ship object before sim section:', ship)}
            {currentShipVoyages.length > 0 && ship ? (
                <div className={styles.chartsSection}>
                    <h4>Analisis Performa Perjalanan</h4>
                    <Panel title="Tren Emisi CO2 per Perjalanan">
                        <Line 
                            data={{
                                labels: currentShipVoyages
                                    .filter(v => v.ata && v.ata.toDate) // Pastikan ata dan toDate ada
                                    .sort((a, b) => a.ata.toDate() - b.ata.toDate()) // Urutkan berdasarkan tanggal ATA
                                    .map(voyage => voyage.ata.toDate()), // Gunakan objek Date untuk sumbu X
                                datasets: [
                                    {
                                        label: 'Emisi CO2 (Ton)',
                                        data: currentShipVoyages
                                            .filter(v => v.ata && v.ata.toDate)
                                            .sort((a, b) => a.ata.toDate() - b.ata.toDate())
                                            .map(voyage => voyage.co2Emissions),
                                        borderColor: theme === 'light' ? 'rgb(255, 99, 132)' : 'rgba(255, 99, 132, 0.8)',
                                        backgroundColor: theme === 'light' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(255, 99, 132, 0.3)',
                                        tension: 0.1
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                            unit: 'day', // Tampilkan unit per hari, bisa disesuaikan (week, month)
                                            tooltipFormat: 'dd MMM yyyy HH:mm', // Format tooltip
                                            displayFormats: {
                                                day: 'dd MMM yy' // Format tampilan label sumbu X
                                            }
                                        },
                                        title: { display: true, text: 'Tanggal Kedatangan (ATA)' }
                                    },
                                    y: { title: { display: true, text: 'Emisi CO2 (Ton)' } }
                                },
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: false, text: 'Tren Emisi CO2 per Perjalanan' }
                                }
                            }}
                        />
                    </Panel>
                    <Panel title="Tren Efisiensi Bahan Bakar (Ton/NM) per Perjalanan">
                        <Line
                            data={{
                                labels: currentShipVoyages
                                    .filter(v => v.ata && v.ata.toDate)
                                    .sort((a, b) => a.ata.toDate() - b.ata.toDate())
                                    .map(voyage => voyage.ata.toDate()),
                                datasets: [
                                    {
                                        label: 'Efisiensi (Ton/NM)',
                                        data: currentShipVoyages
                                            .filter(v => v.ata && v.ata.toDate)
                                            .sort((a, b) => a.ata.toDate() - b.ata.toDate())
                                            .map(voyage => voyage.fuelConsumptionPerNm),
                                        borderColor: theme === 'light' ? 'rgb(75, 192, 192)' : 'rgba(75, 192, 192, 0.8)',
                                        backgroundColor: theme === 'light' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(75, 192, 192, 0.3)',
                                        tension: 0.1
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                            unit: 'day',
                                            tooltipFormat: 'dd MMM yyyy HH:mm',
                                            displayFormats: {
                                                day: 'dd MMM yy'
                                            }
                                        },
                                        title: { display: true, text: 'Tanggal Kedatangan (ATA)' }
                                    },
                                    y: { title: { display: true, text: 'Efisiensi (Ton/NM)' } }
                                },
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: false, text: 'Tren Efisiensi Bahan Bakar (Ton/NM)' }
                                }
                            }}
                        />
                    </Panel>
                </div>
            ) : (
                console.log('ShipDetailsPage - Simulation section NOT rendered. currentShipVoyages.length:', currentShipVoyages.length, 'ship:', ship)
  )}

            {/* Bagian untuk Simulasi Efek Slow Steaming */}
            {currentShipVoyages.length > 0 && ship && (
                <div className={styles.simulationSection}>
                    <h4>Simulasi Efek Slow Steaming</h4>
                    <Panel title="Konfigurasi Simulasi">
                        <div className={styles.formGroup}>
                            <label htmlFor="selectVoyageForSim">Pilih Perjalanan Historis:</label>
                            <select 
                                id="selectVoyageForSim" 
                                value={selectedVoyageForSim} 
                                onChange={(e) => {
                                    setSelectedVoyageForSim(e.target.value); 
                                    setSimulationResult(null); // Reset hasil simulasi saat perjalanan diubah
                                    const selectedVoyage = voyages.find(v => v.id === e.target.value);
                                    if (selectedVoyage && (selectedVoyage.averageSpeed || selectedVoyage.serviceSpeed || (ship && ship.serviceSpeed))) {
                                        const initialSimSpeed = (selectedVoyage.averageSpeed || selectedVoyage.serviceSpeed || ship.serviceSpeed) - 1;
                                        setNewTargetSpeedSim(initialSimSpeed > 0 ? initialSimSpeed.toFixed(1) : '');
                                    } else {
                                        setNewTargetSpeedSim('');
                                    }
                                }}
                                style={{...actionButtonStyle, backgroundColor: theme === 'light' ? '#fff' : '#495057', color: theme === 'light' ? '#495057' : '#f8f9fa', border: `1px solid ${theme === 'light' ? '#ced4da' : '#6c757d'}`}}
                            >
                                <option value="">-- Pilih Perjalanan --</option>
                                {currentShipVoyages.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.voyageName || `${v.departurePort} ke ${v.arrivalPort} (ATA: ${v.ata?.toDate ? v.ata.toDate().toLocaleDateString() : 'N/A'})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="newTargetSpeedSim">Target Kecepatan Baru (knot):</label>
                            <input 
                                type="number" 
                                id="newTargetSpeedSim" 
                                value={newTargetSpeedSim} 
                                onChange={(e) => setNewTargetSpeedSim(e.target.value)}
                                placeholder="Contoh: 12.5"
                                step="0.1"
                                style={{...actionButtonStyle, backgroundColor: theme === 'light' ? '#fff' : '#495057', color: theme === 'light' ? '#495057' : '#f8f9fa', border: `1px solid ${theme === 'light' ? '#ced4da' : '#6c757d'}`}}
                            />
                        </div>
                        <button onClick={handleSimulateSlowSteaming} style={actionButtonStyle} disabled={!selectedVoyageForSim || !newTargetSpeedSim}>
                            Simulasikan
                        </button>
                    </Panel>

                    {simulationResult && simulationResult.voyageToSimulate && (
                        <Panel title="Hasil Simulasi">
                            <p><strong>Perjalanan Dipilih:</strong> {simulationResult.voyageToSimulate.voyageName || `${simulationResult.voyageToSimulate.departurePort} ke ${simulationResult.voyageToSimulate.arrivalPort}`}</p>
                            {ship && ship.currentCIIRating && (
                                <p><strong>Rating CII Kapal Saat Ini:</strong> <span style={getCIIStyle(ship.currentCIIRating, theme)}>{ship.currentCIIRating} ({getCIIFullText(ship.currentCIIRating)})</span></p>
                            )}
                            <div className={styles.simulationResultGrid}>
                                <div><strong>Parameter</strong></div><div><strong>Historis</strong></div><div><strong>Simulasi (@{parseFloat(simulationResult.targetSpeed).toFixed(1)} knot)</strong></div><div><strong>Perubahan</strong></div>
                                
                                <div>Kecepatan Rata-rata</div><div>{(simulationResult.voyageToSimulate.averageSpeed || (ship && ship.serviceSpeed))?.toFixed(1) || 'N/A'} knot</div><div>{parseFloat(simulationResult.targetSpeed).toFixed(1)} knot</div><div>{(parseFloat(simulationResult.targetSpeed) - (simulationResult.voyageToSimulate.averageSpeed || (ship && ship.serviceSpeed))).toFixed(1)} knot</div>
                                
                                <div>
                                    Estimasi Durasi Pelayaran Murni <span title="Estimasi waktu pelayaran murni pada kecepatan konstan, tidak termasuk waktu manuver, tunggu, atau pengaruh cuaca." style={{cursor: 'help'}}>&#9432;</span>
                                </div>
                                <div>
                                    {simulationResult.estimatedHistoricalPureSailingDuration?.toFixed(1)} jam
                                    <div className={styles.subText}>Total Durasi Aktual Historis: {simulationResult.voyageToSimulate.voyageDurationHours?.toFixed(1)} jam</div>
                                </div>
                                <div>{simulationResult.estimatedNewDuration.toFixed(1)} jam</div>
                                <div>
                                    {(simulationResult.estimatedNewDuration - simulationResult.estimatedHistoricalPureSailingDuration).toFixed(1)} jam 
                                    ({simulationResult.estimatedHistoricalPureSailingDuration > 0 ? (( (simulationResult.estimatedNewDuration - simulationResult.estimatedHistoricalPureSailingDuration) / simulationResult.estimatedHistoricalPureSailingDuration * 100).toFixed(1)) : 'N/A'}%)
                                </div>
                                
                                <div>Total Konsumsi BBM</div><div>{simulationResult.voyageToSimulate.totalFuelConsumed?.toFixed(2)} Ton</div><div>{simulationResult.estimatedNewFuelConsumed.toFixed(2)} Ton</div><div>{(simulationResult.estimatedNewFuelConsumed - simulationResult.voyageToSimulate.totalFuelConsumed).toFixed(2)} Ton ({( (simulationResult.estimatedNewFuelConsumed - simulationResult.voyageToSimulate.totalFuelConsumed) / simulationResult.voyageToSimulate.totalFuelConsumed * 100).toFixed(1)}%)</div>
                                
                                <div>Emisi CO₂e (termasuk CH₄ slip jika LNG)</div><div>{simulationResult.voyageToSimulate.co2Emissions?.toFixed(2)} Ton <span className={styles.subText}>(Historis)</span></div><div>{simulationResult.estimatedNewCO2Emissions.toFixed(2)} Ton</div><div>{(simulationResult.estimatedNewCO2Emissions - (simulationResult.voyageAER_historical !== null ? (simulationResult.voyageAER_historical * ship.DWT * simulationResult.voyageToSimulate.distanceSailed / 1000000) : simulationResult.voyageToSimulate.co2Emissions) ).toFixed(2)} Ton ({( (simulationResult.estimatedNewCO2Emissions - (simulationResult.voyageAER_historical !== null ? (simulationResult.voyageAER_historical * ship.DWT * simulationResult.voyageToSimulate.distanceSailed / 1000000) : simulationResult.voyageToSimulate.co2Emissions)) / (simulationResult.voyageAER_historical !== null ? (simulationResult.voyageAER_historical * ship.DWT * simulationResult.voyageToSimulate.distanceSailed / 1000000) : simulationResult.voyageToSimulate.co2Emissions) * 100).toFixed(1)}%)</div>
                                
                                {simulationResult.voyageAER_historical !== null && simulationResult.voyageAER_simulated !== null && ship && ship.DWT && (
                                    <>
                                        <div>Efisiensi Karbon Perjalanan (AER)</div>
                                        <div>{simulationResult.voyageAER_historical.toFixed(2)} gCO₂/ton-nm</div>
                                        <div>{simulationResult.voyageAER_simulated.toFixed(2)} gCO₂/ton-nm</div>
                                        <div>
                                            {(simulationResult.voyageAER_simulated - simulationResult.voyageAER_historical).toFixed(2)} 
                                            ({((simulationResult.voyageAER_simulated - simulationResult.voyageAER_historical) / simulationResult.voyageAER_historical * 100).toFixed(1)}%)
                                            <span className={styles.subText}> (Lebih rendah lebih baik)</span>
                                        </div>
                                    </>
                                )}

                                {simulationResult.potentialRating_historical !== 'N/A' && ship && ship.DWT && (
                                     <>
                                        <div>Potensi Rating CII Perjalanan <span title="Estimasi rating jika performa perjalanan ini adalah representasi performa tahunan. Rating CII resmi dihitung dari total data operasional tahunan." style={{cursor: 'help'}}>&#9432;</span></div>
                                        <div>
                                            <span style={getCIIStyle(simulationResult.potentialRating_historical, theme)}>{simulationResult.potentialRating_historical}</span>
                                        </div>
                                        <div>
                                            <span style={getCIIStyle(simulationResult.potentialRating_simulated, theme)}>{simulationResult.potentialRating_simulated}</span>
                                        </div>
                                        <div>
                                            {simulationResult.potentialRating_historical !== simulationResult.potentialRating_simulated ? `Perbaikan dari ${simulationResult.potentialRating_historical} ke ${simulationResult.potentialRating_simulated}` : 'Tidak ada perubahan rating'}
                                        </div>
                                     </>
                                )}
                                {simulationResult.calculatedRequiredCII !== null && ship && ship.DWT && (
                                    <>
                                        <div style={{ gridColumn: '1 / -1', marginTop: '10px', paddingTop: '10px', borderTop: `1px dashed ${theme === 'light' ? '#ccc' : '#555'}` }}>
                                            <small>
                                                <strong>Informasi Target CII Tahunan (Estimasi untuk {ship.type || 'Kapal Ini'} dengan DWT {ship.DWT}):</strong><br />
                                                Required CII Tahunan: {simulationResult.calculatedRequiredCII.toFixed(2)} gCO₂/ton-nm <br />
                                                Batas Atas Rating A: {(simulationResult.calculatedRequiredCII * CII_CONSTANTS.RATING_THRESHOLDS.A).toFixed(2)} | 
                                                B: {(simulationResult.calculatedRequiredCII * CII_CONSTANTS.RATING_THRESHOLDS.B).toFixed(2)} | 
                                                C: {(simulationResult.calculatedRequiredCII * CII_CONSTANTS.RATING_THRESHOLDS.C).toFixed(2)} | 
                                                D: {(simulationResult.calculatedRequiredCII * CII_CONSTANTS.RATING_THRESHOLDS.D).toFixed(2)}
                                            </small>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Panel>
                    )}
                </div>
            )}

            {/* Bagian untuk menampilkan daftar perjalanan */}
            <div className={styles.voyagesSection}>
                <h4>Histori Perjalanan</h4>
                {currentShipVoyages.length > 0 ? (
                    <ul className={styles.voyageList}>
                        {currentShipVoyages.map(voyage => (
                            <li key={voyage.id} className={styles.voyageListItem}>
                                <p><strong>Nama Perjalanan:</strong> {voyage.voyageName || voyage.id}</p>
                                <p><strong>Rute:</strong> {voyage.departurePort} ke {voyage.arrivalPort}</p>
                                <p><strong>ATD:</strong> {voyage.atd?.toDate ? voyage.atd.toDate().toLocaleString() : '-'}</p>
                                <p><strong>ATA:</strong> {voyage.ata?.toDate ? voyage.ata.toDate().toLocaleString() : '-'}</p>
                                <p><strong>Durasi Perjalanan:</strong> {voyage.voyageDurationHours !== undefined ? `${voyage.voyageDurationHours.toFixed(2)} jam` : '-'}</p>
                                <p><strong>Jarak:</strong> {voyage.distanceSailed || '-'} NM</p>
                                <p><strong>Konsumsi Bahan Bakar:</strong> 
                                    {voyage.fuelConsumedByFuelType && Object.keys(voyage.fuelConsumedByFuelType).length > 0 
                                        ? Object.entries(voyage.fuelConsumedByFuelType).map(([fuel, amount]) => `${fuel}: ${amount} Ton`).join(', ')
                                        : '-'
                                    }
                                </p>
                                <p><strong>Total Konsumsi Bahan Bakar:</strong> {voyage.totalFuelConsumed !== undefined ? `${voyage.totalFuelConsumed.toFixed(2)} Ton` : '-'}</p>
                                <p><strong>Emisi CO2:</strong> {voyage.co2Emissions !== undefined ? `${voyage.co2Emissions.toFixed(2)} Ton` : '-'}</p>
                                <p><strong>Efisiensi (Ton/NM):</strong> {voyage.fuelConsumptionPerNm !== undefined ? voyage.fuelConsumptionPerNm.toFixed(4) : '-'}</p>
                                <div className={styles.voyageItemActions}>
                                    <button 
                                        onClick={() => handleEditVoyage(voyage)}
                                        style={{...voyageActionButtonStyle, backgroundColor: theme === 'light' ? '#ffc107' : '#f0ad4e', color: theme === 'light' ? '#212529' : '#ffffff'}}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            if (window.confirm(`Apakah Anda yakin ingin menghapus perjalanan "${voyage.voyageName || voyage.id}"?`)) {
                                                try {
                                                    await deleteVoyage(voyage.id);
                                                    alert('Data perjalanan berhasil dihapus.');
                                                } catch (error) {
                                                    alert(`Gagal menghapus perjalanan: ${error.message}`);
                                                }
                                            }
                                        }}
                                        style={{...voyageActionButtonStyle, backgroundColor: theme === 'light' ? '#dc3545' : '#e63946', color: 'white'}}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Belum ada data perjalanan untuk kapal ini.</p>
                )}
            </div>
        </Panel>
    );
}

// Helper function untuk styling CII dan mendapatkan teks lengkap
const getCIIStyle = (rating, theme) => {
    const baseStyle = {
        padding: '2px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
    };
    switch (rating) {
        case 'A': return { ...baseStyle, backgroundColor: theme === 'light' ? '#28a745' : '#1e7e34', color: 'white' }; // Hijau tua
        case 'B': return { ...baseStyle, backgroundColor: theme === 'light' ? '#a3d698' : '#5cb85c', color: theme === 'light' ? 'black': 'white' }; // Hijau muda
        case 'C': return { ...baseStyle, backgroundColor: theme === 'light' ? '#ffc107' : '#f0ad4e', color: theme === 'light' ? 'black': 'white' }; // Kuning
        case 'D': return { ...baseStyle, backgroundColor: theme === 'light' ? '#fd7e14' : '#e67e22', color: 'white' }; // Oranye
        case 'E': return { ...baseStyle, backgroundColor: theme === 'light' ? '#dc3545' : '#d9534f', color: 'white' }; // Merah
        default: return {};
    }
};

const getCIIFullText = (rating) => {
    switch (rating) {
        case 'A': return "Major Superior";
        case 'B': return "Minor Superior";
        case 'C': return "Moderate";
        case 'D': return "Minor Inferior";
        case 'E': return "Inferior";
        default: return "";
    }
};

export default ShipDetailsPage;