import React from 'react';
import Panel from '../../Panel'; 
import useUserData from '../../hooks/useUserData'; // Impor hook untuk data
import { Bar } from 'react-chartjs-2'; // Impor Bar chart
// ChartJS sudah diregister di ShipDetailsPage, tapi jika ini halaman terpisah yang bisa diakses tanpa ke detail,
// mungkin perlu diregister lagi di sini atau di App.jsx. Untuk saat ini kita asumsikan sudah ter-register.
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../ThemeContext';

// Registrasi elemen Chart.js yang akan digunakan jika belum
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function DashboardSummary() {
  const { ships, voyages, loadingShips, loadingVoyages, errorShips, errorVoyages } = useUserData();
  const { theme } = useTheme();

  if (loadingShips || loadingVoyages) {
    return <Panel title="Memuat Ringkasan Dashboard..."><p>Silakan tunggu...</p></Panel>;
  }

  if (errorShips || errorVoyages) {
    return (
        <Panel title="Error Memuat Dashboard">
            {errorShips && <p>Gagal memuat data kapal: {errorShips}</p>}
            {errorVoyages && <p>Gagal memuat data perjalanan: {errorVoyages}</p>}
        </Panel>
    );
  }

  // Kalkulasi Statistik Agregat
  const totalShips = ships.length;
  const totalCO2EmissionsArmada = voyages.reduce((sum, voyage) => sum + (voyage.co2Emissions || 0), 0);
  const totalDistanceSailedArmada = voyages.reduce((sum, voyage) => sum + (voyage.distanceSailed || 0), 0);
  const totalFuelConsumedArmada = voyages.reduce((sum, voyage) => sum + (voyage.totalFuelConsumed || 0), 0);
  
  const averageFuelEfficiencyArmada = totalDistanceSailedArmada > 0 
    ? totalFuelConsumedArmada / totalDistanceSailedArmada 
    : 0;

  // Data untuk Grafik Emisi CO2 per Tipe Kapal
  const co2ByShipType = ships.reduce((acc, ship) => {
    const shipVoyages = voyages.filter(v => v.shipId === ship.id);
    const totalCO2ForShip = shipVoyages.reduce((sum, v) => sum + (v.co2Emissions || 0), 0);
    acc[ship.type] = (acc[ship.type] || 0) + totalCO2ForShip;
    return acc;
  }, {});

  const co2ByShipTypeChartData = {
    labels: Object.keys(co2ByShipType),
    datasets: [{
      label: 'Total Emisi CO2 (Ton)',
      data: Object.values(co2ByShipType),
      backgroundColor: theme === 'light' ? 'rgba(255, 99, 132, 0.5)' : 'rgba(255, 99, 132, 0.3)',
      borderColor: theme === 'light' ? 'rgb(255, 99, 132)' : 'rgba(255, 99, 132, 0.8)',
      borderWidth: 1
    }]
  };

  // Data untuk Grafik Konsumsi Bahan Bakar per Jenis (Global Armada)
  const fuelConsumptionByFuelTypeGlobal = voyages.reduce((acc, voyage) => {
    if (voyage.fuelConsumedByFuelType) {
      for (const fuelType in voyage.fuelConsumedByFuelType) {
        acc[fuelType] = (acc[fuelType] || 0) + voyage.fuelConsumedByFuelType[fuelType];
      }
    }
    return acc;
  }, {});

  const fuelConsumptionChartData = {
    labels: Object.keys(fuelConsumptionByFuelTypeGlobal),
    datasets: [{
      label: 'Total Konsumsi Bahan Bakar (Ton)',
      data: Object.values(fuelConsumptionByFuelTypeGlobal),
      backgroundColor: theme === 'light' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(75, 192, 192, 0.3)',
      borderColor: theme === 'light' ? 'rgb(75, 192, 192)' : 'rgba(75, 192, 192, 0.8)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Jumlah (Ton)' } } },
    plugins: { legend: { position: 'top' } }
  };

  return (
    <div>
      <Panel title="Statistik Cepat">
        <p>Total Kapal Terdaftar: <strong>{totalShips}</strong></p>
        <p>Total Emisi CO2 Armada: <strong>{totalCO2EmissionsArmada.toFixed(2)} Ton</strong></p>
        <p>Total Jarak Tempuh Armada: <strong>{totalDistanceSailedArmada.toFixed(2)} NM</strong></p>
        <p>Rata-rata Efisiensi Armada: <strong>{averageFuelEfficiencyArmada.toFixed(4)} Ton/NM</strong></p>
      </Panel>

      {Object.keys(co2ByShipType).length > 0 && (
        <Panel title="Total Emisi CO2 per Tipe Kapal">
          <Bar data={co2ByShipTypeChartData} options={{...chartOptions, scales: { y: { beginAtZero: true, title: { display: true, text: 'Emisi CO2 (Ton)' } } }}} />
        </Panel>
      )}

      {Object.keys(fuelConsumptionByFuelTypeGlobal).length > 0 && (
        <Panel title="Total Konsumsi Bahan Bakar per Jenis (Armada)">
          <Bar data={fuelConsumptionChartData} options={{...chartOptions, scales: { y: { beginAtZero: true, title: { display: true, text: 'Konsumsi Bahan Bakar (Ton)' } } }}} />
        </Panel>
      )}

      {voyages.length === 0 && ships.length > 0 && (
        <Panel title="Informasi"><p>Belum ada data perjalanan yang tercatat untuk dianalisis.</p></Panel>
      )}
    </div>
  );
}

export default DashboardSummary;
