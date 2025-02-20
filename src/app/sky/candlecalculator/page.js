"use client";
import React, { useState } from "react";
import "./CandleCalculator.css";
import { soul1Tree, soul2Tree, soul3Tree } from "./data/trees";
import NodeView from "./components/NodeView";
import SoulInfoSidebar from "./components/SoulInfoSidebar";
import GuideSidebar from "./components/GuideSidebar";
import CandleSettingsPanel from "./components/CandleSettingsPanel";
import { sumWantedCost } from "./utils/candleUtils";
import html2canvas from "html2canvas";
import SimpleCandleCalculator from "./components/SimpleCandleCalculator";

export default function CandleCalculatorPage() {
  // 영혼별 노드 상태 분리
  const [soulNodeStates, setSoulNodeStates] = useState({
    1: {},
    2: {},
    3: {},
  });
  const [openMenu, setOpenMenu] = useState(null);
  const [currentCandles, setCurrentCandles] = useState(0);
  const [selectedSoulIndex, setSelectedSoulIndex] = useState(1);
  const [showSoulModal, setShowSoulModal] = useState(false);
  const [showTotalInfoModal, setShowTotalInfoModal] = useState(false);
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

  // 필요한 양초 수 (각 영혼별 "want" 상태에 따른 비용 합)
  const requiredCandles =
    sumWantedCost(soul1Tree, soulNodeStates[1]) +
    sumWantedCost(soul2Tree, soulNodeStates[2]) +
    sumWantedCost(soul3Tree, soulNodeStates[3]);

  const handlePageClick = () => {
    setOpenMenu(null);
  };

  const handleSoulNameClick = (soulIndex) => {
    setSelectedSoulIndex(soulIndex);
    setShowSoulModal(true);
  };
  const handleDownload = async () => {
    const element = document.querySelector(".calc-container");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null, // CSS 배경 유지
        scale: window.devicePixelRatio, // 고해상도 캡쳐
        ignoreElements: (el) => el.classList.contains("no-capture"), // no-capture 클래스 요소 무시
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
      <h1 className="header-title">
        스카이 양초 계산기 <span className="byline">made by 진사슴</span>
      </h1>

      <div className="total-info-container no-capture">
        <button
          className="total-info-btn"
          onClick={() => setShowTotalInfoModal(true)}
        >
          전체 노드표 보기
        </button>
      </div>

      {/* 조건 설정창에 부모에서 계산한 requiredCandles 전달 */}
      <CandleSettingsPanel
        currentCandles={currentCandles}
        setCurrentCandles={setCurrentCandles}
        requiredCandles={requiredCandles}
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
              <div className="candle-selected">
                선택한 양초: {sumWantedCost(soul1Tree, soulNodeStates[1])}개
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
              <div className="candle-selected">
                선택한 양초: {sumWantedCost(soul2Tree, soulNodeStates[2])}개
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
              <div className="candle-selected">
                선택한 양초: {sumWantedCost(soul3Tree, soulNodeStates[3])}개
              </div>
            </div>
          </div>
        </div>
        <GuideSidebar onClick={() => setShowGuideModal(true)} />
      </div>

      {/* 결과 다운로드 버튼 */}
      <div className="download-btn-container no-capture">
        <button className="download-btn" onClick={handleDownload}>
          결과 다운로드
        </button>
      </div>

      <SimpleCandleCalculator />

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
