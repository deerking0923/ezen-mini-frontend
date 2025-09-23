// src/app/components/SoulListView.js
"use client";

import React from "react";
import Link from "next/link";
import styles from "./SoulListView.module.css";
import { SEASON_LIST } from "../constants/seasons";

export default function SoulListView({ 
  souls, 
  viewMode, 
  submittedQuery, 
  onCardClick,
  lastSoulElementRef 
}) {
  // 날짜 포맷팅
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className={styles.spiritsList}>
      {souls.map((soul, index) => {
        const repImg = soul.images?.find(
          (img) => img.imageType === "REPRESENTATIVE"
        );
        const isLast = index === souls.length - 1;
        const isWarband = soul.orderNum < 0;

        const params = new URLSearchParams();
        params.set("mode", viewMode);
        if (submittedQuery) params.set("query", submittedQuery);

        return (
          <Link
            key={`${soul.id}-${soul.__page ?? "p"}`}
            href={`/sky/travelingSprits/generalVisits/${soul.id}${
              params.toString() ? "?" + params.toString() : ""
            }`}
            className={styles.spiritCard}
            onClick={() => onCardClick(soul)}
            ref={isLast ? lastSoulElementRef : null}
          >
            <div className={`${styles.rankBadge} ${isWarband ? styles.warbandRankBadge : ''}`}>
              {isWarband ? `#${Math.abs(soul.orderNum)}` : `#${soul.orderNum}`}
            </div>
            
            <div className={styles.imageSection}>
              {repImg?.url ? (
                <img
                  src={repImg.url}
                  alt={soul.name}
                  className={styles.spiritImage}
                />
              ) : (
                <div className={styles.noImage}>이미지 없음</div>
              )}
            </div>

            <div className={styles.infoSection}>
              <div className={styles.nameRow}>
                <span 
                  className={styles.seasonBadge}
                  style={{ 
                    backgroundColor: isWarband ? "#FF8C00" : 
                      (SEASON_LIST.find((s) => s.name === soul.seasonName)?.color || "#888")
                  }}
                >
                  {soul.seasonName}
                </span>
                <h3 className={styles.spiritName}>{soul.name}</h3>
              </div>

              <div className={styles.detailsRow}>
                <span className={styles.orderNumber}>
                  {isWarband ? (
                    <span style={{ color: "#FF8C00", fontWeight: "bold" }}>
                      {Math.abs(soul.orderNum)}번째 유랑단
                    </span>
                  ) : (
                    `${soul.orderNum}번째`
                  )}
                </span>
                <span className={styles.rerunCount}>
                  {soul.rerunCount}차 복각
                </span>
              </div>

              <div className={styles.dateInfo}>
                <span>기간: {formatDate(soul.startDate)} ~ {formatDate(soul.endDate)}</span>
              </div>
            </div>

            <div className={styles.statusSection}>
              {/* 유랑단 뱃지 제거 */}
            </div>
          </Link>
        );
      })}
    </div>
  );
}