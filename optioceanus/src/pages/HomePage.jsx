import React from "react";
import { Link } from "react-router-dom";
import Salam from "../Salam";
import ShipNameForm from "../ShipNameForm";
import { useAuth } from "../AuthContext";
import Panel from "../Panel";
import { useTheme } from "../ThemeContext"; // Impor useTheme
import styles from "./HomePage.module.css";

function HomePage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme(); // Dapatkan tema saat ini

  const greetingName = currentUser
    ? currentUser.displayName || currentUser.email
    : "Pioneer Keberlanjutan PIS"; // Lebih aspiratif dan terkait visi

  // Gaya untuk wrapper utama, termasuk border yang bergantung pada tema
  // Menggunakan gaya border yang mirip dengan DashboardPage untuk konsistensi
  const homePageWrapperStyleWithTheme = {
    border: `1px solid ${theme === "light" ? "#dee2e6" : "#495057"}`,
    // Anda bisa menambahkan backgroundColor di sini jika ingin seperti SettingsPage,
    // contoh: backgroundColor: theme === 'light' ? '#f9f9f9' : '#333', // Sesuaikan warna
  };

  return (
    <div className={styles.homePageWrapper} style={homePageWrapperStyleWithTheme}>
      <Salam nama={greetingName} asal="Pertamina International Shipping - Menuju Net Zero Emission 2060" />
      {/* Konten yang sebelumnya di dalam homeContainer sekarang langsung di bawah homePageWrapper */}
      <h1 className={styles.mainPageTitle}>
        {/* Judul utama halaman */}
        OptiOceanus: Akselerasi Dekarbonisasi Armada PIS
      </h1>
      <p className={styles.tagline}>
        Solusi digital inovatif untuk mendukung target Net Zero Emission 2060 Pertamina International Shipping melalui optimalisasi operasional dan manajemen emisi.
      </p>

      <div className={styles.homeInteractiveSection}>
        <Panel title="Analisis Jejak Karbon Armada (Demo)" className={styles.searchPanel}>
          {/* ShipNameForm di sini bisa didemokan sebagai cara memilih kapal untuk analisis emisi/efisiensi */}
          <ShipNameForm />
        </Panel>

        <Panel
          title="Strategi & Solusi NZE 2060"
          className={styles.quickActionsPanel}
        >
          <div className={styles.quickActionsContainer}>
            <Link
              // Arahkan ke halaman yang menjelaskan solusi optimasi rute & efisiensi
              to="/solutions/route-optimization" 
              className={`${styles.quickActionButton} ${styles.secondaryButton}`}
            >
              Optimasi Rute & Efisiensi Energi
            </Link>
            <Link
              // Arahkan ke halaman yang menjelaskan manajemen CII & kepatuhan
              to="/solutions/cii-management" 
              className={`${styles.quickActionButton} ${styles.secondaryButton}`}
            >
              Manajemen CII & Kepatuhan Regulasi
            </Link>
          </div>
          {/* Memindahkan navigasi utama ke dalam panel aksi cepat */}
          <nav className={styles.homeNav}>
            <ul className={styles.homeNavList}>
              <li>
                <Link
                  // Arahkan ke dashboard yang menampilkan metrik terkait NZE
                  to="/dashboard/nze-overview" 
                  className={`${styles.homeButtonLink} ${styles.primaryButton}`}
                >
                  Dashboard Keberlanjutan (NZE)
                </Link>
              </li>
            </ul>
          </nav>
        </Panel>
      </div> {/* This closing div matches homeInteractiveSection */}
    </div> // Corrected to match homePageWrapper, removed unnecessary Fragment
  );
}

export default HomePage;
