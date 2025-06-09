import React from "react";
import styles from "./Panel.module.css";

function Panel(props) {
  return (
    <div className={styles.panelContainer}>
      <h3 className={styles.panelTitle}>{props.judul}</h3>
      <div className={styles.panelContent}>{props.children}</div>
    </div>
  );
}
export default Panel;
