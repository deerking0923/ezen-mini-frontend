// components/SoulListView/SoulListView.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./SoulListView.module.css";
import { SEASON_LIST } from "../constants/seasons";

export default function SoulListView({ 
  souls, 
  viewMode, 
  submittedQuery, 
  onCardClick 
}) {
  const router = useRouter();

  return (
    <table className={styles.tableView}>
      <thead>
        <tr>
          <th className={styles.thOrder}>순서</th>
          <th className={styles.thSeason}>시즌</th>
          <th className={styles.thName}>이름</th>
          <th className={styles.thPeriod}>기간</th>
          <th className={styles.thRerun}>n차</th>
        </tr>
      </thead>
      <tbody>
        {souls.map((soul) => {
          const repImg = soul.images?.find(
            (img) => img.imageType === "REPRESENTATIVE"
          );

          const params = new URLSearchParams();
          params.set("mode", viewMode);
          if (submittedQuery) params.set("query", submittedQuery);

          return (
            <tr
              key={`${soul.id}-${soul.__page ?? "p"}`}
              className={styles.tableRow}
              onClick={() => {
                onCardClick(soul);
                router.push(
                  `/sky/travelingSprits/generalVisits/${soul.id}${
                    params.toString() ? "?" + params.toString() : ""
                  }`
                );
              }}
              style={{ cursor: "pointer" }}
            >
              <td className={styles.tdOrder}>
                {repImg?.url && (
                  <img
                    src={repImg.url}
                    alt={soul.name}
                    className={styles.tableThumbnail}
                  />
                )}
                {soul.orderNum < 0 ? (
                  <span className={styles.warbandOrder}>
                    {Math.abs(soul.orderNum)}
                  </span>
                ) : (
                  soul.orderNum
                )}
              </td>
              <td className={styles.tdSeason}>
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
              </td>
              <td className={styles.tdName}>{soul.name}</td>
              <td className={styles.tdPeriod}>
                {soul.startDate} ~ {soul.endDate}
              </td>
              <td className={styles.tdRerun}>{soul.rerunCount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}