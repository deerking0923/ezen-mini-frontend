// components/SoulCard/SoulCard.js
"use client";

import React from "react";
import Link from "next/link";
import styles from "./SoulCard.module.css";
import { SEASON_LIST } from "../constants/seasons";

export default function SoulCard({ 
  soul, 
  viewMode, 
  submittedQuery, 
  isMobile, 
  formatDate, 
  onCardClick 
}) {
  const repImg = soul.images?.find(
    (img) => img.imageType === "REPRESENTATIVE"
  );

  const params = new URLSearchParams();
  params.set("mode", viewMode);
  if (submittedQuery) params.set("query", submittedQuery);

  return (
    <Link
      id={`soul-${soul.id}`}
      data-soul-id={soul.id}
      href={`/sky/travelingSprits/generalVisits/${soul.id}${
        params.toString() ? "?" + params.toString() : ""
      }`}
      className={styles.soulCard}
      onClick={() => onCardClick(soul)}
    >
      <div className={styles.imageWrapperSquare}>
        {repImg?.url ? (
          <img
            src={repImg.url}
            alt={soul.name}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      <div className={styles.cardContent}>
        <p className={styles.firstLine}>
          <span
            className={styles.seasonName}
            style={{
              backgroundColor:
                SEASON_LIST.find((s) => s.name === soul.seasonName)
                  ?.color || "#444",
            }}
          >
            {soul.seasonName}
          </span>
          <span className={styles.soulName}>{soul.name}</span>
        </p>
        <p className={styles.secondLine}>
          {soul.orderNum < 0 ? (
            <strong style={{ color: "blue" }}>
              {isMobile
                ? `#${Math.abs(soul.orderNum)}`
                : `${Math.abs(soul.orderNum)}번째 유랑단`}
            </strong>
          ) : (
            `${soul.orderNum}번째`
          )}{" "}
          | {soul.rerunCount}차 복각
        </p>
        <p className={styles.thirdLine}>
          {formatDate(soul.startDate)} ~ {formatDate(soul.endDate)}
        </p>
      </div>
    </Link>
  );
}