"use client";

import React, { useState } from "react";
import "./CandleCalculator.css";
import { soul1Tree, soul2Tree, soul3Tree } from "./data/trees";
import NodeView from "./components/NodeView";
import SoulInfoSidebar from "./components/SoulInfoSidebar";
import GuideSidebar from "./components/GuideSidebar";
import { sumWantedCost } from "./utils/candleUtils";

export default function CandleCalculatorPage() {
  // 영혼별 노드 상태 분리
  const [soulNodeStates, setSoulNodeStates] = useState({
    1: {},
    2: {},
    3: {},
  });
  const [openMenu, setOpenMenu] = useState(null);
  const [currentCandles, setCurrentCandles] = useState(0);
  // 선택된 영혼 번호 (모달에 표시할 정보)
  const [selectedSoulIndex, setSelectedSoulIndex] = useState(1);
  // 모달 창 표시 여부 (영혼 정보 모달)
  const [showSoulModal, setShowSoulModal] = useState(false);
  // 전체 노드표 보기 모달 표시 여부
  const [showTotalInfoModal, setShowTotalInfoModal] = useState(false);

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

  // 각 영혼 칼럼의 제목 클릭 시 모달에 해당 영혼 정보를 띄움
  const handleSoulNameClick = (soulIndex) => {
    setSelectedSoulIndex(soulIndex);
    setShowSoulModal(true);
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
      {/* 전체 노드표 보기 버튼 */}
      <div className="total-info-container">
        <button
          className="total-info-btn"
          onClick={() => setShowTotalInfoModal(true)}
        >
          전체 노드표 보기
        </button>
      </div>
      <div className="main-content">
        {/* 중앙: 노드 영역 */}
        <div className="nodes-container" onClick={(e) => e.stopPropagation()}>
          <div className="souls-wrapper">
            {/* Soul 1 */}
            <div className="soul-col">
              <h2 className="soul-name" onClick={() => handleSoulNameClick(1)}>
                팔짝 뛰는 무용수
              </h2>
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
                135 양초
              </div>
            </div>
            {/* Soul 2 */}
            <div className="soul-col">
              <h2 className="soul-name" onClick={() => handleSoulNameClick(2)}>
                도발하는 곡예사
              </h2>
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
                139 양초
              </div>
            </div>
            {/* Soul 3 */}
            <div className="soul-col">
              <h2 className="soul-name" onClick={() => handleSoulNameClick(3)}>
                인사하는 주술사
              </h2>
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
                123 양초
              </div>
            </div>
          </div>

          <div className="btn-row">
            <button className="calc-btn" onClick={handleCalculate}>
              계산하기
            </button>
          </div>
        </div>
        <GuideSidebar />
      </div>

      {/* 모달 창: 선택된 영혼의 정보 사진 표시 */}
      {showSoulModal && (
        <div className="modal-overlay" onClick={() => setShowSoulModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 상단 닫기 버튼 */}
            <button
              className="modal-close"
              onClick={() => setShowSoulModal(false)}
            >
              &times;
            </button>
            {/* 모달 제목 */}
            <div className="modal-header">
              <h3 className="modal-title">
                &lt;sky 네이버 카페&gt; 광채의 시즌 가이드 - 햇비님
              </h3>
            </div>
            {/* 영혼 정보 영역 */}
            <SoulInfoSidebar selectedSoulIndex={selectedSoulIndex} />
            {/* 하단 닫기 버튼 */}
            <button
              className="modal-close-bottom"
              onClick={() => setShowSoulModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 모달 창: 전체 노드표 보기 */}
      {showTotalInfoModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowTotalInfoModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 상단 닫기 버튼 */}
            <button
              className="modal-close"
              onClick={() => setShowTotalInfoModal(false)}
            >
              &times;
            </button>
            {/* 모달 제목 */}
            <div className="modal-header">
              <h3 className="modal-title">전체 노드표</h3>
            </div>
            <img
              src="/sky/calculator/info/totalinfo.png"
              alt="전체 노드표"
              style={{ width: "100%", maxWidth: "600px", margin: "20px auto" }}
            />
            {/* 하단 닫기 버튼 */}
            <button
              className="modal-close-bottom"
              onClick={() => setShowTotalInfoModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
