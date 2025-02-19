"use client";
import React, { useState } from "react";
import "./NodeView.css";

/**
 * props:
 * - node: { id, name, cost, seasonChild, children[] }
 * - nodeStates: Record<string, "none"|"have"|"want">
 * - setNodeStates: function
 * - ancestors: 조상 노드 ID 배열 (상위->하위 호출 시 주입)
 * - soulIndex: 몇 번째 영혼인지 (1,2,3)에 따라 이미지 경로 자동 결정
 */
export default function NodeView({
  node,
  nodeStates,
  setNodeStates,
  ancestors = [],
  soulIndex = 1, // default
}) {
  // 현재 노드 상태
  const mainState = nodeStates[node.id] || "none";
  // 시즌패스 노드 상태
  const seasonId = node.seasonChild?.id;
  const seasonState = seasonId ? (nodeStates[seasonId] || "none") : "none";

  // 자식들(위쪽 노드들)
  const children = node.children || [];

  // 이미지 경로: node.id = "node1" → 1 추출
  const nodeNum = parseInt(node.id.replace("node", ""), 10);
  // 예) /sky/calculator/spirit1_item1.webp
  const mainImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}.webp`;
  // 자식 이미지 (있다면)
  let childImageSrc = "";
  if (seasonId) {
    childImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}_child.webp`;
  }

  // 이미지 클릭 시 나오는 버튼 표시 여부
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showChildMenu, setShowChildMenu] = useState(false);

  // 노드 상태 변경 (이전 코드 재활용하되 "같은 상태면 none으로" 토글 추가)
  const handleSetState = (nodeId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[nodeId] || "none";
      const isSame = oldState === newState;

      // 같으면 'none'으로 돌리기
      const realNewState = isSame ? "none" : newState;

      const updated = { ...prev, [nodeId]: realNewState };

      // 만약 have/want라면, 조상 중 "none"을 전부 동일 상태로
      if (realNewState === "want" || realNewState === "have") {
        ancestors.forEach((ancId) => {
          if ((updated[ancId] || "none") === "none") {
            updated[ancId] = realNewState;
          }
        });
      }
      return updated;
    });
  };

  // 자식 노드 시즌패스도 동일한 로직
  const handleSetSeasonState = (seasonId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[seasonId] || "none";
      const isSame = oldState === newState;
      const realNewState = isSame ? "none" : newState;

      const updated = { ...prev, [seasonId]: realNewState };

      if (realNewState === "want" || realNewState === "have") {
        ancestors.forEach((ancId) => {
          if ((updated[ancId] || "none") === "none") {
            updated[ancId] = realNewState;
          }
        });
      }
      return updated;
    });
  };

  // 메인 노드 이미지 클릭 → 메뉴 토글
  const handleMainImageClick = () => {
    setShowMainMenu((prev) => !prev);
    // 자식 메뉴는 닫기
    setShowChildMenu(false);
  };
  // 자식 노드 이미지 클릭 → 메뉴 토글
  const handleChildImageClick = () => {
    setShowChildMenu((prev) => !prev);
    // 메인 메뉴는 닫기
    setShowMainMenu(false);
  };

  // 상태에 따라 테두리색 결정
  const getBorderColor = (st) => {
    if (st === "have") return "2px solid green";
    if (st === "want") return "2px solid gold";
    return "2px solid transparent";
  };

  return (
    <div className="nodeview-container">
      {/* 자식(위쪽) */}
      {children.length > 0 && (
        <div className="children-wrapper">
          {children.map((child) => (
            <NodeView
              key={child.id}
              node={child}
              nodeStates={nodeStates}
              setNodeStates={setNodeStates}
              ancestors={[node.id, ...ancestors]}
              soulIndex={soulIndex}
            />
          ))}
        </div>
      )}

      {/* 이 노드 (아래쪽) */}
      <div className="node-row">
        {/* 메인 노드 */}
        <div className="node-image-box">
          <img
            src={mainImageSrc}
            alt={node.name}
            className="node-image"
            style={{ border: getBorderColor(mainState) }}
            onClick={handleMainImageClick}
          />
          {/* 오른쪽 하단 cost 표시 */}
          <div className="cost-badge">{node.cost}</div>

          {/* 클릭하면 뜨는 메뉴 */}
          {showMainMenu && (
            <div className="menu-overlay">
              <button onClick={() => handleSetState(node.id, "have")}>
                Have
              </button>
              <button onClick={() => handleSetState(node.id, "want")}>
                Want
              </button>
            </div>
          )}
        </div>

        {/* 시즌패스 노드 */}
        {seasonId && (
          <div className="node-image-box">
            <img
              src={childImageSrc}
              alt={node.seasonChild.name}
              className="node-image"
              style={{ border: getBorderColor(seasonState) }}
              onClick={handleChildImageClick}
            />
            {/* 오른쪽 하단 cost 표시 */}
            <div className="cost-badge">{node.seasonChild.cost}</div>

            {/* 클릭하면 뜨는 메뉴 */}
            {showChildMenu && (
              <div className="menu-overlay">
                <button onClick={() => handleSetSeasonState(seasonId, "have")}>
                  Have
                </button>
                <button onClick={() => handleSetSeasonState(seasonId, "want")}>
                  Want
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
