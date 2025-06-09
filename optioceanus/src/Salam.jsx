import React from "react";

// Menggunakan destructuring untuk langsung mendapatkan 'nama' dan 'asal' dari props
// Memberikan nilai default langsung di parameter jika properti tidak ada
function Salam({ nama = "Pengunjung", asal = "Bumi" }) {
    return <h2>Halo, {nama} dari {asal}! Ini dari Komponen Salam.</h2>;
}

export default Salam;