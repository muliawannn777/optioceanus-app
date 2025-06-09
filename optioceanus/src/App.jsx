import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ShipDetailsPage from './pages/ShipDetailsPage';
import ShipList from './ShipList'; 
import DashboardSummary from './pages/dashboard/DashboardSummary'; 
import DashboardReports from './pages/dashboard/DashboardReports'; 
import NotFoundPage from './pages/NotFoundPage';
import { useTheme } from './ThemeContext'; 
import ToggleThemeButton from './ToggleThemeButton'; 
import styles from './App.module.css'; // Impor CSS Module

function App() {
  const { theme } = useTheme(); 

  const appStyles = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#333333',
    color: theme === 'light' ? '#333333' : '#ffffff',
    minHeight: '100vh', 
    padding: '20px',
    transition: 'background-color 0.3s ease, color 0.3s ease', 
  };

  const navStyles = {
    marginBottom: '20px',
    borderBottom: `1px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
    paddingBottom: '10px',
  };

  const getNavLinkStyle = ({ isActive }) => ({
    color: theme === 'light' ? (isActive ? '#0056b3' : '#333') : (isActive ? '#90caf9' : '#f0f0f0'),
    backgroundColor: isActive ? (theme === 'light' ? 'rgba(0, 123, 255, 0.1)' : 'rgba(102, 170, 255, 0.15)') : 'transparent',
  });

  return (
  <BrowserRouter>
  <div className={styles.appContainer} style={appStyles}>
    <nav className={styles.navbar} style={navStyles}> {/* Menggunakan navStyles untuk nav */}
      <ul className={styles.navList}> {/* Menghapus style={navStyles} dari ul */}
        <li className={styles.navItem}>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink} style={getNavLinkStyle}> {/* Koreksi: styles.navLink */}
            Beranda
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink} style={getNavLinkStyle}> {/* Pastikan ini sudah benar */}
            Dashboard
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/settings" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink} style={getNavLinkStyle}> {/* Pastikan ini sudah benar */}
            Pengaturan
          </NavLink>
        </li>
      </ul>
      <div className={styles.themeButtonContainer}>
        <ToggleThemeButton />
      </div>
    </nav>

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />}>
        <Route index element={<DashboardSummary />} />
        <Route path="reports" element={<DashboardReports />} />
        <Route path="shiplist" element={<ShipList />} />
      </Route>
      <Route path='/settings' element={<SettingsPage />} />
      <Route path="/ship/:shipId" element={<ShipDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </div>
  </BrowserRouter>
)
}

export default App;