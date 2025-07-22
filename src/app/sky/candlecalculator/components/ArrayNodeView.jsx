"use client";
import React from "react";
import "./NodeView.css";

/**
 * 전파 규칙 (상위 방향 only)
 * 1. 메인 '있음!'  → 0‥idx 메인만 `have` (시즌 X)
 * 2. 메인 '원함!'  → 클릭 메인은 항상 `want`, 그 위로 가며 기존 `have` 만나면 중단, 나머지 메인 `want`
 * 3. 시즌 '있음!'  → 0‥idx 메인+시즌 `have`
 * 4. 시즌 '원함!'  → 클릭 노드(메인+시즌) `want`, 위로 가며 기존 `have` 만나면 중단, 나머지 메인+시즌 `want`
 * 5. 해제          → 클릭 노드 + 대응 노드만 `none`
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
  /* ---------- helpers ---------- */
  const getSeasonNode = (i) => seasonArray.find((sn) => sn.id === `child${i + 1}`) || null;

  const toggleMenu = (id) => setOpenMenu((cur) => (cur && cur.soulIndex === soulIndex && cur.nodeId === id ? null : { soulIndex, nodeId: id }));

  const updateAllNodes = (state) => {
    const up = {};
    mainArray.forEach((m) => (up[m.id] = state));
    seasonArray.forEach((s) => (up[s.id] = state));
    setNodeStates(up);
  };

  /* ---------- click handlers ---------- */
  const handleMain = (idx, state) => {
    setNodeStates((prev) => {
      const up = { ...prev };
      const mainId = mainArray[idx].id;
      const seasonId = getSeasonNode(idx)?.id;
      const cur = prev[mainId] || "none";
      const real = cur === state ? "none" : state;

      // 해제
      if (real === "none") {
        up[mainId] = "none";
        if (seasonId) up[seasonId] = "none";
        return up;
      }

      // 있음!: 0..idx 메인 have
      if (real === "have") {
        for (let i = 0; i <= idx; i++) up[mainArray[i].id] = "have";
        return up;
      }

      // 원함!: 클릭 메인은 무조건 want, 위로 가며 have 만나면 중단
      up[mainId] = "want";
      for (let i = idx - 1; i >= 0; i--) {
        const id = mainArray[i].id;
        if (prev[id] === "have") break;
        up[id] = "want";
      }
      return up;
    });
  };

  const handleSeason = (idx, state) => {
    setNodeStates((prev) => {
      const up = { ...prev };
      const season = getSeasonNode(idx);
      if (!season) return prev;
      const seasonId = season.id;
      const mainId = mainArray[idx].id;
      const cur = prev[seasonId] || "none";
      const real = cur === state ? "none" : state;

      // 해제
      if (real === "none") {
        up[seasonId] = "none";
        up[mainId] = "none";
        return up;
      }

      // 있음!: 0..idx 메인+시즌 have
      if (real === "have") {
        for (let i = 0; i <= idx; i++) {
          up[mainArray[i].id] = "have";
          const s = getSeasonNode(i);
          if (s) up[s.id] = "have";
        }
        return up;
      }

      // 원함!: 클릭 시즌+메인 want, 위로 가며 have 만나면 중단
      up[seasonId] = "want";
      up[mainId] = "want";
      for (let i = idx - 1; i >= 0; i--) {
        const mid = mainArray[i].id;
        const s = getSeasonNode(i);
        if (prev[mid] === "have" || (s && prev[s.id] === "have")) break;
        up[mid] = "want";
        if (s) up[s.id] = "want";
      }
      return up;
    });
  };

  /* ---------- render ---------- */
  const rows = [...mainArray].map((n, i) => ({ node: n, idx: i })).reverse();

  return (
    <div className="nodeview-array-container">
      <div className="global-select-buttons" style={{ marginBottom: 10 }}>
        <button onClick={() => updateAllNodes("have")}>있음!</button>
        <button onClick={() => updateAllNodes("want")}>원함!</button>
      </div>

      {rows.map(({ node, idx }) => {
        const mState = nodeStates[node.id] || "none";
        const season = getSeasonNode(idx);
        const sState = season ? nodeStates[season.id] || "none" : "none";
        return (
          <div key={node.id} className="node-row">
            {/* 메인 노드 */}
            <div className="node-image-box">
              <img
                src={`/sky/calculator/spirit${soulIndex}_item${idx + 1}.webp`}
                alt={node.name}
                className="node-image"
                style={{ border: mState === "have" ? "3px solid #0062ff" : mState === "want" ? "3px solid #ffda53" : "3px solid transparent" }}
                onClick={() => toggleMenu(node.id)}
              />
              <div className="cost-badge">{node.cost}</div>
              {openMenu?.soulIndex === soulIndex && openMenu.nodeId === node.id && (
                <div className="menu-overlay">
                  <button className="menu-btn menu-btn-have" onClick={() => handleMain(idx, "have")}>있음</button>
                  <button className="menu-btn menu-btn-want" onClick={() => handleMain(idx, "want")}>원함</button>
                </div>
              )}
            </div>
            {/* 시즌 */}
            {season && (
              <div className="node-image-box">
                <img
                  src={`/sky/calculator/spirit${soulIndex}_item${idx + 1}_child.webp`}
                  alt={season.name}
                  className="node-image"
                  style={{ border: sState === "have" ? "3px solid #0062ff" : sState === "want" ? "3px solid #ffda53" : "3px solid transparent" }}
                  onClick={() => toggleMenu(season.id)}
                />
                <div className="season-icon-badge">
                  <img src="/sky/calculator/season_icon.webp" alt="Season" className="season-icon" />
                </div>
                {openMenu?.soulIndex === soulIndex && openMenu.nodeId === season.id && (
                  <div className="menu-overlay">
                    <button className="menu-btn menu-btn-have" onClick={() => handleSeason(idx, "have")}>있음</button>
                    <button className="menu-btn menu-btn-want" onClick={() => handleSeason(idx, "want")}>원함</button>
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
