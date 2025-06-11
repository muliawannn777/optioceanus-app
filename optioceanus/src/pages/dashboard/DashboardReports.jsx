// c:\Users\har\Documents\React Projects\optioceanus\src\pages\dashboard\DashboardReports.jsx
import React from 'react';
import Panel from '../../Panel'; // Sesuaikan path jika perlu
import styles from './DashboardReports.module.css'; // Buat file CSS Module ini

function DashboardReports() {
  // Data dummy atau logika untuk laporan bisa ditambahkan di sini nanti
  return (
    <div className={styles.reportsContainer}>
      <Panel title="Laporan Operasional">
        <p>Bagian ini akan menampilkan berbagai laporan operasional kapal.</p>
        {/* Contoh placeholder untuk jenis laporan */}
        <div className={styles.reportSection}>
          <h4>Laporan Konsumsi Bahan Bakar</h4>
          <p>Data konsumsi bahan bakar akan ditampilkan di sini (misalnya, dalam bentuk grafik atau tabel).</p>
        </div>
        <div className={styles.reportSection}>
          <h4>Laporan Jadwal Perawatan</h4>
          <p>Informasi mengenai jadwal perawatan kapal mendatang.</p>
        </div>
      </Panel>
      <Panel title="Laporan Kinerja">
        <p>Analisis kinerja armada atau kapal individu.</p>
      </Panel>
    </div>
  );
}

export default DashboardReports;
