// components/SoulCardGrid/SoulCardGrid.js
"use client";

import React from "react";
import SoulCard from "./SoulCard";
import styles from "./SoulCardGrid.module.css";

export default function SoulCardGrid({ 
  souls, 
  viewMode, 
  submittedQuery, 
  isMobile, 
  formatDate, 
  onCardClick 
}) {
  return (
    <div className={styles.cardsGrid}>
      {souls.map((soul) => (
        <SoulCard
          key={`${soul.id}-${soul.__page ?? "p"}`}
          soul={soul}
          viewMode={viewMode}
          submittedQuery={submittedQuery}
          isMobile={isMobile}
          formatDate={formatDate}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}