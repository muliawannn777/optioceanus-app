import React from "react";
function Salam({ nama = "Pengunjung", asal = "Bumi" }) {
    return <h2>Halo, {nama} dari {asal}! Ini dari Komponen Salam.</h2>;
}

export default Salam;