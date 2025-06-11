import React from "react";
import RouteConfigForm from "../RouteConfigForm";
import ThemedComponent from "../ThemedComponent";
import ShipNameForm from "../ShipNameForm";
import { useTheme } from "../ThemeContext"; 
import styles from "./SettingsPage.module.css";

function SettingsPage() {
    const { theme } = useTheme();

    const containerStyle = {
        border: `1px solid ${theme === 'light' ? '#e0e0e0' : '#555555'}`,
        backgroundColor: theme === 'light' ? '#f9f9f9' : '#3c3c3c',
    };

    const sectionStyle = {
        border: `1px solid ${theme === 'light' ? '#eeeeee' : '#4a4a4a'}`,
        backgroundColor: theme === 'light' ? '#ffffff' : '#444444',
    };

    return (
        <div className={styles.settingsContainer} style={containerStyle}>
            <h2 className={styles.pageTitle}>Pengaturan Aplikasi</h2>
            <p className={styles.pageDescription}>Konfigurasikan preferensi aplikasi Anda di sini.</p>
            
            <div className={styles.settingsSection} style={sectionStyle}><ThemedComponent /></div>
            <div className={styles.settingsSection} style={sectionStyle}><RouteConfigForm /></div>
            <div className={styles.settingsSection} style={sectionStyle}><ShipNameForm /></div>
        </div>
    )
}

export default SettingsPage;