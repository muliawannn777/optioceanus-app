import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import useUserData from '../hooks/useUserData'; // Untuk mendapatkan daftar kapal
import Panel from '../Panel';
import styles from './CIICalculatorPage.module.css'; // Buat file CSS ini nanti

// Konstanta dan fungsi helper CII bisa diimpor dari ShipDetailsPage atau didefinisikan ulang/di-refactor ke file utilitas
const CII_CONSTANTS = {
    BASELINE_A_TANKER: 4740,    // Parameter 'a' untuk baseline CII tanker
    BASELINE_C_TANKER: -0.622,  // Parameter 'c' untuk baseline CII tanker
    // Tambahkan baseline untuk tipe kapal lain jika diperlukan
    Z_FACTORS: { // Faktor reduksi Z% per tahun
        2023: 0.05,
        2024: 0.07, // Contoh untuk tahun berikutnya
        2025: 0.09,
        2026: 0.11,
    },
    RATING_THRESHOLDS: {
        A: 0.90, 
        B: 0.95, 
        C: 1.00, 
        D: 1.05, 
    }
};

const getCIIRatingFromAttained = (attainedCII, requiredCII) => {
    if (attainedCII === null || requiredCII === null || requiredCII <= 0) return 'N/A';
    if (attainedCII <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.A) return 'A';
    if (attainedCII <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.B) return 'B';
    if (attainedCII <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.C) return 'C';
    if (attainedCII <= requiredCII * CII_CONSTANTS.RATING_THRESHOLDS.D) return 'D';
    return 'E';
};

// Fungsi styling bisa diimpor atau didefinisikan ulang
const getCIIStyle = (rating, theme) => {
    const baseStyle = { padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block', color: 'white' };
    switch (rating) {
        case 'A': return { ...baseStyle, backgroundColor: theme === 'light' ? '#28a745' : '#1e7e34' };
        case 'B': return { ...baseStyle, backgroundColor: theme === 'light' ? '#5cb85c' : '#4a934a' };
        case 'C': return { ...baseStyle, backgroundColor: theme === 'light' ? '#ffc107' : '#f0ad4e', color: theme === 'light' ? 'black' : 'white' };
        case 'D': return { ...baseStyle, backgroundColor: theme === 'light' ? '#fd7e14' : '#e67e22' };
        case 'E': return { ...baseStyle, backgroundColor: theme === 'light' ? '#dc3545' : '#d9534f' };
        default: return { display: 'inline-block' };
    }
};

function CIICalculatorPage() {
    const { theme } = useTheme();
    const { ships, loadingShips } = useUserData();

    const [selectedShipId, setSelectedShipId] = useState('');
    const [totalCO2Annual, setTotalCO2Annual] = useState(''); // Ton
    const [totalDistanceAnnual, setTotalDistanceAnnual] = useState(''); // NM
    const [referenceYear, setReferenceYear] = useState(new Date().getFullYear() -1); // Default ke tahun lalu

    const [calculationResult, setCalculationResult] = useState(null);

    const selectedShip = ships.find(s => s.id === selectedShipId);

    const handleCalculateCII = (e) => {
        e.preventDefault();
        if (!selectedShip || !totalCO2Annual || !totalDistanceAnnual || !referenceYear) {
            alert("Harap lengkapi semua input: pilih kapal, total CO2, total jarak, dan tahun referensi.");
            setCalculationResult(null);
            return;
        }

        const DWT = selectedShip.DWT;
        if (!DWT || DWT <= 0) {
            alert("Data DWT kapal tidak valid atau tidak ditemukan.");
            setCalculationResult(null);
            return;
        }

        const co2 = parseFloat(totalCO2Annual);
        const distance = parseFloat(totalDistanceAnnual);
        const zFactor = CII_CONSTANTS.Z_FACTORS[referenceYear] || 0.05; // Default Z jika tahun tidak ada

        const transportWork = DWT * distance;
        if (transportWork <= 0) {
            alert("Transport work tidak valid (DWT atau Jarak tidak boleh nol).");
            setCalculationResult(null);
            return;
        }

        const attainedCII_gTonNm = (co2 * 1000000) / transportWork; // g CO2 / ton-nm

        // Asumsi kapal adalah Tanker untuk baseline, perlu penyesuaian jika ada tipe lain
        const baselineCII = CII_CONSTANTS.BASELINE_A_TANKER * Math.pow(DWT, CII_CONSTANTS.BASELINE_C_TANKER);
        const requiredCII_annual = baselineCII * (1 - zFactor);
        const ciiRating = getCIIRatingFromAttained(attainedCII_gTonNm, requiredCII_annual);

        setCalculationResult({
            shipName: selectedShip.name,
            DWT,
            totalCO2Annual: co2,
            totalDistanceAnnual: distance,
            referenceYear,
            transportWork,
            attainedCII_gTonNm,
            requiredCII_annual,
            ciiRating,
            zFactor
        });
    };

    const inputStyle = {
        backgroundColor: theme === 'light' ? '#ffffff' : '#495057',
        color: theme === 'light' ? '#495057' : '#f8f9fa',
        borderColor: theme === 'light' ? '#ced4da' : '#6c757d',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid',
        marginBottom: '10px',
        width: '100%',
        boxSizing: 'border-box'
    };

    return (
        <Panel title="Kalkulator CII Tahunan Kapal">
            <form onSubmit={handleCalculateCII} className={styles.ciiForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="selectedShip">Pilih Kapal:</label>
                    <select id="selectedShip" value={selectedShipId} onChange={(e) => setSelectedShipId(e.target.value)} style={inputStyle} required>
                        <option value="">-- Pilih Kapal --</option>
                        {loadingShips ? <option disabled>Memuat kapal...</option> : ships.map(ship => (
                            <option key={ship.id} value={ship.id}>{ship.name} (DWT: {ship.DWT || 'N/A'})</option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="totalCO2Annual">Total Emisi CO₂ Tahunan (Ton):</label>
                    <input type="number" id="totalCO2Annual" value={totalCO2Annual} onChange={(e) => setTotalCO2Annual(e.target.value)} style={inputStyle} placeholder="Contoh: 50000" required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="totalDistanceAnnual">Total Jarak Tempuh Tahunan (NM):</label>
                    <input type="number" id="totalDistanceAnnual" value={totalDistanceAnnual} onChange={(e) => setTotalDistanceAnnual(e.target.value)} style={inputStyle} placeholder="Contoh: 100000" required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="referenceYear">Tahun Referensi CII:</label>
                    <input type="number" id="referenceYear" value={referenceYear} onChange={(e) => setReferenceYear(parseInt(e.target.value))} style={inputStyle} placeholder="Contoh: 2023" required />
                </div>
                <button type="submit" className={styles.calculateButton} style={{...inputStyle, cursor: 'pointer', backgroundColor: theme === 'light' ? '#007bff' : '#66aaff', color: theme === 'light' ? 'white' : 'black' }}>Hitung CII</button>
            </form>

            {calculationResult && (
                <div className={styles.resultSection}>
                    <h4>Hasil Perhitungan CII untuk {calculationResult.shipName} ({calculationResult.referenceYear})</h4>
                    <p>DWT: {calculationResult.DWT.toLocaleString()} ton</p>
                    <p>Total CO₂ Tahunan: {calculationResult.totalCO2Annual.toLocaleString()} Ton</p>
                    <p>Total Jarak Tahunan: {calculationResult.totalDistanceAnnual.toLocaleString()} NM</p>
                    <p>Transport Work: {calculationResult.transportWork.toLocaleString()} ton-nm</p>
                    <p>Faktor Reduksi (Z): {(calculationResult.zFactor * 100).toFixed(0)}%</p>
                    <p><strong>Attained CII: {calculationResult.attainedCII_gTonNm.toFixed(2)} gCO₂/ton-nm</strong></p>
                    <p><strong>Required CII: {calculationResult.requiredCII_annual.toFixed(2)} gCO₂/ton-nm</strong></p>
                    <p><strong>Rating CII Kapal: <span style={getCIIStyle(calculationResult.ciiRating, theme)}>{calculationResult.ciiRating}</span></strong></p>
                </div>
            )}
        </Panel>
    );
}

export default CIICalculatorPage;