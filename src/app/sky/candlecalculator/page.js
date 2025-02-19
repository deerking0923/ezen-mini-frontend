"use client";

import React, { useState } from "react";
import "./CandleCalculator.css";
import { soul1Tree, soul2Tree, soul3Tree } from "./data/trees";
import NodeView from "./components/NodeView";

/** nodeStates에서 "want"인 노드 cost 합산 */
function sumWantedCost(node, nodeStates) {
  let sum = 0;
  const mainSt = nodeStates[node.id] || "none";
  if (mainSt === "want") {
    sum += node.cost || 0;
  }
  if (node.seasonChild) {
    const scId = node.seasonChild.id;
    const scSt = nodeStates[scId] || "none";
    if (scSt === "want") {
      sum += node.seasonChild.cost || 0;
    }
  }
  if (node.children) {
    for (let c of node.children) {
      sum += sumWantedCost(c, nodeStates);
    }
  }
  return sum;
}

export default function CandleCalculatorPage() {
  // 영혼별 nodeStates를 분리해서 관리
  const [soulNodeStates, setSoulNodeStates] = useState({
    1: {}, // 팔짝 뛰는 무용수
    2: {}, // 도발하는 곡예사
    3: {}, // 인사하는 주술사
  });

  // 현재 열려 있는 메뉴: { soulIndex, nodeId } 또는 null
  const [openMenu, setOpenMenu] = useState(null);

  // nodeStates를 세팅하는 함수 (특정 영혼의 상태만 업데이트)
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

  // “Calculate” 버튼 → 각 영혼별 want 합산
  const handleCalculate = () => {
    const c1 = sumWantedCost(soul1Tree, soulNodeStates[1]);
    const c2 = sumWantedCost(soul2Tree, soulNodeStates[2]);
    const c3 = sumWantedCost(soul3Tree, soulNodeStates[3]);
    alert(`
      팔짝 뛰는 무용수: ${c1} candles
      도발하는 곡예사: ${c2} candles
      인사하는 주술사: ${c3} candles
      total = ${c1 + c2 + c3}
    `);
  };

  // 빈 화면 클릭 시 메뉴 닫기
  const handlePageClick = () => {
    setOpenMenu(null);
  };

  return (
    <div className="calc-container" onClick={handlePageClick}>
      <h1 className="calc-title">양초 계산기</h1>
      <div className="main-content">
        {/* 왼쪽: 영혼 선택 영역 */}
        <div className="soul-sidebar" onClick={(e) => e.stopPropagation()}>
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

        {/* 중앙: 노드 영역 */}
        <div className="nodes-container">
          <div className="souls-wrapper">
            {/* Soul 1 */}
            <div className="soul-col" onClick={(e) => e.stopPropagation()}>
              <h2 className="soul-name">팔짝 뛰는 무용수</h2>
              <NodeView
                node={soul1Tree}
                nodeStates={soulNodeStates[1]}
                setNodeStates={(updater) => handleSetNodeStates(1, updater)}
                soulIndex={1}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            </div>
            {/* Soul 2 */}
            <div className="soul-col" onClick={(e) => e.stopPropagation()}>
              <h2 className="soul-name">도발하는 곡예사</h2>
              <NodeView
                node={soul2Tree}
                nodeStates={soulNodeStates[2]}
                setNodeStates={(updater) => handleSetNodeStates(2, updater)}
                soulIndex={2}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            </div>
            {/* Soul 3 */}
            <div className="soul-col" onClick={(e) => e.stopPropagation()}>
              <h2 className="soul-name">인사하는 주술사</h2>
              <NodeView
                node={soul3Tree}
                nodeStates={soulNodeStates[3]}
                setNodeStates={(updater) => handleSetNodeStates(3, updater)}
                soulIndex={3}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
              />
            </div>
          </div>

          <div className="btn-row">
            <button className="calc-btn" onClick={handleCalculate}>
              Calculate
            </button>
          </div>
        </div>

        {/* 오른쪽: 시즌 가이드 영역 */}
        <div className="guide-sidebar" onClick={(e) => e.stopPropagation()}>
          <div className="guide-box">
            <img
              src="/sky/calculator/guide.webp"
              alt="시즌 가이드"
              className="guide-photo"
            />
            <div className="guide-items">
              <div className="guide-item">
                <img
                  src="/sky/calculator/guide_item1.webp"
                  alt="아이템 1"
                  className="guide-item-photo"
                />
                <div className="guide-item-cost">
                  <img
                    src="/sky/calculator/heart.webp"
                    alt="heart"
                    className="heart-icon"
                  />
                  <span>1</span>
                </div>
              </div>
              <div className="guide-item">
                <img
                  src="/sky/calculator/guide_item2.webp"
                  alt="아이템 2"
                  className="guide-item-photo"
                />
                <div className="guide-item-cost">
                  <img
                    src="/sky/calculator/heart.webp"
                    alt="heart"
                    className="heart-icon"
                  />
                  <span>2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
