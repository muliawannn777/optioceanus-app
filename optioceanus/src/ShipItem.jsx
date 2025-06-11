import React from "react";
import styles from './ShipItem.module.css';

function ShipItem({ ship }) {
    if (!ship) {
        return null;
    }

    return (
        <div className={styles.shipItemContainer}>
      <h4 className={styles.shipName}>{ship.name}</h4>
      <p className={styles.shipType}>Tipe: {ship.type}</p>
       </div>
    )
}

export default ShipItem;