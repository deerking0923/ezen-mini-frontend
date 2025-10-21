"use client";
import React, { useState, useEffect } from 'react';
import { spiritsData } from './data/spiritsData';
import { theme } from './styles/theme';
import { SpiritCard } from './components/SpiritCard';
import { SettingsPanel } from './components/SettingsPanel';
import { CalculationResult } from './components/CalculationResult';
import { SimpleCandleCalculator } from './components/SimpleCandleCalculator';

export default function CandleCalculator() {
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [currentCandles, setCurrentCandles] = useState(0);
  const [ownsSeasonPass, setOwnsSeasonPass] = useState("yes");
  const [buySeasonPass, setBuySeasonPass] = useState(false);
  const [calcResult, setCalcResult] = useState("");

  const BONUS_CANDLES = 31;
  const seasonEnd = new Date("2026-01-05T17:00:00+09:00");
  
  const [remainingDays, setRemainingDays] = useState(() => {
    const now = new Date();
    const diffMs = seasonEnd.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = seasonEnd.getTime() - now.getTime();
      setRemainingDays(Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24))));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleNode = (nodeId) => {
    setSelectedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const selectAllForSpirit = (spirit) => {
    setSelectedNodes(prev => {
      const newSet = new Set(prev);
      spirit.levels.forEach(level => {
        level.leftNodes.forEach(node => newSet.add(node.id));
        level.rightNodes.forEach(node => newSet.add(node.id));
      });
      return newSet;
    });
  };

  const clearAllForSpirit = (spirit) => {
    setSelectedNodes(prev => {
      const newSet = new Set(prev);
      spirit.levels.forEach(level => {
        level.leftNodes.forEach(node => newSet.delete(node.id));
        level.rightNodes.forEach(node => newSet.delete(node.id));
      });
      return newSet;
    });
  };

  const totalRequired = spiritsData.reduce((sum, spirit) => {
    return sum + spirit.levels.reduce((levelSum, level) => {
      const leftSum = level.leftNodes.reduce((nodeSum, node) => {
        return nodeSum + (selectedNodes.has(node.id) ? node.cost : 0);
      }, 0);
      const rightSum = level.rightNodes.reduce((nodeSum, node) => {
        return nodeSum + (selectedNodes.has(node.id) ? node.cost : 0);
      }, 0);
      return levelSum + leftSum + rightSum;
    }, 0);
  }, 0);

const handleCalculate = () => {
  const dailyCandleCount = 
    ownsSeasonPass === "yes" || (ownsSeasonPass === "no" && buySeasonPass) ? 6 : 5;
  
  const BONUS_CANDLES = 31;
  const seasonCandlesFromDays = remainingDays * dailyCandleCount;
  const extraCandles = ownsSeasonPass === "no" && buySeasonPass ? BONUS_CANDLES : 0;
  const totalSeasonCandles = currentCandles + seasonCandlesFromDays + extraCandles;
  const difference = totalSeasonCandles - totalRequired;
  const neededCandles = totalRequired - currentCandles;
  const finalDays = Math.ceil((totalRequired - currentCandles - extraCandles) / dailyCandleCount);

  const bonusText = extraCandles > 0 ? ` + 시패 보너스 ${BONUS_CANDLES}개` : '';
  
  const result = `📊 계산 결과

🕐 남은 시즌 일수: ${remainingDays}일
💰 일일 획득 양초: ${dailyCandleCount}개

━━━━━━━━━━━━━━━━━━━━

현재 보유 양초: ${currentCandles}개
남은 기간 획득 양초: ${seasonCandlesFromDays}개 (${dailyCandleCount}개 × ${remainingDays}일)${bonusText}
─────────────────────
총 획득 가능 양초: ${totalSeasonCandles}개

필요한 양초: ${totalRequired}개

━━━━━━━━━━━━━━━━━━━━

${difference >= 0 ? `✅ 남는 양초: ${difference}개` : `⚠️ 부족한 양초: ${-difference}개`}
${neededCandles > 0 && finalDays >= 0 && finalDays <= remainingDays ? `\n⏱️ 선택한 아이템까지 필요 일수: ${finalDays}일` : ''}`;

  setCalcResult(result);
};
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'sans-serif',
      background: theme.colors.background,
      minHeight: '100vh'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: theme.colors.text
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: theme.colors.primary,
          marginBottom: '8px'
        }}>
          스카이 양초 계산기
        </h1>
        <p style={{ color: theme.colors.textLight, fontSize: '14px' }}>
          이주의 시즌
        </p>
      </div>

      <SettingsPanel
        currentCandles={currentCandles}
        setCurrentCandles={setCurrentCandles}
        ownsSeasonPass={ownsSeasonPass}
        setOwnsSeasonPass={setOwnsSeasonPass}
        buySeasonPass={buySeasonPass}
        setBuySeasonPass={setBuySeasonPass}
        remainingDays={remainingDays}
        totalRequired={totalRequired}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {spiritsData.slice(0, 3).map(spirit => (
            <SpiritCard
              key={spirit.id}
              spirit={spirit}
              selectedNodes={selectedNodes}
              onToggleNode={toggleNode}
              onSelectAll={selectAllForSpirit}
              onClearAll={clearAllForSpirit}
            />
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {spiritsData.slice(3, 5).map(spirit => (
            <SpiritCard
              key={spirit.id}
              spirit={spirit}
              selectedNodes={selectedNodes}
              onToggleNode={toggleNode}
              onSelectAll={selectAllForSpirit}
              onClearAll={clearAllForSpirit}
            />
          ))}
        </div>
      </div>

      <CalculationResult
        currentCandles={currentCandles}
        totalRequired={totalRequired}
        ownsSeasonPass={ownsSeasonPass}
        buySeasonPass={buySeasonPass}
        remainingDays={remainingDays}
        onCalculate={handleCalculate}
        calcResult={calcResult}
      />

      <SimpleCandleCalculator />
    </div>
  );
}