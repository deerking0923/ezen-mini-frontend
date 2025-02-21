"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Next.js 라우터 사용 예시, 필요에 따라 수정하세요.
import "./Mainpage.css";

export default function MainPage() {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="main-page-container">
      <div
        className="option-container"
        onClick={() => navigateTo("/sky/height")}
      >
        <img
          src="/sky/extra/height.png"
          alt="키 재기"
          className="option-image"
        />
        <h2 className="option-title">키 재기</h2>
      </div>
      <div
        className="option-container"
        onClick={() => navigateTo("/sky/candlecalculator")}
      >
        <img
          src="/sky/extra/calculator.png"
          alt="양초계산기"
          className="option-image"
        />
        <h2 className="option-title">양초계산기</h2>
      </div>
    </div>
  );


}
