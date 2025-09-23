// components/SearchBar/SearchBar.js
"use client";

import React from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit 
}) {
  return (
    <div className={styles.searchContainer}>
      <form onSubmit={onSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="키워드, 시즌, 영혼 이름 검색"
          value={searchQuery}
          onChange={onSearchChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
      </form>
    </div>
  );
}