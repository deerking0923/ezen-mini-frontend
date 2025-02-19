"use client";
import React from "react";
import "./NodeView.css";

/**
 * props:
 * - node: { id, name, cost, seasonChild, children[] }
 * - nodeStates: Record<string, "none"|"have"|"want">
 * - setNodeStates: function(newState => newState)
 * - ancestors: 조상 노드 ID 배열
 * - soulIndex: 1 | 2 | 3 (이미지 경로 구분)
 * - openMenuId: 현재 열려있는 선택창 대상의 ID (null이면 없음)
 * - setOpenMenuId: (id or null) => void
 */
export default function NodeView({
  node,
  nodeStates,
  setNodeStates,
  ancestors = [],
  soulIndex = 1,
  openMenuId,
  setOpenMenuId,
}) {
  // 메인 노드 상태
  const mainState = nodeStates[node.id] || "none";

  // 시즌패스 노드가 있는지?
  const seasonId = node.seasonChild?.id;
  const seasonState = seasonId ? (nodeStates[seasonId] || "none") : "none";

  // 자식들
  const children = node.children || [];

  // 이미지 경로: node.id = "node1" → 1 추출
  const nodeNum = parseInt(node.id.replace("node", ""), 10);
  // /sky/calculator/spirit1_item1.webp
  const mainImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}.webp`;

  // 시즌패스 이미지
  let childImageSrc = "";
  if (seasonId) {
    childImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}_child.webp`;
  }

  // 노드 상태 변경
  const handleSetState = (nodeId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[nodeId] || "none";
      const isSame = (oldState === newState);
      // 같으면 'none'으로 토글
      const realNewState = isSame ? "none" : newState;

      const updated = { ...prev, [nodeId]: realNewState };

      // 만약 have/want라면 조상 중 "none"을 덮어씀
      if (realNewState === "have" || realNewState === "want") {
        ancestors.forEach((ancId) => {
          if ((updated[ancId] || "none") === "none") {
            updated[ancId] = realNewState;
          }
        });
      }
      return updated;
    });
  };

  // 이미지를 클릭하면 openMenuId를 설정해서 메뉴를 열거나 닫는다
  const handleMainImageClick = () => {
    if (openMenuId === node.id) {
      // 이미 열려있으면 닫기
      setOpenMenuId(null);
    } else {
      // 다른 메뉴가 열려있어도 닫고 새로 열기
      setOpenMenuId(node.id);
    }
  };

  const handleChildImageClick = () => {
    if (!seasonId) return;
    if (openMenuId === seasonId) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(seasonId);
    }
  };

  // 시즌패스 상태 변경
  const handleSetSeasonState = (seasonId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[seasonId] || "none";
      const isSame = (oldState === newState);
      const realNewState = isSame ? "none" : newState;

      const updated = { ...prev, [seasonId]: realNewState };

      if (realNewState === "have" || realNewState === "want") {
        ancestors.forEach((ancId) => {
          if ((updated[ancId] || "none") === "none") {
            updated[ancId] = realNewState;
          }
        });
      }
      return updated;
    });
  };

  // 상태별 테두리
  const getBorderColor = (st) => {
    if (st === "have") return "2px solid green";
    if (st === "want") return "2px solid gold";
    return "2px solid transparent";
  };

  // 현재 노드 / 자식 노드 각각의 메뉴가 열려있는지
  const isMainMenuOpen = (openMenuId === node.id);
  const isChildMenuOpen = (seasonId && openMenuId === seasonId);

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
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          ))}
        </div>
      )}

      {/* 현재 노드 (아래) */}
      <div className="node-row">
        {/* 메인 노드 이미지 */}
        <div className="node-image-box">
          <img
            src={mainImageSrc}
            alt={node.name}
            className="node-image"
            style={{ border: getBorderColor(mainState) }}
            onClick={handleMainImageClick}
          />
          {/* 비용 표시 */}
          <div className="cost-badge">{node.cost}</div>

          {/* "Have / Want" 메뉴 (메인) */}
          {isMainMenuOpen && (
            <div className="menu-overlay">
              <button onClick={() => handleSetState(node.id, "have")}>Have</button>
              <button onClick={() => handleSetState(node.id, "want")}>Want</button>
            </div>
          )}
        </div>

        {/* 시즌패스 노드가 있다면 */}
        {seasonId && (
          <div className="node-image-box">
            <img
              src={childImageSrc}
              alt={node.seasonChild.name}
              className="node-image"
              style={{ border: getBorderColor(seasonState) }}
              onClick={handleChildImageClick}
            />
            {/* 비용 대신 시즌 아이콘 표시 */}
            <div className="season-badge">
              <img
                src="/sky/calculator/season_icon.webp"
                alt="Season"
                className="season-icon"
              />
            </div>

            {/* "Have / Want" 메뉴 (시즌패스) */}
            {isChildMenuOpen && (
              <div className="menu-overlay">
                <button onClick={() => handleSetSeasonState(seasonId, "have")}>Have</button>
                <button onClick={() => handleSetSeasonState(seasonId, "want")}>Want</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
