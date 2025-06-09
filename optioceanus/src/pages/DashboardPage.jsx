import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const { theme } = useTheme();

  const dashboardStyles = {
    border: `1px solid ${theme === "light" ? "#007bff" : "#66aaff"}`,
    backgroundColor: theme === "light" ? "#f8f9fa" : "#444444",
  };

  const navDashboardStyles = {
    borderBottom: `1px solid ${theme === "light" ? "#ddd" : "#555"}`,
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
    <div className={styles.dashboardContainer} style={dashboardStyles}>
      <h2 className={styles.dashboardTitle}>Dashboard Aplikasi OptiOceanus</h2>
      <nav className={styles.dashboardNav} style={navDashboardStyles}>
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
