"use client";
import React, { useState, useEffect } from "react";
import "./CandleSettingsPanel.css";

export default function CandleSettingsPanel({
  currentCandles,
  setCurrentCandles,
  requiredCandles,
}) {
  const [ownsSeasonPass, setOwnsSeasonPass] = useState("yes"); // "yes" | "no"
  const [buySeasonPass, setBuySeasonPass] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);
  const [calcResult, setCalcResult] = useState("");

  // ✅ 구입예정 보너스(석상 1개 포함): 총 31개
  const BONUS_CANDLES = 31;

  // 시즌 종료일 (KST)
  const seasonEnd = new Date("2025-10-06T16:00:00+09:00");

  const computeRemainingDays = () => {
    const now = new Date();
    const diffMs = seasonEnd.getTime() - now.getTime();
    const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return daysLeft < 0 ? 0 : daysLeft;
  };

  // ownsSeasonPass가 "예"가 되면 구입예정 체크 해제(보이는 체크 느낌 방지)
  useEffect(() => {
    if (ownsSeasonPass === "yes" && buySeasonPass) {
      setBuySeasonPass(false);
    }
  }, [ownsSeasonPass, buySeasonPass]);

  // 남은 일수 1분마다 갱신
  useEffect(() => {
    setRemainingDays(computeRemainingDays());
    const interval = setInterval(() => {
      setRemainingDays(computeRemainingDays());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleBuySeasonPass = () => {
    setBuySeasonPass((prev) => !prev);
  };

  const handleCalculate = () => {
    const current = Number(currentCandles);
    const req = Number(requiredCandles);

    // "yes"이거나 ("no" && 구입예정) ⇒ 6, 그 외 ⇒ 5
    const dailyCandleCount =
      ownsSeasonPass === "yes" || (ownsSeasonPass === "no" && buySeasonPass)
        ? 6
        : 5;

    const seasonCandlesFromDays = remainingDays * dailyCandleCount;

    // 보너스는 "미소유 + 구입예정"일 때만 적용
    const extraCandles =
      ownsSeasonPass === "no" && buySeasonPass ? BONUS_CANDLES : 0;

    const totalSeasonCandles = current + seasonCandlesFromDays + extraCandles;
    const difference = totalSeasonCandles - req;

    const formula =
      extraCandles > 0
        ? `${current} + ${seasonCandlesFromDays} + 시패 보너스 ${BONUS_CANDLES}개 = ${totalSeasonCandles}`
        : `${current} + ${seasonCandlesFromDays} = ${totalSeasonCandles}`;

    // 필요한 일수(보너스 포함 기준)
    const finalitem = Math.ceil(
      (req - current - extraCandles) / dailyCandleCount
    );
    const neededCandles = req - current;

    const result = `
  필요한 양초: ${req} 개

현재 보유 양초: ${current} 개
일일 획득 양초: ${dailyCandleCount} 개 * ${remainingDays} 일 (총 ${seasonCandlesFromDays} 개)
획득 예상 양초: ${formula} 개

${difference < 0 ? `부족한 양초: ${-difference} 개` : `남는 양초: ${difference} 개`}

${neededCandles > 0 ? `선택한 아이템까지 ${neededCandles} 개 필요` : ``}
${finalitem >= 0 && finalitem <= remainingDays ? `선택한 아이템까지 ${finalitem} 일 남음` : ``}
    `;
    setCalcResult(result);
  };

  return (
    <div className="candle-settings-panel">
      {/* 상단: 남은 시즌 일수 및 안내 */}
      <div className="season-days">
        남은 시즌 일수 {remainingDays}일
        <span className="season-days-note">
          <br />
          4시 리셋 이후 양초를 얻었다는 가정 하에 계산됩니다.
        </span>
        <span className="season-days-note">
          아직 리셋 전 오늘 일퀘를 안하셨다면 일퀘 양초를 포함해서 계산해주세요.
        </span>
        <span className="season-days-note">
          구매 예정이라면 시패 보유 여부 아니오 선택 후 구매예정 버튼을 눌러주세요. (석상양초 1개 포함 → 보너스 {BONUS_CANDLES}개 자동 적용)
        </span>
        <span className="season-days-note">
          최보 최단 일수 계산은 '원함!' 전체 선택 후 가지고 있는 아이템을 모두 표시하고 계산하시기 바랍니다.
        </span>
        <span className="season-days-note">
          (시즌초 2배 이벤트 미포함) 오른쪽 하단의 숫자는 재화!개수입니다.
        </span>
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

      {/* 항상 노출, 보유("예")면 비활성화 상태 표현 */}
      <div
        className={`setting-group buy-options ${
          ownsSeasonPass === "yes" ? "is-disabled" : ""
        }`}
        title={
          ownsSeasonPass === "yes"
            ? "시즌 패스를 이미 보유 중이면 추가 보너스는 적용되지 않습니다."
            : undefined
        }
      >
        <p>시패 구입 예정:</p>
        <label>
          <input
            type="checkbox"
            checked={ownsSeasonPass === "yes" ? false : buySeasonPass}
            onChange={handleToggleBuySeasonPass}
            disabled={ownsSeasonPass === "yes"}
            aria-disabled={ownsSeasonPass === "yes"}
          />
          추가 양초 {BONUS_CANDLES}개
        </label>
      </div>

      <div className="calculate-btn-container">
        <button className="calc-btn" onClick={handleCalculate}>
          계산하기
        </button>
      </div>

      {calcResult && <div className="calc-result">{calcResult}</div>}
    </div>
  );
}
