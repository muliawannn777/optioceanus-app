import React from "react";
import { Link } from "react-router-dom";
import Salam from "../Salam";
import ShipNameForm from "../ShipNameForm";
import { useAuth } from "../AuthContext";
import Panel from "../Panel";
import styles from "./HomePage.module.css";

function HomePage() {
  const { currentUser } = useAuth();
  const greetingName = currentUser
    ? currentUser.displayName || currentUser.email
    : "Pengguna OptiOceanus";

  return (
    <div className={styles.homeContainer}>
      <Salam nama={greetingName} asal="Pelabuhan Utama" />
      <Panel className={styles.homePageMainPanel}>
        {/* Panel utama untuk konten */}
        <h1 className={styles.mainPageTitle}>
          {/* Judul utama halaman */}
          Selamat Datang di OptiOceanus
        </h1>
        <p className={styles.tagline}>
          Platform terintegrasi untuk manajemen dan optimalisasi operasional
          kapal laut.
        </p>

        <div className={styles.homeInteractiveSection}>
          <Panel title="Pencarian Cepat Kapal" className={styles.searchPanel}>
            <ShipNameForm />
          </Panel>

          <Panel
            title="Aksi Cepat & Navigasi Utama"
            className={styles.quickActionsPanel}
          >
            <div className={styles.quickActionsContainer}>
              <Link
                to="/dashboard/shiplist"
                className={`${styles.quickActionButton} ${styles.secondaryButton}`}
              >
                Tambah Kapal Baru
              </Link>
              <Link
                to="/dashboard/cii-calculator"
                className={`${styles.quickActionButton} ${styles.secondaryButton}`}
              >
                Kalkulator CII
              </Link>
            </div>
            {/* Memindahkan navigasi utama ke dalam panel aksi cepat */}
            <nav className={styles.homeNav}>
              <ul className={styles.homeNavList}>
                <li>
                  <Link
                    to="/dashboard"
                    className={`${styles.homeButtonLink} ${styles.primaryButton}`}
                  >
                    Pergi ke Dashboard Utama
                  </Link>
                </li>
              </ul>
            </nav>
          </Panel>
        </div>
      </Panel>
    </div>
  );
}

export default HomePage;
