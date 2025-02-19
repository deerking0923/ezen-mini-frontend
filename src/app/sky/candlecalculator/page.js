"use client";

import React, { useState } from "react";
import "./CandleCalculator.css";
import { soul1Tree, soul2Tree, soul3Tree } from "./data/trees";
import NodeView from "./components/NodeView";
import SoulSidebar from "./components/SoulSidebar";
import GuideSidebar from "./components/GuideSidebar";
import { sumWantedCost } from "./utils/candleUtils";

export default function CandleCalculatorPage() {
  // 영혼별 노드 상태 분리
  const [soulNodeStates, setSoulNodeStates] = useState({
    1: {}, // 팔짝 뛰는 무용수
    2: {}, // 도발하는 곡예사
    3: {}, // 인사하는 주술사
  });

  const [openMenu, setOpenMenu] = useState(null);
  const [currentCandles, setCurrentCandles] = useState(0);

  const handleSetNodeStates = (soulIndex, updater) => {
    setSoulNodeStates((prev) => {
      const old = prev[soulIndex] || {};
      const newSlice = typeof updater === "function" ? updater(old) : updater;
      return {
        ...prev,
        [soulIndex]: newSlice,
      };
    });
  };

  const handleCalculate = () => {
    const c1 = sumWantedCost(soul1Tree, soulNodeStates[1]);
    const c2 = sumWantedCost(soul2Tree, soulNodeStates[2]);
    const c3 = sumWantedCost(soul3Tree, soulNodeStates[3]);
    const totalRequired = c1 + c2 + c3;
    const difference = totalRequired - Number(currentCandles);
    if (difference < 0) {
      alert(`
팔짝 뛰는 무용수: ${c1} candles
도발하는 곡예사: ${c2} candles
인사하는 주술사: ${c3} candles
총 필요: ${totalRequired} candles
시즌 양초가 ${-difference}개 남습니다!
      `);
    } else {
      alert(`
팔짝 뛰는 무용수: ${c1} candles
도발하는 곡예사: ${c2} candles
인사하는 주술사: ${c3} candles
총 필요: ${totalRequired} candles
추가 필요: ${difference} candles
      `);
    }
  };

  const handlePageClick = () => {
    setOpenMenu(null);
  };

  return (
    <div className="calc-container" onClick={handlePageClick}>
      <h1 className="header-title">
        스카이 양초 계산기 <span className="byline">made by 진사슴</span>
      </h1>
      <div className="candle-input">
        <label htmlFor="currentCandles">현재 보유 양초 수: </label>
        <input
          id="currentCandles"
          type="number"
          min="0"
          value={currentCandles}
          onChange={(e) => setCurrentCandles(e.target.value)}
        />
      </div>
      <div className="main-content">
        <SoulSidebar />
        <div className="nodes-container" onClick={(e) => e.stopPropagation()}>
          <div className="souls-wrapper">
            {/* Soul 1 */}
            <div className="soul-col">
              <h2 className="soul-name">팔짝 뛰는 무용수</h2>
              <NodeView
                node={soul1Tree}
                nodeStates={soulNodeStates[1]}
                setNodeStates={(updater) => handleSetNodeStates(1, updater)}
                soulIndex={1}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
              <div className="candle-count">
                <img
                  src="/sky/calculator/candle.webp"
                  alt="Candle"
                  className="candle-icon"
                />
                135candles
              </div>
            </div>
            {/* Soul 2 */}
            <div className="soul-col">
              <h2 className="soul-name">도발하는 곡예사</h2>
              <NodeView
                node={soul2Tree}
                nodeStates={soulNodeStates[2]}
                setNodeStates={(updater) => handleSetNodeStates(2, updater)}
                soulIndex={2}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
              <div className="candle-count">
                <img
                  src="/sky/calculator/candle.webp"
                  alt="Candle"
                  className="candle-icon"
                />
                139 candles
              </div>
            </div>
            {/* Soul 3 */}
            <div className="soul-col">
              <h2 className="soul-name">인사하는 주술사</h2>
              <NodeView
                node={soul3Tree}
                nodeStates={soulNodeStates[3]}
                setNodeStates={(updater) => handleSetNodeStates(3, updater)}
                soulIndex={3}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
              <div className="candle-count">
                <img
                  src="/sky/calculator/candle.webp"
                  alt="Candle"
                  className="candle-icon"
                />
                123 candles
              </div>
            </div>
          </div>
          <div className="btn-row">
            <button className="calc-btn" onClick={handleCalculate}>
              Calculate
            </button>
          </div>
        </div>
        <GuideSidebar />
      </div>
    </div>
  );
}
