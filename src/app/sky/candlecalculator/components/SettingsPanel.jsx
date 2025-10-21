"use client";
import React from 'react';
import { theme } from '../styles/theme';

export function SettingsPanel({ 
  currentCandles, 
  setCurrentCandles, 
  ownsSeasonPass, 
  setOwnsSeasonPass,
  buySeasonPass,
  setBuySeasonPass,
  remainingDays,
  totalRequired
}) {
  const BONUS_CANDLES = 31;

  return (
    <div style={{
      background: theme.colors.white,
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px',
      border: `2px solid ${theme.colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      maxWidth: '800px',
      margin: '0 auto 24px'
    }}>
      <div style={{ 
        marginBottom: '14px', 
        fontWeight: 'bold',
        fontSize: '15px',
        color: theme.colors.primary
      }}>
        남은 시즌 일수: {remainingDays}일
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        flexWrap: 'wrap', 
        marginBottom: '14px',
        alignItems: 'flex-end'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '13px',
            color: theme.colors.text,
            fontWeight: '500'
          }}>
            현재 보유 양초
          </label>
          <input
            type="number"
            value={currentCandles}
            onChange={(e) => setCurrentCandles(Number(e.target.value))}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: `2px solid ${theme.colors.border}`,
              background: theme.colors.white,
              color: theme.colors.text,
              width: '100px',
              fontSize: '13px'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '13px',
            color: theme.colors.text,
            fontWeight: '500'
          }}>
            시즌 패스 소유
          </label>
          <select
            value={ownsSeasonPass}
            onChange={(e) => setOwnsSeasonPass(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: `2px solid ${theme.colors.border}`,
              background: theme.colors.white,
              color: theme.colors.text,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <option value="yes">예</option>
            <option value="no">아니오</option>
          </select>
        </div>

        <div style={{
          opacity: ownsSeasonPass === "yes" ? 0.5 : 1
        }}>
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            fontSize: '13px',
            color: theme.colors.text,
            cursor: ownsSeasonPass === "yes" ? 'not-allowed' : 'pointer',
            paddingBottom: '6px'
          }}>
            <input
              type="checkbox"
              checked={ownsSeasonPass === "yes" ? false : buySeasonPass}
              onChange={() => setBuySeasonPass(!buySeasonPass)}
              disabled={ownsSeasonPass === "yes"}
              style={{ 
                marginRight: '6px',
                width: '16px',
                height: '16px',
                cursor: ownsSeasonPass === "yes" ? 'not-allowed' : 'pointer'
              }}
            />
            시패 구입 예정 (+{BONUS_CANDLES}개)
          </label>
        </div>
      </div>

      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: theme.colors.background,
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.colors.primary,
        border: `2px solid ${theme.colors.border}`,
        textAlign: 'center'
      }}>
        필요한 양초: {totalRequired}개
      </div>
    </div>
  );
}