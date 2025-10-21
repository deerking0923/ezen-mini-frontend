"use client";
import React from 'react';
import { theme, translations } from '../styles/theme';

export function CalculationResult({ 
  currentCandles,
  totalRequired,
  ownsSeasonPass,
  buySeasonPass,
  remainingDays,
  onCalculate,
  calcResult,
  language
}) {
  const t = translations[language];
  
  return (
    <div style={{
      background: theme.colors.white,
      padding: '16px',
      borderRadius: '12px',
      marginTop: '30px',
      marginBottom: '30px',
      marginLeft: 'auto',
      marginRight: 'auto',
      border: `2px solid ${theme.colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      maxWidth: '600px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <button
        onClick={onCalculate}
        style={{
          padding: '12px 24px',
          background: theme.colors.primary,
          color: theme.colors.white,
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background 0.2s',
          width: '100%',
          maxWidth: '200px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: calcResult ? '20px' : '0'
        }}
        onMouseEnter={(e) => e.target.style.background = theme.colors.primaryDark}
        onMouseLeave={(e) => e.target.style.background = theme.colors.primary}
      >
        {t.calculate}
      </button>

      {calcResult && (
        <div style={{
          background: theme.colors.background,
          borderRadius: '8px',
          border: `2px solid ${theme.colors.primary}`,
          overflow: 'hidden'
        }}>
          {/* 헤더 */}
          <div style={{
            background: theme.colors.primary,
            color: theme.colors.white,
            padding: '12px',
            fontWeight: 'bold',
            fontSize: '15px',
            textAlign: 'center'
          }}>
            {t.calculationResult}
          </div>

          <div style={{ padding: '16px' }}>
            {/* 기본 정보 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '13px'
            }}>
              <span>{t.remainingSeasonDays}</span>
              <span style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {calcResult.remainingDays}{t.days}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              <span>{t.dailyCandles}</span>
              <span style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {calcResult.dailyCandleCount}{t.bonusCandles}
              </span>
            </div>

            <div style={{
              borderTop: `2px solid ${theme.colors.border}`,
              marginBottom: '12px'
            }}></div>

            {/* 현재 보유 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '13px'
            }}>
              <span>{t.currentCandlesLabel}</span>
              <span style={{ fontWeight: 'bold' }}>
                {calcResult.currentCandles}{t.bonusCandles}
              </span>
            </div>

            {/* 남은 기간 획득 */}
            <div style={{
              marginBottom: '8px',
              fontSize: '13px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span>{t.remainingPeriodCandles}</span>
                <span style={{ fontWeight: 'bold' }}>
                  {calcResult.seasonCandlesFromDays}{t.bonusCandles}
                </span>
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.textLight,
                textAlign: 'right'
              }}>
                ({calcResult.dailyCandleCount}{t.bonusCandles} × {calcResult.remainingDays}{t.days})
              </div>
            </div>

            {/* 보너스 */}
            {calcResult.bonusText && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '13px',
                color: theme.colors.primary
              }}>
                <span>{t.seasonPassBonus}</span>
                <span style={{ fontWeight: 'bold' }}>
                  +31{t.bonusCandles}
                </span>
              </div>
            )}

            <div style={{
              borderTop: `2px solid ${theme.colors.border}`,
              marginBottom: '12px'
            }}></div>

            {/* 총 획득 가능 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: theme.colors.primary
            }}>
              <span>{t.totalObtainableCandles}</span>
              <span>{calcResult.totalSeasonCandles}{t.bonusCandles}</span>
            </div>

            <div style={{
              borderTop: `2px solid ${theme.colors.border}`,
              marginBottom: '12px'
            }}></div>

{/* 선택한 양초 섹션 */}
<div style={{
  background: '#E3F2FD',
  padding: '10px',
  borderRadius: '6px',
  marginBottom: '12px'
}}>
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: 'bold',
    color: theme.colors.text
  }}>
    <span>{t.selected}</span>
    <span>{calcResult.totalRequired}{t.bonusCandles}</span>
  </div>
</div>

{/* 필요한 양초 */}
<div style={{
  marginBottom: '16px'
}}>
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '6px'
  }}>
    <span>{t.neededCandles}</span>
    <span>{calcResult.neededCandles}{t.bonusCandles}</span>
  </div>
  <div style={{
    fontSize: '12px',
    color: theme.colors.textLight,
    textAlign: 'right'
  }}>
    ({calcResult.totalRequired} - {calcResult.currentCandles}
    {calcResult.hasBonus && ' - 31'} = {calcResult.neededCandles})
  </div>
{calcResult.neededCandles < 0 && (
  <div style={{
    marginTop: '8px',
    padding: '8px',
    background: '#E8F5E9',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: 'bold'
  }}>
    {t.alreadyEnough.replace('{amount}', Math.abs(calcResult.neededCandles))}
  </div>
)}
</div>

            {/* 결과 */}
            <div style={{
              background: calcResult.difference >= 0 ? '#E8F5E9' : '#FFEBEE',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: 'bold',
                color: calcResult.difference >= 0 ? '#2E7D32' : '#C62828'
              }}>
                <span>
                  {calcResult.difference >= 0 ? '✅ ' + t.remainingCandles : '⚠️ ' + t.shortageCandles}
                </span>
                <span>
                  {Math.abs(calcResult.difference)}{t.bonusCandles}
                </span>
              </div>
            </div>

            {/* 필요 일수 */}
            {calcResult.neededCandles > 0 && 
             calcResult.finalDays >= 0 && 
             calcResult.finalDays <= calcResult.remainingDays && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: theme.colors.primary,
                fontWeight: 'bold'
              }}>
                <span>{t.daysNeeded}</span>
                <span>{calcResult.finalDays}{t.days}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}