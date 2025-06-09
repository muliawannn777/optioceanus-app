import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
    borderBottom: `1px solid ${theme === 'light' ? '#ccc' : '#555'}`,
    paddingBottom: '10px',
  };

  return (
  <BrowserRouter>
  <div className='app-container' style={appStyles}>
    <nav style={navStyles}>
      <ul style={{ listStyleType: 'none', padding: '0', margin: 0, display: 'flex', gap: '15px' }}>
        <li><Link to="/">Beranda</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/settings">Pengaturan</Link></li>
        <li style={{ marginLeft: 'auto' }}><ToggleThemeButton /></li>
      </ul>
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