"use client";
import React from "react";// 해당 영역 전용 스타일 파일

export default function SoulSidebar() {
  return (
    <div className="soul-sidebar">
      <div className="soul-item">
        <img
          src="/sky/calculator/spirit1.webp"
          alt="팔짝 뛰는 무용수"
          className="soul-photo"
        />
        <div className="soul-label">팔짝 뛰는 무용수</div>
      </div>
      <div className="soul-item">
        <img
          src="/sky/calculator/spirit2.webp"
          alt="도발하는 곡예사"
          className="soul-photo"
        />
        <div className="soul-label">도발하는 곡예사</div>
      </div>
      <div className="soul-item">
        <img
          src="/sky/calculator/spirit3.webp"
          alt="인사하는 주술사"
          className="soul-photo"
        />
        <div className="soul-label">인사하는 주술사</div>
      </div>
    </div>
  );
}
