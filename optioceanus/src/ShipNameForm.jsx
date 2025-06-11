import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import styles from './ShipNameForm.module.css';
import { useNavigate } from 'react-router-dom';
import useShips from './hooks/useShips'; // Impor hook useShips

function ShipNameForm() {
  const [shipName, setShipName] = useState('');
   const [feedback, setFeedback] = useState({ type: '', message: '' }); // type: 'error', 'success', ''
  const { ships } = useShips(); // Dapatkan data kapal dari hook
  const navigate = useNavigate();

   const handleInputChange = (e) => {
    setShipName(e.target.value);
    if (feedback.message) {
      setFeedback({ type: '', message: '' }); // Hapus feedback saat pengguna mengetik
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
     setFeedback({ type: '', message: '' });
    const searchTerm = shipName.trim();
    if (searchTerm === '') {
      setFeedback({ type: 'error', message: 'Nama kapal tidak boleh kosong!' });
      return;
    }

    // Cari kapal berdasarkan nama (case-insensitive)
    const foundShip = ships.find(ship => ship.name.toLowerCase() === searchTerm.toLowerCase());

    if (foundShip) {
      navigate(`/ship/${foundShip.id}`); // Arahkan ke halaman detail kapal
   setShipName(''); 
    } else {
     setFeedback({ type: 'error', message: `Kapal dengan nama "${shipName}" tidak ditemukan.` });
 
    }
  };

   const { theme } = useTheme();

  const formStyle = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#444444',
    border: `1px solid ${theme === 'light' ? '#dddddd' : '#555555'}`,
  };

  const inputStyle = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#555555',
    color: theme === 'light' ? '#333333' : '#ffffff',
    borderColor: theme === 'light' ? '#cccccc' : '#666666',
  };

  const buttonStyle = {
    backgroundColor: theme === 'light' ? '#007bff' : '#66aaff',
    color: theme === 'light' ? '#ffffff' : '#212529',
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} style={formStyle}>
      <div className={styles.formGroup}>
        <label htmlFor="shipName" className={styles.formLabel}>Nama Kapal:</label>
        <input
          type="text"
          id="shipName"
          value={shipName}
          onChange={handleInputChange}
          placeholder="Masukkan nama kapal"
          className={styles.formInput}
          style={inputStyle}
        />
      </div>
       {feedback.message && (
        <p className={feedback.type === 'error' ? styles.errorMessage : styles.successMessage}>
          {feedback.message}
        </p>
      )}
      <button type="submit" className={styles.formButton} style={buttonStyle}>Cari Kapal</button>
    </form>
  );
}

export default ShipNameForm;
