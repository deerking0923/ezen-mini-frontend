"use client";
import React, { useState } from "react";
import "./CandleCalculator.css";
import { soul1Tree, soul2Tree, soul3Tree } from "./data/trees";
import NodeView from "./components/NodeView";
import SoulInfoSidebar from "./components/SoulInfoSidebar";
import GuideSidebar from "./components/GuideSidebar";
import CandleSettingsPanel from "./components/CandleSettingsPanel";
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
  // 가이드 정보 모달 표시 여부
  const [showGuideModal, setShowGuideModal] = useState(false);

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

  // 계산 결과 문자열 반환 (alert 대신 결과 문자열을 반환)
  const onCalculate = () => {
    const c1 = sumWantedCost(soul1Tree, soulNodeStates[1]);
    const c2 = sumWantedCost(soul2Tree, soulNodeStates[2]);
    const c3 = sumWantedCost(soul3Tree, soulNodeStates[3]);
    const totalRequired = c1 + c2 + c3;
    const difference = totalRequired - Number(currentCandles);

    let result;
    if (difference < 0) {
      result = `
팔짝 뛰는 무용수: ${c1} candles
도발하는 곡예사: ${c2} candles
인사하는 주술사: ${c3} candles
총 필요: ${totalRequired} candles
시즌 양초가 ${-difference}개 남습니다!
      `;
    } else {
      result = `
팔짝 뛰는 무용수: ${c1} candles
도발하는 곡예사: ${c2} candles
인사하는 주술사: ${c3} candles
총 필요: ${totalRequired} candles
추가 필요: ${difference} candles
      `;
    }
    return result;
  };

  const handlePageClick = () => {
    setOpenMenu(null);
  };

  // 각 영혼 컬럼의 선택 컨테이너 클릭 시 모달에 해당 영혼 정보를 띄움
  const handleSoulNameClick = (soulIndex) => {
    setSelectedSoulIndex(soulIndex);
    setShowSoulModal(true);
  };

  return (
    <div className="calc-container" onClick={handlePageClick}>
      <h1 className="header-title">
        스카이 양초 계산기 <span className="byline">made by 진사슴</span>
      </h1>

      {/* 전체 노드표 보기 버튼 */}
      <div className="total-info-container">
        <button
          className="total-info-btn"
          onClick={() => setShowTotalInfoModal(true)}
        >
          전체 노드표 보기
        </button>
      </div>

      {/* 조건 설정창 */}
      <CandleSettingsPanel
        currentCandles={currentCandles}
        setCurrentCandles={setCurrentCandles}
        onCalculate={onCalculate}
      />

      <div className="main-content">
        <div className="nodes-container" onClick={(e) => e.stopPropagation()}>
          <div className="souls-wrapper">
            {/* Soul 1 */}
            <div className="soul-col">
              <div
                className="soul-selector"
                onClick={() => handleSoulNameClick(1)}
              >
                <img
                  src="/sky/calculator/spirit1.webp"
                  alt="팔짝 뛰는 무용수"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">팔짝 뛰는 무용수</span>
              </div>
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
              <div
                className="soul-selector"
                onClick={() => handleSoulNameClick(2)}
              >
                <img
                  src="/sky/calculator/spirit2.webp"
                  alt="도발하는 곡예사"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">도발하는 곡예사</span>
              </div>
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
              <div
                className="soul-selector"
                onClick={() => handleSoulNameClick(3)}
              >
                <img
                  src="/sky/calculator/spirit3.webp"
                  alt="인사하는 주술사"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">인사하는 주술사</span>
              </div>
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
        </div>
        <GuideSidebar onClick={() => setShowGuideModal(true)} />
      </div>

      {/* 모달 창: 선택된 영혼의 정보 사진 표시 */}
      {showSoulModal && (
        <div className="modal-overlay" onClick={() => setShowSoulModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowSoulModal(false)}
            >
              &times;
            </button>
            <div className="modal-header">
              <h3 className="modal-title">
                &lt;sky 네이버 카페&gt; 광채의 시즌 가이드 - 햇비님
              </h3>
            </div>
            <SoulInfoSidebar selectedSoulIndex={selectedSoulIndex} />
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
            <button
              className="modal-close"
              onClick={() => setShowTotalInfoModal(false)}
            >
              &times;
            </button>
            <div className="modal-header">
              <h3 className="modal-title">전체 노드표</h3>
            </div>
            <img
              src="/sky/calculator/info/totalinfo.png"
              alt="전체 노드표"
              style={{ width: "100%", maxWidth: "600px", margin: "20px auto" }}
            />
            <button
              className="modal-close-bottom"
              onClick={() => setShowTotalInfoModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 모달 창: 가이드 정보 보기 (GuideSidebar 클릭 시) */}
      {showGuideModal && (
        <div className="modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowGuideModal(false)}
            >
              &times;
            </button>
            <div className="modal-header">
              <h3 className="modal-title">
                &lt;sky 네이버 카페&gt; 광채의 시즌 가이드 - 햇비님
              </h3>
              <h3 className="modal-title">시즌 안내자</h3>
            </div>
            <div className="guide-modal-images">
              <img src="/sky/calculator/info/guide1.png" alt="Guide 1" />
              <img src="/sky/calculator/info/guide2.png" alt="Guide 2" />
              <img src="/sky/calculator/info/guide3.png" alt="Guide 3" />
              <img src="/sky/calculator/info/guide4.png" alt="Guide 4" />
            </div>
            <button
              className="modal-close-bottom"
              onClick={() => setShowGuideModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
