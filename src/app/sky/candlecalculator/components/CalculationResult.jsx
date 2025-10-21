"use client";
import React from 'react';
import { theme } from '../styles/theme';

export function CalculationResult({ 
  currentCandles,
  totalRequired,
  ownsSeasonPass,
  buySeasonPass,
  remainingDays,
  onCalculate,
  calcResult
}) {
  return (
    <div style={{
      background: theme.colors.white,
      padding: '20px',
      borderRadius: '12px',
      marginTop: '30px',
      marginBottom: '30px',
      border: `2px solid ${theme.colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '30px auto'
    }}>
      <button
        onClick={onCalculate}
        style={{
          padding: '12px 32px',
          background: theme.colors.primary,
          color: theme.colors.white,
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background 0.2s',
          marginBottom: calcResult ? '20px' : '0'
        }}
        onMouseEnter={(e) => e.target.style.background = theme.colors.primaryDark}
        onMouseLeave={(e) => e.target.style.background = theme.colors.primary}
      >
        계산하기!
      </button>

      {calcResult && (
        <div style={{
          padding: '20px',
          background: theme.colors.background,
          borderRadius: '8px',
          border: `2px solid ${theme.colors.primary}`,
          fontSize: '14px',
          lineHeight: '1.8',
          color: theme.colors.text,
          textAlign: 'left'
        }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{calcResult}</div>
        </div>
      )}
    </div>
  );
}