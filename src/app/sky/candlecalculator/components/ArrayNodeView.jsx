"use client";
import React from "react";
import "./NodeView.css";

/**
 * 예: mainArray[0] = node1, mainArray[1] = node2 ... mainArray[7] = node8
 *      화면에서는 node8이 위로 보이게 하고 싶을 때, .reverse() 해서 렌더
 */
export default function ArrayNodeView({
  mainArray,
  seasonArray,
  nodeStates,
  setNodeStates,
  soulIndex,
  openMenu,
  setOpenMenu,
}) {
  // 전체 노드를 한꺼번에 업데이트 (전체 선택 버튼)
  const updateAllNodes = (newState) => {
    const updated = {};
    mainArray.forEach((n) => {
      updated[n.id] = newState;
    });
    seasonArray.forEach((sn) => {
      if (sn) {
        updated[sn.id] = newState;
      }
    });
    setNodeStates(updated);
  };

  // 전체 선택 버튼 클릭: node1(인덱스0)이 루트 논리라면,
  // 그걸 사용해 중복 클릭시 해제 등의 로직을 유지.
  const handleGlobalSelect = (newState) => {
    // '루트'라 할 만한 건 보통 node1 → index=0
    const rootId = mainArray[0].id; // node1
    const rootState = nodeStates[rootId] || "none";

    const targetState = rootState === newState ? "none" : newState;
    updateAllNodes(targetState);
  };

  // 조상에게 have 전파 (index-1, index-2...) - 원본 로직 기준
  const applyAncestors = (index, updated) => {
    // 예: node4가 index=3이면, index=2,1,0이 조상 (node3,node2,node1)
    for (let i = index - 1; i >= 0; i--) {
      const m = mainArray[i];
      updated[m.id] = "have";
      const s = seasonArray[i];
      if (s) updated[s.id] = "have";
    }
  };

// 기존 removeDescendants 함수를 아래와 같이 수정하세요.
const removeDescendants = (index, prevStates, updated) => {
    for (let i = index + 1; i < mainArray.length; i++) {
      const m = mainArray[i];
      updated[m.id] = "none"; // 조건 없이 모두 해제
      const s = seasonArray[i];
      if (s) {
        updated[s.id] = "none";
      }
    }
  };
  

  const handleSetMainState = (index, newState) => {
    const nodeId = mainArray[index].id;
    setNodeStates((prev) => {
      const oldState = prev[nodeId] || "none";
      const realNewState = oldState === newState ? "none" : newState;
      let updated = { ...prev, [nodeId]: realNewState };
  
      // 현재 메인 노드에 해당하는 시즌 노드 (있는 경우)
      const currentSeason = seasonArray[index];
  
      if (realNewState !== "none") {
        // have 상태이면 조상(위쪽 메인 노드들)을 전파
        if (realNewState === "have") {
          applyAncestors(index, updated);
        } else if (realNewState === "want") {
          // want 상태 전파: 조상 중 이미 have가 있으면 중단하고, 나머지 메인 노드들만 업데이트
          for (let i = index - 1; i >= 0; i--) {
            const ancMainId = mainArray[i].id;
            if ((prev[ancMainId] || "none") === "have") break;
            updated[ancMainId] = "want";
          }
        }
      } else {
        // 해제("none") 시: 클릭한 메인 노드의 시즌 노드도 해제
        if (currentSeason) {
          updated[currentSeason.id] = "none";
        }
        // 그리고 클릭한 메인 노드보다 아래(원본 배열 기준 index+1 이후)에 있는 모든 메인 및 시즌 노드를 해제
        if (oldState === "have") {
          removeDescendants(index, prev, updated);
        }
      }
      return updated;
    });
  };
  
  
  
  // 시즌 노드 state 토글
  const handleSetSeasonState = (index, newState) => {
    const sn = seasonArray[index];
    if (!sn) return;

    const seasonId = sn.id;
    setNodeStates((prev) => {
      const oldState = prev[seasonId] || "none";
      const realNewState = oldState === newState ? "none" : newState;

      let updated = { ...prev, [seasonId]: realNewState };
      if (realNewState !== "none") {
        if (realNewState === "have") {
          // 메인 노드도 have
          const mainId = mainArray[index].id;
          updated[mainId] = "have";
          // 조상도 have
          applyAncestors(index, updated);
        }
      } else {
        if (oldState === "have") {
          removeDescendants(index, prev, updated);
        }
      }
      return updated;
    });
  };

  // 메뉴 열기/닫기
  const toggleMenu = (id) => {
    const isOpen = openMenu && openMenu.soulIndex === soulIndex && openMenu.nodeId === id;
    if (isOpen) {
      setOpenMenu(null);
    } else {
      setOpenMenu({ soulIndex, nodeId: id });
    }
  };

  const getBorderColor = (st) => {
    if (st === "have") return "3px solid rgb(0, 98, 255)";
    if (st === "want") return "3px solid rgb(255, 218, 83)";
    return "3px solid transparent";
  };

  // -----------------------------------------
  // 핵심: 실제 데이터는 [node1, node2, ..., node8] 순서로 되어 있지만,
  //       .slice().reverse()로 렌더링만 뒤집는다.
  //       역순 배열을 돌 때는 인덱스가 0부터 시작하므로,
  //       실제 "원본" 인덱스 = (전체길이-1 - i)
  // -----------------------------------------
  const reversedArray = [...mainArray]
    .map((node, idx) => ({ node, idx })) // {node: {...}, idx: 0..7}
    .reverse(); // 이제 화면 표시상 node8이 맨 앞, node1이 맨 뒤

  return (
    <div className="nodeview-array-container">
      {/* 전체 선택 버튼 */}
      <div className="global-select-buttons" style={{ marginBottom: "10px" }}>
        <button onClick={() => handleGlobalSelect("have")}>있음!</button>
        <button onClick={() => handleGlobalSelect("want")}>원함!</button>
      </div>

      {reversedArray.map((item, displayIndex) => {
        // displayIndex: 0부터 (node8) ~
        // item.idx: 원래 배열에서의 인덱스
        const realIndex = item.idx; // 실제 로직에서 사용하는 인덱스
        const node = item.node;

        const mainState = nodeStates[node.id] || "none";
        const seasonNode = seasonArray[realIndex];
        const seasonState = seasonNode ? nodeStates[seasonNode.id] || "none" : "none";

        const nodeNum = parseInt(node.id.replace("node", ""), 10);
        const mainImageSrc = `/sky/calculator/spirit${soulIndex}_item${nodeNum}.webp`;
        const childImageSrc = seasonNode
          ? `/sky/calculator/spirit${soulIndex}_item${nodeNum}_child.webp`
          : null;

        const isMainMenuOpen =
          openMenu && openMenu.soulIndex === soulIndex && openMenu.nodeId === node.id;
        const isChildMenuOpen =
          openMenu && seasonNode && openMenu.soulIndex === soulIndex && openMenu.nodeId === seasonNode.id;

        return (
          <div key={node.id} className="node-row" style={{ marginBottom: "20px" }}>
            {/* 메인 노드 */}
            <div className="node-image-box" onClick={(e) => e.stopPropagation()}>
              <img
                src={mainImageSrc}
                alt={node.name}
                className="node-image"
                style={{ border: getBorderColor(mainState) }}
                onClick={() => toggleMenu(node.id)}
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
              {/* 메뉴 */}
              {isMainMenuOpen && (
                <div className="menu-overlay">
                  <button
                    className="menu-btn menu-btn-have"
                    onClick={() => handleSetMainState(realIndex, "have")}
                  >
                    있음
                  </button>
                  <button
                    className="menu-btn menu-btn-want"
                    onClick={() => handleSetMainState(realIndex, "want")}
                  >
                    원함
                  </button>
                </div>
              )}
            </div>

            {/* 시즌 노드 */}
            {seasonNode && (
              <div className="node-image-box" onClick={(e) => e.stopPropagation()}>
                <img
                  src={childImageSrc || ""}
                  alt={seasonNode.name}
                  className="node-image"
                  style={{ border: getBorderColor(seasonState) }}
                  onClick={() => toggleMenu(seasonNode.id)}
                />
                <div className="season-badge">
                  <img
                    src="/sky/calculator/season_icon.webp"
                    alt="Season"
                    className="season-icon"
                  />
                </div>
                {/* 시즌 메뉴 */}
                {isChildMenuOpen && (
                  <div className="menu-overlay">
                    <button
                      className="menu-btn menu-btn-have"
                      onClick={() => handleSetSeasonState(realIndex, "have")}
                    >
                      있음
                    </button>
                    <button
                      className="menu-btn menu-btn-want"
                      onClick={() => handleSetSeasonState(realIndex, "want")}
                    >
                      원함
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
