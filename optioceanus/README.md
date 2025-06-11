# OptiOceanus - Aplikasi Manajemen Data Kapal Sederhana

OptiOceanus adalah aplikasi web portofolio yang dibangun untuk mendemonstrasikan kemampuan dalam pengembangan frontend menggunakan React. Aplikasi ini memungkinkan pengguna untuk mengelola daftar data kapal secara sederhana, termasuk operasi Tambah, Lihat, Edit, dan Hapus (CRUD) data kapal. Data disimpan secara lokal di browser menggunakan `localStorage`.

## Fitur Utama

*   **Manajemen Data Kapal (CRUD):**
    *   Menambah data kapal baru (ID, Nama, Tipe, Kecepatan, Tahun Pembuatan).
    *   Melihat daftar semua kapal.
    *   Melihat detail informasi per kapal.
    *   Mengedit data kapal yang sudah ada.
    *   Menghapus data kapal.
*   **Penyimpanan Lokal:** Data kapal disimpan di `localStorage` browser, sehingga data tetap ada meskipun browser ditutup.
*   **Tema Terang & Gelap:** Pengguna dapat mengganti tema tampilan aplikasi.
*   **Navigasi Intuitif:** Menggunakan React Router untuk navigasi antar halaman.
*   **Desain Responsif:** Tampilan aplikasi menyesuaikan dengan berbagai ukuran layar (desktop, tablet, mobile).
*   **Komponen UI Modular:** Dibangun dengan komponen React yang dapat digunakan kembali.

*(Anda bisa menambahkan screenshot aplikasi di sini setelah di-deploy. Misalnya, tampilan daftar kapal, form tambah kapal, atau halaman detail)*

Contoh:
`!Tampilan Daftar Kapal`
`!Tampilan Form Tambah Kapal`

## Teknologi yang Digunakan

*   **React:** Library JavaScript untuk membangun antarmuka pengguna.
*   **Vite:** Build tool frontend modern yang cepat.
*   **React Router:** Untuk routing sisi klien.
*   **CSS Modules:** Untuk styling komponen yang terisolasi.
*   **JavaScript (ES6+):** Bahasa pemrograman utama.
*   **HTML5 & CSS3:** Struktur dan styling dasar.
*   **`localStorage`:** Untuk penyimpanan data di sisi klien.

## Cara Menjalankan Proyek Secara Lokal

1.  **Clone repositori ini:**
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd optioceanus
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:5173` (atau port lain yang ditampilkan di terminal).

## Link Aplikasi

*   **Aplikasi Live:** `[MASUKKAN_URL_NETLIFY_ANDA_DI_SINI_SETELAH_DEPLOY]`
*   **Repositori GitHub:** `[MASUKKAN_URL_REPOSITORI_GITHUB_ANDA_DI_SINI]`

## Visi & Rencana Pengembangan Selanjutnya

Aplikasi OptiOceanus ini dirancang sebagai fondasi yang dapat dikembangkan lebih lanjut. Beberapa potensi pengembangan di masa depan meliputi:

*   **Integrasi Backend:** Menggunakan backend seperti Firebase atau Supabase untuk:
    *   Penyimpanan data kapal yang persisten dan dapat diakses dari mana saja.
    *   Autentikasi pengguna (Login/Sign Up).
*   **Fitur Pencarian & Filter:** Memudahkan pengguna mencari kapal berdasarkan nama atau memfilter berdasarkan tipe.
*   **Dukungan "Net Zero Emission":**
    *   Modul untuk mencatat dan menganalisis konsumsi bahan bakar.
    *   Konsep optimasi rute dasar untuk efisiensi bahan bakar.
    *   Pelacakan data emisi kapal (jika data tersedia).
*   **Peningkatan UI/UX:** Notifikasi yang lebih canggih (toast), animasi, dan pengalaman pengguna yang lebih kaya.
*   **Pengujian Unit & Integrasi:** Menambahkan tes untuk memastikan kualitas dan keandalan kode.

---

Proyek ini dibuat sebagai bagian dari portofolio untuk menunjukkan pemahaman dalam pengembangan aplikasi web modern dengan React.