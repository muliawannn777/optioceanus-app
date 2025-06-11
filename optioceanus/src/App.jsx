import React, { useEffect } from "react"; 
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import ShipDetailsPage from "./pages/ShipDetailsPage";
import SignUpPage from "./pages/SignUpPage"; 
import LoginPage from "./pages/LoginPage"; 
import ShipList from "./ShipList";
import DashboardSummary from "./pages/dashboard/DashboardSummary";
import DashboardReports from "./pages/dashboard/DashboardReports";
import NotFoundPage from "./pages/NotFoundPage";
import CIICalculatorPage from "./pages/CIICalculatorPage"; // Impor halaman baru
import { useAuth } from "./AuthContext"; 
import ProtectedRoute from "./ProtectedRoute"; 
import { useTheme } from "./ThemeContext";
import ToggleThemeButton from "./ToggleThemeButton";
import Panel from "./Panel"; 
import styles from "./App.module.css"; 

function App() {
  const { theme } = useTheme();
  const { currentUser, logout } = useAuth(); 


  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#ffffff" : "#1e1e1e"; 
    document.body.style.color = theme === "light" ? "#333333" : "#f0f0f0"; 
  }, [theme]); 

  const appStyles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#333333", 
    color: theme === "light" ? "#333333" : "#ffffff", 
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const navStyles = {
    marginBottom: "20px",
    borderBottom: `1px solid ${theme === "light" ? "#e0e0e0" : "#444"}`,
    paddingBottom: "10px",
  };

  const getNavLinkStyle = ({ isActive }) => ({
    color:
      theme === "light"
        ? isActive
          ? "#0056b3"
          : "#333"
        : isActive
        ? "#90caf9"
        : "#f0f0f0",
    backgroundColor: isActive
      ? theme === "light"
        ? "rgba(0, 123, 255, 0.1)"
        : "rgba(102, 170, 255, 0.15)"
      : "transparent",
  });

  return (
    <BrowserRouter>
      <div className={styles.appContainer} style={appStyles}>
        <nav
          className={styles.navbar}
          style={{
            borderBottom: `1px solid ${theme === "light" ? "#e0e0e0" : "#444"}`,
          }}
        >
          <ul className={styles.navList}>
            {" "}
            <li className={styles.navItem}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.activeNavLink}`
                    : styles.navLink
                }
                style={getNavLinkStyle}
              >
                Beranda
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.activeNavLink}`
                    : styles.navLink
                }
                style={getNavLinkStyle}
              >
                Dashboard
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.activeNavLink}`
                    : styles.navLink
                }
                style={getNavLinkStyle}
              >
                Pengaturan
              </NavLink>
            </li>
            {currentUser ? (
              <li className={styles.navItem}>
                <button
                  onClick={() => {
                    if (window.confirm("Apakah Anda yakin ingin logout?")) {
                      logout();
                    }
                  }}
                  className={styles.logoutButton}
                  style={{ color: getNavLinkStyle({ isActive: false }).color }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className={styles.navItem}>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.navLink} ${styles.activeNavLink}`
                        : styles.navLink
                    }
                    style={getNavLinkStyle}
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className={styles.themeButtonContainer}>
            <ToggleThemeButton />
          </div>
        </nav>

        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} /> {/* HomePage sekarang dilindungi */}
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<DashboardSummary />} />
              <Route path="reports" element={<DashboardReports />} />
              <Route
                path="shiplist"
                element={
                  <Panel title="Daftar Kapal">
                    <ShipList />
                  </Panel>
                }
              />
              {/* <Route path="cii-calculator" element={<CIICalculatorPage />} /> */} {/* Rute Kalkulator CII dinonaktifkan */}
            </Route>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/ship/:shipId" element={<ShipDetailsPage />} />
          </Route>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
