"use client";
import React, { useState } from "react";
import "./CandleCalculator.css";
import {
  soul1Array, soul1SeasonArray,
  soul2Array, soul2SeasonArray,
  soul3Array, soul3SeasonArray,
  soul4Array, soul4SeasonArray,
} from "./data/arrays";
import ArrayNodeView from "./components/ArrayNodeView";
import CandleSettingsPanel from "./components/CandleSettingsPanel";
import { sumWantedCost } from "./utils/candleUtils";
import html2canvas from "html2canvas";
import SimpleCandleCalculator from "./components/SimpleCandleCalculator";

export default function CandleCalculatorPage() {
  const [soulNodeStates, setSoulNodeStates] = useState({ 1: {}, 2: {}, 3: {}, 4: {} });
  const [openMenu, setOpenMenu]   = useState(null);
  const [currentCandles, setCurrentCandles] = useState(0);

  /* ------------ 상태 helpers ------------ */
  const handleSetNodeStates = (idx, updater) =>
    setSoulNodeStates((prev) => ({
      ...prev,
      [idx]: typeof updater === "function" ? updater(prev[idx] || {}) : updater,
    }));

  const requiredCandles =
      sumWantedCost(soul1Array, soul1SeasonArray, soulNodeStates[1]) +
      sumWantedCost(soul2Array, soul2SeasonArray, soulNodeStates[2]) +
      sumWantedCost(soul3Array, soul3SeasonArray, soulNodeStates[3]) +
      sumWantedCost(soul4Array, soul4SeasonArray, soulNodeStates[4]);

  /* ------------ 캡처 다운로드 ------------ */
  const handleDownload = async () => {
    const el = document.querySelector(".calc-container");
    if (!el) return;
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: "#ffffff",           // 흰 배경
        scale: window.devicePixelRatio,       // 필요 시 2 또는 1 로 조정
        ignoreElements: (n) => n.classList.contains("no-capture"),
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "sky_candle_calc.png";
      link.click();
    } catch (e) {
      console.error("캡처 실패:", e);
    }
  };

  /* ------------ 렌더 ------------ */
  return (
    <div className="calc-container" onClick={() => setOpenMenu(null)}>
      <h1 className="header-title-big">
        스카이 양초 계산기 <span className="byline">만든이 진사슴</span>
      </h1>

      <CandleSettingsPanel
        currentCandles={currentCandles}
        setCurrentCandles={setCurrentCandles}
        requiredCandles={requiredCandles}
      />

      <div className="main-content">
        <div className="nodes-container" onClick={(e) => e.stopPropagation()}>
          <div className="souls-wrapper">
            {[
              { arr: soul1Array, sea: soul1SeasonArray, name: "다정한 장난감상인", fixed: 75, idx: 1 },
              { arr: soul2Array, sea: soul2SeasonArray, name: "지략있는 은둔자",   fixed: 87, idx: 2 },
              { arr: soul3Array, sea: soul3SeasonArray, name: "엄격한 목자",       fixed: 87, idx: 3 },
              { arr: soul4Array, sea: soul4SeasonArray, name: "상처입은 파수꾼",   fixed: 113, idx: 4 },
            ].map(({ arr, sea, name, fixed, idx }) => (
              <div className="soul-col" key={idx}>
                {/* 썸네일: background-image 방식 */}
                <div className="soul-selector">
                  <div
                    className="soul-thumb"
                    style={{ backgroundImage: `url(/sky/calculator/spirit${idx}.webp)` }}
                  />
                  <span className="soul-selector-text">{name}</span>
                </div>

                <ArrayNodeView
                  mainArray={arr}
                  seasonArray={sea}
                  nodeStates={soulNodeStates[idx]}
                  setNodeStates={(u) => handleSetNodeStates(idx, u)}
                  soulIndex={idx}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                />

                <div className="candle-count">
                  <img src="/sky/calculator/candle.webp" alt="candle" className="candle-icon" />
                  {fixed} 양초
                </div>
                <div className="candle-selected">
                  선택한 양초: {sumWantedCost(arr, sea, soulNodeStates[idx])}개
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="download-btn-container no-capture">
        <button className="download-btn" onClick={handleDownload}>결과 다운로드</button>
      </div>

      <SimpleCandleCalculator />
    </div>
  );
}
