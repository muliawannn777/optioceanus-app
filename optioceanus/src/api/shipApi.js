// Mock API untuk statistik kapal

export async function getShipStats() {
  // Simulasi fetch data dari backend
  // Ganti dengan fetch/axios jika sudah ada backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalShips: 12,      // Ganti dengan data asli jika ada
        avgCII: 3.7,         // Ganti dengan data asli jika ada
      });
    }, 500);
  });
}