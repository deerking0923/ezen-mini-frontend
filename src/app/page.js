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
    <div className="main-page-wrapper">
      <div className="intro-text">
        본 사이트는 thatgamecompany의 Sky:Children of the light &lt;비공식&gt; 팬사이트입니다.
        <br/>
        <br/>
        만든이 진사슴
      </div>
      <div className="main-page-container">
      <div
          className="option-container"
          onClick={() => navigateTo("/sky/travelingSprits/generalVisits/list")}
        >
          <img
            src="/sky/extra/dictionary.png"
            alt="유랑 대백과"
            className="option-image"
          />
          <h2 className="option-title">유랑 대백과</h2>
        </div>
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
          onClick={() => navigateTo("/sky/mbti")}
        >
          <img
            src="/sky/extra/mbti.png"
            alt="성향테스트"
            className="option-image"
          />
          <h2 className="option-title">성향 테스트</h2>
        </div>
        <div
          className="option-container"
          onClick={() => navigateTo("/sky/temp")}
        >
          <img
            src="/sky/extra/calculator.png"
            alt="양초계산기"
            className="option-image"
          />
          <h2 className="option-title">양초계산기</h2>
        </div>
      </div>
    </div>
  );
}
