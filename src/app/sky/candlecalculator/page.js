"use client";
import React, { useState } from "react";
import "./CandleCalculator.css";
import { soul1Tree, soul2Tree, soul3Tree } from "./data/trees";
import NodeView from "./components/NodeView";

/** nodeStates에서 "want"인 노드 cost 합산 */
function sumWantedCost(node, nodeStates) {
  let sum = 0;
  if ((nodeStates[node.id] || "none") === "want") {
    sum += node.cost || 0;
  }
  if (node.seasonChild) {
    const scId = node.seasonChild.id;
    if ((nodeStates[scId] || "none") === "want") {
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
  const [nodeStates, setNodeStates] = useState({});

  const handleCalculate = () => {
    const c1 = sumWantedCost(soul1Tree, nodeStates);
    const c2 = sumWantedCost(soul2Tree, nodeStates);
    const c3 = sumWantedCost(soul3Tree, nodeStates);
    alert(`
      Soul1: ${c1} candles
      Soul2: ${c2} candles
      Soul3: ${c3} candles
      total = ${c1 + c2 + c3}
    `);
  };

  return (
    <div className="calc-container">
      <h1 className="calc-title">양초 계산기</h1>
      <p className="calc-desc">
        노드를 클릭하면 상태를 바꿀 수 있습니다. Have / Want 설정으로
        필요한 양초 수를 확인하세요.
      </p>

      <div className="souls-wrapper">
        {/* Soul 1 */}
        <div className="soul-col">
          <h2 className="soul-name">Soul 1</h2>
          <NodeView
            node={soul1Tree}
            nodeStates={nodeStates}
            setNodeStates={setNodeStates}
            soulIndex={1}
          />
        </div>
        {/* Soul 2 */}
        <div className="soul-col">
          <h2 className="soul-name">Soul 2</h2>
          <NodeView
            node={soul2Tree}
            nodeStates={nodeStates}
            setNodeStates={setNodeStates}
            soulIndex={2}
          />
        </div>
        {/* Soul 3 */}
        <div className="soul-col">
          <h2 className="soul-name">Soul 3</h2>
          <NodeView
            node={soul3Tree}
            nodeStates={nodeStates}
            setNodeStates={setNodeStates}
            soulIndex={3}
          />
        </div>
      </div>

      <div className="btn-row">
        <button className="calc-btn" onClick={handleCalculate}>
          Calculate
        </button>
      </div>
    </div>
  );
}
