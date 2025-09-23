// components/LoadingSpinner/LoadingSpinner.js
"use client";

import React from "react";
import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className={styles.loading}>
      {message}
    </div>
  );
}