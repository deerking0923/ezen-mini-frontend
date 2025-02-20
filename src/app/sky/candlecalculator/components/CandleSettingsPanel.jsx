// Components/CandleSettingsPanel.jsx
"use client";
import React, { useState } from "react";
import "./CandleSettingsPanel.css";

export default function CandleSettingsPanel({
  currentCandles,
  setCurrentCandles,
  onCalculate,
}) {
  // 시즌 패스 소유 여부 선택 (yes: 소유, no: 미소유)
  const [ownsSeasonPass, setOwnsSeasonPass] = useState("yes");
  // ownsSeasonPass가 "no"일 때, 구매할 항목을 선택하는 상태
  const [buyOptions, setBuyOptions] = useState({
    seasonPass: false,
    candles: false,
  });

  const handleOptionChange = (option) => {
    setBuyOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="candle-settings-panel">
      <div className="setting-group">
        <label htmlFor="candleCount">현재 보유 양초 수:</label>
        <input
          id="candleCount"
          type="number"
          min="0"
          value={currentCandles}
          onChange={(e) => setCurrentCandles(e.target.value)}
        />
      </div>

      <div className="setting-group">
        <label>시즌 패스 소유 여부:</label>
        <select
          value={ownsSeasonPass}
          onChange={(e) => setOwnsSeasonPass(e.target.value)}
        >
          <option value="yes">예</option>
          <option value="no">아니오</option>
        </select>
      </div>

      {ownsSeasonPass === "no" && (
        <div className="setting-group buy-options">
          <p>구매할 항목 선택:</p>
          <label>
            <input
              type="checkbox"
              checked={buyOptions.seasonPass}
              onChange={() => handleOptionChange("seasonPass")}
            />
            시즌 패스
          </label>
          <label>
            <input
              type="checkbox"
              checked={buyOptions.candles}
              onChange={() => handleOptionChange("candles")}
            />
            양초
          </label>
        </div>
      )}

      <div className="calculate-btn-container">
        <button className="calc-btn" onClick={onCalculate}>
          계산하기
        </button>
      </div>
    </div>
  );
}
