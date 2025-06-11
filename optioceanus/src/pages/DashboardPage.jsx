import React from "react";
import { NavLink, Outlet } from "react-router-dom"; // NavLink sudah diimpor
import { useTheme } from "../ThemeContext";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const { theme } = useTheme();

  // Style dinamis yang masih memerlukan theme untuk border
  const dashboardContainerStyleWithTheme = {
    border: `1px solid ${theme === "light" ? "#dee2e6" : "#495057"}`, // Warna border yang lebih netral
    // backgroundColor bisa diatur di sini atau diwarisi dari App.jsx jika .appContainer sudah cukup
  };

  const navStyleWithTheme = {
    borderBottom: `1px solid ${theme === "light" ? "#e0e0e0" : "#444"}`, // Konsisten dengan App.jsx
  };

  const getNavLinkStyle = ({ isActive }) => ({
    color:
      theme === "light"
        ? isActive
          ? "#0056b3"
          : "#212529"
        : isActive
        ? "#90caf9"
        : "#e0e0e0",
    backgroundColor: isActive
      ? theme === "light"
        ? "rgba(0, 123, 255, 0.1)"
        : "rgba(102, 170, 255, 0.15)"
      : "transparent",
  });

  return (
    <div className={styles.dashboardContainer} style={dashboardContainerStyleWithTheme}>
      <h2 className={styles.dashboardTitle}>Dashboard Aplikasi OptiOceanus</h2>
      <nav className={styles.dashboardNav} style={navStyleWithTheme}>
        <ul className={styles.dashboardNavList}>
          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                isActive
                  ? `${styles.dashboardNavLink} ${styles.activeDashboardNavLink}`
                  : styles.dashboardNavLink
              }
              style={getNavLinkStyle}
            >
              Ringkasan
            </NavLink>
          </li>
          {/* <li> 
            <NavLink
              to="cii-calculator"
              className={({ isActive }) =>
                isActive
                  ? `${styles.dashboardNavLink} ${styles.activeDashboardNavLink}`
                  : styles.dashboardNavLink
              }
              style={getNavLinkStyle}
            >
              Kalkulator CII
            </NavLink>
          </li> */} {/* Link Navigasi Kalkulator CII dinonaktifkan */}
          <li>
            <NavLink
              to="reports"
              className={({ isActive }) =>
                isActive
                  ? `${styles.dashboardNavLink} ${styles.activeDashboardNavLink}`
                  : styles.dashboardNavLink
              }
              style={getNavLinkStyle}
            >
              Laporan
            </NavLink>
          </li>
          <li>
            <NavLink
              to="shiplist"
              className={({ isActive }) =>
                isActive
                  ? `${styles.dashboardNavLink} ${styles.activeDashboardNavLink}`
                  : styles.dashboardNavLink
              }
              style={getNavLinkStyle}
            >
              Daftar Kapal
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.dashboardContent}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardPage;
