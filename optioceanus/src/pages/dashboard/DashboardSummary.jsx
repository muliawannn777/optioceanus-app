import React from 'react';
import DataFetcher from '../../DataFetcher'; 
import Counter from '../../Counter';   

function DashboardSummary() {
  return (
    <div>
      <h3>Ringkasan Dashboard</h3>
      <p>Ini adalah area ringkasan. Data terbaru dan statistik penting akan muncul di sini.</p>
      <DataFetcher />
      <Counter />
    </div>
  );
}

export default DashboardSummary;