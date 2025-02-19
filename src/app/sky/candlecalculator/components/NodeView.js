"use client";
import React from "react";
import "./NodeView.css";

/** 
 * nodeStates: { nodeId: "none"|"have"|"want"|... }
 * setNodeStates: 상태 업데이트
 * 
 * ancestors: 이 노드의 '조상 노드 id' 목록 (아래->위 순서)
 *   -> 상위 컴포넌트에서 넘길 수도 있고, 재귀적으로 쌓아갈 수도 있음
*/
export default function NodeView({
  node,
  nodeStates,
  setNodeStates,
  ancestors = [], // 기본값
}) {
  // 현재 노드 상태
  const mainState = nodeStates[node.id] || "none";
  // 시즌패스 상태 (있다면)
  const seasonId = node.seasonChild?.id;
  const seasonState = seasonId ? (nodeStates[seasonId] || "none") : null;

  // 자식들(위쪽 노드들) 렌더
  const children = node.children || [];

  // 특정 노드의 상태를 설정하면서 조상들도 동기화
  const handleSetState = (nodeId, newState) => {
    setNodeStates((prev) => {
      const updated = { ...prev, [nodeId]: newState };

      // 만약 newState가 "want"나 "have"면, 모든 조상 중 "none"인 것들을 같은 상태로 바꾼다 (예시)
      if (newState === "want" || newState === "have") {
        ancestors.forEach((ancId) => {
          const prevSt = updated[ancId] || "none";
          // 여기서는 단순히 none이면 덮어쓴다
          // (이미 have인 걸 want로 덮어쓸지 여부는 필요에 따라 변경)
          if (prevSt === "none") {
            updated[ancId] = newState;
          }
        });
      }
      return updated;
    });
  };

  // 시즌패스 노드를 선택시에도 같은 로직
  const handleSetSeasonState = (seasonId, newState) => {
    setNodeStates((prev) => {
      const updated = { ...prev, [seasonId]: newState };
      // 조상 처리도 동일하게 (seasonChild와 본체는 같은 조상공유)
      if (newState === "want" || newState === "have") {
        ancestors.forEach((ancId) => {
          if ((updated[ancId] || "none") === "none") {
            updated[ancId] = newState;
          }
        });
      }
      return updated;
    });
  };

  return (
    <div className="nodeview-container">
      {/* 자식 먼저 -> 화면상 위쪽 */}
      {children.length > 0 && (
        <div className="children-wrapper">
          {children.map((child) => (
            <NodeView
              key={child.id}
              node={child}
              nodeStates={nodeStates}
              setNodeStates={setNodeStates}
              // 조상 목록: 자신 + 기존조상
              ancestors={[node.id, ...ancestors]}
            />
          ))}
        </div>
      )}

      {/* 이 노드 (화면에서 '아래쪽') */}
      <div className="node-row">
        {/* 본 노드를 왼쪽에 배치 */}
        <div className="main-node-box">
          <div className="node-info">
            <span className="node-name">{node.name}</span>
            <span className="node-cost">(cost: {node.cost})</span>
            <span className="node-current">{mainState.toUpperCase()}</span>
          </div>
          <div className="node-buttons">
            <button
              className="btn btn-have"
              onClick={() => handleSetState(node.id, "have")}
            >
              Have
            </button>
            <button
              className="btn btn-want"
              onClick={() => handleSetState(node.id, "want")}
            >
              Want
            </button>
            <button
              className="btn btn-none"
              onClick={() => handleSetState(node.id, "none")}
            >
              None
            </button>
          </div>
        </div>

        {/* 시즌패스 노드는 오른쪽에 배치 */}
        {seasonId && (
          <div className="season-node-box">
            <div className="node-info">
              <span className="node-name">{node.seasonChild.name}</span>
              <span className="node-cost">(cost: {node.seasonChild.cost})</span>
              <span className="node-current">{seasonState.toUpperCase()}</span>
            </div>
            <div className="node-buttons">
              <button
                className="btn btn-have"
                onClick={() => handleSetSeasonState(seasonId, "have")}
              >
                Have
              </button>
              <button
                className="btn btn-want"
                onClick={() => handleSetSeasonState(seasonId, "want")}
              >
                Want
              </button>
              <button
                className="btn btn-none"
                onClick={() => handleSetSeasonState(seasonId, "none")}
              >
                None
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
