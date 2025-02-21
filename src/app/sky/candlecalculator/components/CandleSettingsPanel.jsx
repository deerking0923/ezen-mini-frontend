"use client";
import React, { useState, useEffect } from "react";
import "./CandleSettingsPanel.css";

export default function CandleSettingsPanel({
  currentCandles,
  setCurrentCandles,
  requiredCandles, // 부모에서 전달한 필요한 양초 수
}) {
  // 시즌 패스 소유 여부 (예, 아니오)
  const [ownsSeasonPass, setOwnsSeasonPass] = useState("yes");
  // 미소유(아니오)일 때 구입 예정 여부
  const [buySeasonPass, setBuySeasonPass] = useState(false);
  // 남은 시즌 일수 (동적으로 계산)
  const [remainingDays, setRemainingDays] = useState(0);
  // 계산 결과 문자열
  const [calcResult, setCalcResult] = useState("");

  // 시즌 종료일 (예: 4월 7일 16:00, 한국 시간 기준)
  const seasonEnd = new Date("2025-04-07T16:00:00+09:00");

  const computeRemainingDays = () => {
    const now = new Date();
    const diffMs = seasonEnd.getTime() - now.getTime();
    let daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return daysLeft < 0 ? 0 : daysLeft;
  };
  

  useEffect(() => {
    // 최초 남은 시즌 일수 계산
    setRemainingDays(computeRemainingDays());
    // 매 분마다 갱신 (리셋 시간이 지나면 1일씩 줄어드는 효과)
    const interval = setInterval(() => {
      setRemainingDays(computeRemainingDays());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleBuySeasonPass = () => {
    setBuySeasonPass((prev) => !prev);
  };

  // 계산하기 버튼 클릭 시 실행되는 함수 (계산 로직 적용)
  const handleCalculate = () => {
    const current = Number(currentCandles);
    // 일일 획득 양초 수: 시즌 패스 소유 여부가 "yes"이거나,
    // "no"인데 구입 예정이면 6, 그렇지 않으면 5
    const dailyCandleCount =
      ownsSeasonPass === "yes" || (ownsSeasonPass === "no" && buySeasonPass)
        ? 6
        : 5;
    const seasonCandlesFromDays = remainingDays * dailyCandleCount;
    // 미소유이면서 구입 예정인 경우 추가 보너스 +30개
    const extraCandles =
      ownsSeasonPass === "no" && buySeasonPass ? 30 : 0;
    const totalSeasonCandles = current + seasonCandlesFromDays + extraCandles;
    const difference = totalSeasonCandles - Number(requiredCandles);

    const formula = 
    ownsSeasonPass === "no" && buySeasonPass
      ? `${current} + ${seasonCandlesFromDays} + 시패 추가 30개 = ${totalSeasonCandles}`
      : `${current} + ${seasonCandlesFromDays} = ${totalSeasonCandles}`;
    
    const finalitem = buySeasonPass ? Math.ceil((requiredCandles - current - 30) / dailyCandleCount) : Math.ceil((requiredCandles - current) / dailyCandleCount);

  const result = `
  필요한 양초: ${requiredCandles}개

현재 보유 양초: ${current}개
일일 획득 양초: ${dailyCandleCount}개 * ${remainingDays}일 (총 ${seasonCandlesFromDays}개)
획득 예상 양초: ${formula}개

${difference < 0 ? `부족한 양초: ${-difference}개` : `남는 양초: ${difference}개`}

${finalitem >= 0  && (ownsSeasonPass === "yes" || buySeasonPass) && finalitem <= remainingDays ? `최보까지 ${finalitem}일 남음` : ``}
  `;
    
    setCalcResult(result);
  };

  return (
    <div className="candle-settings-panel">
      {/* 상단: 남은 시즌 일수 및 부가 설명 */}
      <div className="season-days">
        남은 시즌 일수 {remainingDays}일
        <span className="season-days-note">
          (4시 리셋 이후 양초를 얻었다는 가정 하에 계산됩니다.
        </span>
        <span className="season-days-note"> 아직 리셋 전 오늘
        일퀘를 안하셨다면 일퀘 양초를 포함해서 계산해주세요.)</span>
        <span className="season-days-note">최보 최단 일수 계산은 '원함!' 전체 선택 후 가지고 있는 아이템을 모두 표시하고 계산하시기 바랍니다.</span>
      </div>

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
          <p>시패 구입 예정:</p>
          <label>
            <input
              type="checkbox"
              checked={buySeasonPass}
              onChange={handleToggleBuySeasonPass}
            />
            추가 양초 30개
          </label>
        </div>
      )}

      <div className="calculate-btn-container">
        <button className="calc-btn" onClick={handleCalculate}>
          계산하기
        </button>
      </div>

      {/* 계산 결과 표시 영역 */}
      {calcResult && <div className="calc-result">{calcResult}</div>}
    </div>
  );
}
