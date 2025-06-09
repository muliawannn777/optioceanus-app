import React from "react";

function ShipItem({ ship }) {
    return <><strong>{ship.name}</strong> - Tipe: {ship.type}, Kecepatan: {ship.speed || 'N/A'} knot</>;
}

export default ShipItem;