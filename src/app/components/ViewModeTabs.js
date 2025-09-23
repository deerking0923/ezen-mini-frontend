// components/ViewModeTabs/ViewModeTabs.js
"use client";

import React from "react";
import styles from "./ViewModeTabs.module.css";

export default function ViewModeTabs({ 
  viewMode, 
  listSort, 
  onViewModeChange, 
  onSortChange 
}) {
  return (
    <div className={styles.headerRow}>
      <div className={styles.viewTabs}>
        <button
          className={`${styles.tabButton} ${
            viewMode === "card" ? styles.activeTab : ""
          }`}
          onClick={() => onViewModeChange("card")}
        >
          카드 보기
        </button>
        <button
          className={`${styles.tabButton} ${
            viewMode === "list" ? styles.activeTab : ""
          }`}
          onClick={() => onViewModeChange("list")}
        >
          리스트 보기
        </button>
      </div>
      

    </div>
  );
}