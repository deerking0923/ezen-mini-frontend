"use client";
import React, { useState } from "react";
import "./CandleCalculator.css";
import {
  soul1Array,
  soul1SeasonArray,
  soul2Array,
  soul2SeasonArray,
  soul3Array,
  soul3SeasonArray,
  soul4Array,
  soul4SeasonArray,
} from "./data/arrays";
import ArrayNodeView from "./components/ArrayNodeView";
import CandleSettingsPanel from "./components/CandleSettingsPanel";
import { sumWantedCost } from "./utils/candleUtils";
import html2canvas from "html2canvas";
import SimpleCandleCalculator from "./components/SimpleCandleCalculator";

export default function CandleCalculatorPage() {
  const [soulNodeStates, setSoulNodeStates] = useState({ 1: {}, 2: {}, 3: {}, 4: {} });
  const [openMenu, setOpenMenu] = useState(null);
  const [currentCandles, setCurrentCandles] = useState(0);

  const handleSetNodeStates = (soulIndex, updater) => {
    setSoulNodeStates((prev) => {
      const old = prev[soulIndex] || {};
      const newSlice = typeof updater === "function" ? updater(old) : updater;
      return { ...prev, [soulIndex]: newSlice };
    });
  };

  const requiredCandles =
    sumWantedCost(soul1Array, soul1SeasonArray, soulNodeStates[1]) +
    sumWantedCost(soul2Array, soul2SeasonArray, soulNodeStates[2]) +
    sumWantedCost(soul3Array, soul3SeasonArray, soulNodeStates[3]) +
    sumWantedCost(soul4Array, soul4SeasonArray, soulNodeStates[4]);

  const handlePageClick = () => setOpenMenu(null);

  const handleDownload = async () => {
    const element = document.querySelector(".calc-container");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#333333",
        scale: window.devicePixelRatio,
        ignoreElements: (el) => el.classList.contains("no-capture"),
      });
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "calc-container.png";
      link.click();
    } catch (error) {
      console.error("캡쳐 실패:", error);
    }
  };

  return (
    <div className="calc-container" onClick={handlePageClick}>
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
              { array: soul1Array, season: soul1SeasonArray, name: "다정한 장난감상인", fixed: 75, key: 1 },
              { array: soul2Array, season: soul2SeasonArray, name: "지략있는 은둔자", fixed: 87, key: 2 },
              { array: soul3Array, season: soul3SeasonArray, name: "엄격한 목자", fixed: 87, key: 3 },
              { array: soul4Array, season: soul4SeasonArray, name: "상처입은 파수꾼", fixed: 113, key: 4 },
            ].map(({ array, season, name, fixed, key }) => (
              <div className="soul-col" key={key}>
                <div className="soul-selector">
                  <img
                    src={`/sky/calculator/spirit${key}.webp`}
                    alt={`영혼 ${key}`}
                    className="soul-selector-img"
                  />
                  <span className="soul-selector-text">{name}</span>
                </div>
                <ArrayNodeView
                  mainArray={array}
                  seasonArray={season}
                  nodeStates={soulNodeStates[key]}
                  setNodeStates={(upd) => handleSetNodeStates(key, upd)}
                  soulIndex={key}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                />
                <div className="candle-count">
                  <img
                    src="/sky/calculator/candle.webp"
                    alt="Candle"
                    className="candle-icon"
                  />
                  {fixed} 양초
                </div>
                <div className="candle-selected">
                  선택한 양초: {sumWantedCost(array, season, soulNodeStates[key])}개
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="download-btn-container no-capture">
        <button className="download-btn" onClick={handleDownload}>
          결과 다운로드
        </button>
      </div>

      <SimpleCandleCalculator />
    </div>
  );
}
