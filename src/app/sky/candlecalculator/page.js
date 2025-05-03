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
  soul5Array,
  soul5SeasonArray,
} from "./data/arrays";
import ArrayNodeView from "./components/ArrayNodeView";
import SoulInfoSidebar from "./components/SoulInfoSidebar";
import GuideSidebar from "./components/GuideSidebar";
import CandleSettingsPanel from "./components/CandleSettingsPanel";
import { sumWantedCost } from "./utils/candleUtils";
import html2canvas from "html2canvas";
import SimpleCandleCalculator from "./components/SimpleCandleCalculator";

export default function CandleCalculatorPage() {
  // 영혼별 노드 상태 분리 (1~5)
  const [soulNodeStates, setSoulNodeStates] = useState({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
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
      return { ...prev, [soulIndex]: newSlice };
    });
  };

  // 필요한 양초 수: 1~5 영혼 합산
  const requiredCandles =
    sumWantedCost(soul1Array, soul1SeasonArray, soulNodeStates[1]) +
    sumWantedCost(soul2Array, soul2SeasonArray, soulNodeStates[2]) +
    sumWantedCost(soul3Array, soul3SeasonArray, soulNodeStates[3]) +
    sumWantedCost(soul4Array, soul4SeasonArray, soulNodeStates[4]) +
    sumWantedCost(soul5Array, soul5SeasonArray, soulNodeStates[5]);

  const handlePageClick = () => setOpenMenu(null);

  const handleSoulNameClick = (soulIndex) => {
    setSelectedSoulIndex(soulIndex);
    setShowSoulModal(true);
  };

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

      <div className="total-info-container no-capture">
        <button
          className="total-info-btn"
          onClick={() => setShowTotalInfoModal(true)}
        >
          전체 노드표 보기
        </button>
      </div>

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
                  alt="영혼 1"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">점치는 현명한 노인</span>
              </div>
              <ArrayNodeView
                mainArray={soul1Array}
                seasonArray={soul1SeasonArray}
                nodeStates={soulNodeStates[1]}
                setNodeStates={(upd) => handleSetNodeStates(1, upd)}
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
                62 양초
              </div>
              <div className="candle-selected">
                선택한 양초:{" "}
                {sumWantedCost(
                  soul1Array,
                  soul1SeasonArray,
                  soulNodeStates[1]
                )}
                개
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
                  alt="영혼 2"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">분장한 꽃가루 사촌</span>
              </div>
              <ArrayNodeView
                mainArray={soul2Array}
                seasonArray={soul2SeasonArray}
                nodeStates={soulNodeStates[2]}
                setNodeStates={(upd) => handleSetNodeStates(2, upd)}
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
                97 양초
              </div>
              <div className="candle-selected">
                선택한 양초:{" "}
                {sumWantedCost(
                  soul2Array,
                  soul2SeasonArray,
                  soulNodeStates[2]
                )}
                개
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
                  alt="영혼 3"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">고귀한 쓰다듬는 청년</span>
              </div>
              <ArrayNodeView
                mainArray={soul3Array}
                seasonArray={soul3SeasonArray}
                nodeStates={soulNodeStates[3]}
                setNodeStates={(upd) => handleSetNodeStates(3, upd)}
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
                86 양초
              </div>
              <div className="candle-selected">
                선택한 양초:{" "}
                {sumWantedCost(
                  soul3Array,
                  soul3SeasonArray,
                  soulNodeStates[3]
                )}
                개
              </div>
            </div>

            {/* Soul 4 */}
            <div className="soul-col">
              <div
                className="soul-selector"
                onClick={() => handleSoulNameClick(4)}
              >
                <img
                  src="/sky/calculator/spirit4.webp"
                  alt="영혼 4"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">그리워하는 폭죽장이 부모</span>
              </div>
              <ArrayNodeView
                mainArray={soul4Array}
                seasonArray={soul4SeasonArray}
                nodeStates={soulNodeStates[4]}
                setNodeStates={(upd) => handleSetNodeStates(4, upd)}
                soulIndex={4}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
              <div className="candle-count">
                <img
                  src="/sky/calculator/candle.webp"
                  alt="Candle"
                  className="candle-icon"
                />
                68 양초
              </div>
              <div className="candle-selected">
                선택한 양초:{" "}
                {sumWantedCost(
                  soul4Array,
                  soul4SeasonArray,
                  soulNodeStates[4]
                )}
                개
              </div>
            </div>

            {/* Soul 5 */}
            <div className="soul-col">
              <div
                className="soul-selector"
                onClick={() => handleSoulNameClick(5)}
              >
                <img
                  src="/sky/calculator/spirit5.webp"
                  alt="영혼 5"
                  className="soul-selector-img"
                />
                <span className="soul-selector-text">나무베는 애원하는 부모</span>
              </div>
              <ArrayNodeView
                mainArray={soul5Array}
                seasonArray={soul5SeasonArray}
                nodeStates={soulNodeStates[5]}
                setNodeStates={(upd) => handleSetNodeStates(5, upd)}
                soulIndex={5}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
              <div className="candle-count">
                <img
                  src="/sky/calculator/candle.webp"
                  alt="Candle"
                  className="candle-icon"
                />
                71 양초
              </div>
              <div className="candle-selected">
                선택한 양초:{" "}
                {sumWantedCost(
                  soul5Array,
                  soul5SeasonArray,
                  soulNodeStates[5]
                )}
                개
              </div>
            </div>
          </div>
        </div>
        {/* <GuideSidebar onClick={() => setShowGuideModal(true)} /> */}
      </div>

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
                &lt;sky 네이버 카페&gt; 햇비님 - 파랑새의 시즌 가이드
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
              <h3 className="modal-title">
                &lt;sky 네이버 카페&gt; 햇비님 - 파랑새의 시즌 가이드
              </h3>
              <h3 className="modal-description">전체 노드표</h3>
            </div>
            <img
              src="/sky/calculator/info/totalinfo.png"
              alt="전체 노드표"
              style={{ width: "100%", maxWidth: "600px", margin: "auto" }}
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
                &lt;sky 네이버 카페&gt; 햇비님 - 파랑새의 시즌 가이드
              </h3>
              <h3 className="modal-description">시즌 안내자</h3>
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
