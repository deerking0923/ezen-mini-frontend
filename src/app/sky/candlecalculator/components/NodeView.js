"use client";
import React from "react";
import "./NodeView.css";

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
  const seasonState = seasonId ? nodeStates[seasonId] || "none" : "none";

  // 자식들
  const children = node.children || [];

  // 이미지 경로
  const nodeNum = parseInt(node.id.replace("node", ""), 10);
  const mainImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}.webp`;
  let childImageSrc = "";
  if (seasonId) {
    childImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}_child.webp`;
  }

  // 전체 선택 및 초기화용: 재귀적으로 하위 노드들을 업데이트하는 함수
  const updateAllNodes = (currentNode, newState, updated) => {
    updated[currentNode.id] = newState;
    if (currentNode.seasonChild) {
      updated[currentNode.seasonChild.id] = newState;
    }
    if (currentNode.children && currentNode.children.length > 0) {
      currentNode.children.forEach((child) => {
        updateAllNodes(child, newState, updated);
      });
    }
  };

  // 해제 시 have 상태인 노드만 업데이트하는 재귀 함수
  const updateDescendants = (currentNode, newState, updated, prevStates) => {
    if (currentNode.seasonChild && prevStates[currentNode.seasonChild.id] === "have") {
      updated[currentNode.seasonChild.id] = newState;
    }
    if (currentNode.children && currentNode.children.length > 0) {
      currentNode.children.forEach((child) => {
        if (prevStates[child.id] === "have") {
          updated[child.id] = newState;
        }
        updateDescendants(child, newState, updated, prevStates);
      });
    }
  };

  const handleSetState = (nodeId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[nodeId] || "none";
      // 토글: 기존 상태와 같으면 "none", 아니면 newState 적용
      const realNewState = oldState === newState ? "none" : newState;
      let updated = { ...prev, [nodeId]: realNewState };

      if (realNewState !== "none") {
        // have 상태일 때에만 조상(ancestors) 업데이트
        if (newState === "have") {
          ancestors.forEach((ancId) => {
            updated[ancId] = realNewState;
          });
        }
      } else {
        // 해제("none") 시, 이전 상태가 have였던 경우에만 하위 노드들 중 have 상태인 것만 해제
        if (oldState === "have") {
          updateDescendants(node, "none", updated, prev);
        }
      }
      return updated;
    });
  };

  const handleSetSeasonState = (seasonId, newState) => {
    setNodeStates((prev) => {
      const oldState = prev[seasonId] || "none";
      const realNewState = oldState === newState ? "none" : newState;
      let updated = { ...prev, [seasonId]: realNewState };

      if (realNewState !== "none") {
        if (newState === "have") {
          // 시즌패스 선택 시: 현재 노드(부모)와 대응하는 시즌패스, 그리고 조상 업데이트
          updated[node.id] = realNewState;
          const parentSeasonId = node.id.replace("node", "child");
          updated[parentSeasonId] = realNewState;
          ancestors.forEach((ancId) => {
            updated[ancId] = realNewState;
            const ancSeasonId = ancId.replace("node", "child");
            updated[ancSeasonId] = realNewState;
          });
        }
        // want의 경우에는 추가 전파 없음
      } else {
        // 해제("none") 시, 이전 상태가 have였던 경우에만 하위 노드들 중 have 상태인 것만 해제
        if (oldState === "have") {
          updateDescendants(node, "none", updated, prev);
        }
      }
      return updated;
    });
  };

  // 전체 선택 버튼 클릭 시 호출: 이미 선택되어 있으면 초기화("none"), 아니면 전체 선택
  const handleGlobalSelect = (newState) => {
    // 최상위 노드의 상태가 이미 newState이면 초기화("none") 처리
    const rootState = nodeStates[node.id] || "none";
    const targetState = rootState === newState ? "none" : newState;
    const updated = {};
    updateAllNodes(node, targetState, updated);
    setNodeStates(updated);
  };

  // 메인 이미지 클릭 -> openMenu 설정
  const handleMainImageClick = (e) => {
    e.stopPropagation();
    const isOpen =
      openMenu &&
      openMenu.soulIndex === soulIndex &&
      openMenu.nodeId === node.id;
    if (isOpen) {
      setOpenMenu(null);
    } else {
      setOpenMenu({ soulIndex, nodeId: node.id });
    }
  };

  // 시즌패스 이미지 클릭
  const handleChildImageClick = (e) => {
    e.stopPropagation();
    if (!seasonId) return;
    const isOpen =
      openMenu &&
      openMenu.soulIndex === soulIndex &&
      openMenu.nodeId === seasonId;
    if (isOpen) {
      setOpenMenu(null);
    } else {
      setOpenMenu({ soulIndex, nodeId: seasonId });
    }
  };

  const getBorderColor = (st) => {
    if (st === "have") return "3px solid rgb(0, 98, 255)";
    if (st === "want") return "3px solid rgb(255, 218, 83)";
    return "3px solid transparent";
  };

  // 현재 노드의 메뉴가 열려있는지
  const isMainMenuOpen =
    openMenu && openMenu.soulIndex === soulIndex && openMenu.nodeId === node.id;
  const isChildMenuOpen =
    openMenu &&
    openMenu.soulIndex === soulIndex &&
    seasonId &&
    openMenu.nodeId === seasonId;

  return (
    <div>
      {/* 최상위 노드에서만 전체 선택 버튼 렌더링 */}
      {ancestors.length === 0 && (
        <div className="global-select-buttons" style={{ marginBottom: "10px" }}>
          <button onClick={() => handleGlobalSelect("have")}>
            있음!
          </button>
          <button onClick={() => handleGlobalSelect("want")}>
            원함!
          </button>
        </div>
      )}

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
            <div className="cost-badge">{node.cost}</div>
            {node.id === "node8" && (
              <div className="season-icon-badge">
                <img
                  src="/sky/calculator/season_icon.webp"
                  alt="Season"
                  className="season-icon"
                />
              </div>
            )}

            {/* "Have / Want" 메뉴(메인 노드) */}
            {isMainMenuOpen && (
              <div className="menu-overlay">
                <button
                  className="menu-btn menu-btn-have"
                  onClick={() => handleSetState(node.id, "have")}
                >
                  있음
                </button>
                <button
                  className="menu-btn menu-btn-want"
                  onClick={() => handleSetState(node.id, "want")}
                >
                  원함
                </button>
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
                  <button
                    className="menu-btn menu-btn-have"
                    onClick={() => handleSetSeasonState(seasonId, "have")}
                  >
                    있음
                  </button>
                  <button
                    className="menu-btn menu-btn-want"
                    onClick={() => handleSetSeasonState(seasonId, "want")}
                  >
                    원함
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
