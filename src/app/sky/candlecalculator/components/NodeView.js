"use client";
import React from "react";
import "./NodeView.css";

/**
 * props:
 * - node: { id, name, cost, seasonChild, children[] }
 * - nodeStates: Record<string, "none"|"have"|"want"> (해당 Soul의 상태)
 * - setNodeStates: function(updater => newState) (해당 Soul만 업데이트)
 * - ancestors: 조상 노드 ID 배열
 * - soulIndex: 1 | 2 | 3 (이미지 경로 구분)
 * - openMenu: { soulIndex, nodeId } | null
 * - setOpenMenu: (obj or null) => void
 */
export default function NodeView({
  node,
  nodeStates,
  setNodeStates,
  ancestors = [],
  soulIndex = 1,
  openMenu,
  setOpenMenu,
}) {
  // 메인 노드 상태
  const mainState = nodeStates[node.id] || "none";

  // 시즌패스 노드 상태
  const seasonId = node.seasonChild?.id || null;
  const seasonState = seasonId ? (nodeStates[seasonId] || "none") : "none";

  // 자식들
  const children = node.children || [];

  // 이미지 경로
  const nodeNum = parseInt(node.id.replace("node", ""), 10);
  const mainImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}.webp`;
  let childImageSrc = "";
  if (seasonId) {
    childImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}_child.webp`;
  }

  // 노드 상태 변경
  const handleSetState = (nodeId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[nodeId] || "none";
      // 같은 상태면 'none'으로 토글
      const realNewState = (oldState === newState) ? "none" : newState;

      const updated = { ...prev, [nodeId]: realNewState };
      // 만약 have/want라면, 조상 중 none을 덮어씀
      if (realNewState === "have" || realNewState === "want") {
        ancestors.forEach((ancId) => {
          const ancSt = updated[ancId] || "none";
          if (ancSt === "none") {
            updated[ancId] = realNewState;
          }
        });
      }
      return updated;
    });
  };

  // 메인 이미지 클릭 -> openMenu 설정
  const handleMainImageClick = (e) => {
    e.stopPropagation(); // 부모 onClick에 잡히지 않게
    const isOpen = (openMenu && openMenu.soulIndex === soulIndex && openMenu.nodeId === node.id);
    if (isOpen) {
      // 이미 열려있으면 닫기
      setOpenMenu(null);
    } else {
      // 새로 열기(다른 메뉴가 열려있으면 닫히고, 이거 열림)
      setOpenMenu({ soulIndex, nodeId: node.id });
    }
  };

  // 시즌패스 이미지 클릭
  const handleChildImageClick = (e) => {
    e.stopPropagation();
    if (!seasonId) return;
    const isOpen = (openMenu && openMenu.soulIndex === soulIndex && openMenu.nodeId === seasonId);
    if (isOpen) {
      setOpenMenu(null);
    } else {
      setOpenMenu({ soulIndex, nodeId: seasonId });
    }
  };

  // 시즌패스 상태 변경
  const handleSetSeasonState = (seasonId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[seasonId] || "none";
      const realNewState = (oldState === newState) ? "none" : newState;

      const updated = { ...prev, [seasonId]: realNewState };
      if (realNewState === "have" || realNewState === "want") {
        ancestors.forEach((ancId) => {
          const ancSt = updated[ancId] || "none";
          if (ancSt === "none") {
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

  // 현재 노드의 메뉴가 열려있는지
  const isMainMenuOpen = (
    openMenu &&
    openMenu.soulIndex === soulIndex &&
    openMenu.nodeId === node.id
  );
  // 시즌패스
  const isChildMenuOpen = (
    openMenu &&
    openMenu.soulIndex === soulIndex &&
    seasonId &&
    openMenu.nodeId === seasonId
  );

  return (
    <div className="nodeview-container">
      {/* 자식(위) */}
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
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          ))}
        </div>
      )}

      {/* 현재 노드(아래) */}
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

          {/* "Have / Want" 메뉴(메인 노드) */}
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
            {/* 비용 대신 시즌 아이콘 */}
            <div className="season-badge">
              <img
                src="/sky/calculator/season_icon.webp"
                alt="Season"
                className="season-icon"
              />
            </div>

            {/* "Have / Want" 메뉴(시즌패스) */}
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
