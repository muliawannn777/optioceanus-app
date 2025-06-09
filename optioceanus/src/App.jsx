import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import SummaryPage from './pages/dashboard/SummaryPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import ShipList from './ShipList';

function App() {
  return (
  <BrowserRouter>
  <div className='app-container' style={{ padding: '20px' }}>
    <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      <ul style={{ listStyleType: 'none', padding: '0', margin: 0, display: 'flex', gap: '15px' }}>
        <li><Link to="/">Beranda</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/settings">Pengaturan</Link></li>
      </ul>
    </nav>

    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/dashboard' element={<DashboardPage/>}>
      <Route index element={<SummaryPage />} />
      <Route path='reports' element={<ReportsPage />}/>
      <Route path='shiplist' element={<ShipList />}/>
      </Route>
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/ship/:shipId' element={<ShipDetailPage />} />
      <Route path='*' element={<div><h2>404 - Halaman Tidak Ditemukan</h2><Link to="/">Kembali ke Beranda</Link></div>} />
    </Routes>
  </div>
  </BrowserRouter>
)
}

export default App;