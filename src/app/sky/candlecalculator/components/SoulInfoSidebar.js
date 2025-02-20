"use client";
import React from "react";

export default function SoulInfoSidebar({ selectedSoulIndex }) {
  const soulNames = {
    1: "팔짝 뛰는 무용수",
    2: "도발하는 곡예사",
    3: "인사하는 주술사",
  };

  // 영혼별 정보 사진 개수: 1번은 6개, 2번은 5개, 3번은 4개
  const infoCounts = { 1: 6, 2: 5, 3: 4 };
  const infoCount = infoCounts[selectedSoulIndex] || 0;
  // 이미지 URL 배열 생성 (예: spirit1_1.png, spirit1_2.png, …)
  const images = Array.from({ length: infoCount }, (_, i) => 
    `/sky/calculator/info/spirit${selectedSoulIndex}_${i + 1}.png`
  );

  return (
    <div className="soul-info-sidebar">
      <h2 className="soul-info-header">{soulNames[selectedSoulIndex]}</h2>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Spirit ${selectedSoulIndex} info ${index + 1}`}
          className="soul-info-img"
        />
      ))}
    </div>
  );
}
