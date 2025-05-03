// SoulInfoSidebar.jsx
"use client";
import React from "react";

export default function SoulInfoSidebar({ selectedSoulIndex }) {
  // 영혼별 이름 (5개로 확장)
  const soulNames = {
    1: "점치는 현명한 노인",
    2: "분장한 꽃가루 사촌",
    3: "고귀한 쓰다듬는 청년",
    4: "그리워하는 폭죽장이 부모",
    5: "나무베는 애원하는 부모",
  };

  // 영혼별 정보 이미지 개수 (각 영혼마다 다르게 설정)
  const infoCounts = { 1: 3, 2: 5, 3: 4, 4: 3, 5: 3 };
  const infoCount = infoCounts[selectedSoulIndex] || 0;

  // 해당 영혼의 정보 이미지 URL 배열 생성
  const images = Array.from({ length: infoCount }, (_, i) =>
    `/sky/calculator/info/spirit${selectedSoulIndex}_${i + 1}.png`
  );

  return (
    <div className="soul-info-sidebar">
      <h2 className="soul-info-header">
        {soulNames[selectedSoulIndex] || ""}
      </h2>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`${soulNames[selectedSoulIndex]} info ${index + 1}`}
          className="soul-info-img"
        />
      ))}
    </div>
  );
}
