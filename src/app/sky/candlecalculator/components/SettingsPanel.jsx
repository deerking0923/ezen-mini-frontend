"use client";
import React from 'react';
import { theme, translations } from '../styles/theme';

export function SettingsPanel({ 
  currentCandles, 
  setCurrentCandles, 
  ownsSeasonPass, 
  setOwnsSeasonPass,
  buySeasonPass,
  setBuySeasonPass,
  remainingDays,
  totalRequired,
  language
}) {
  const BONUS_CANDLES = 31;
  const t = translations[language];

  return (
    <div style={{
      background: theme.colors.white,
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px',
      marginLeft: 'auto',
      marginRight: 'auto',
      border: `2px solid ${theme.colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      maxWidth: '800px'
    }}>
      {/* 설명 문구 */}
      <div style={{
        marginBottom: '16px',
        padding: '12px',
        background: theme.colors.background,
        borderRadius: '6px',
        fontSize: '12px',
        lineHeight: '1.6',
        color: theme.colors.textLight
      }}>
        {t.notices.map((notice, index) => {
          const noticeText = notice.replace('{BONUS_CANDLES}', BONUS_CANDLES);
          
          // 첫 번째 공지의 Sky Wiki에 링크 삽입
          if (index === 0) {
            const parts = noticeText.split('Sky Wiki');
            return (
              <div key={index} style={{ marginBottom: index < t.notices.length - 1 ? '4px' : '0' }}>
                {parts[0]}
                <a 
                  href="https://sky-children-of-the-light.fandom.com/wiki/Season_of_Migration"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.colors.primary,
                    textDecoration: 'underline',
                    fontWeight: 'bold'
                  }}
                >
                  Sky Wiki
                </a>
                {parts[1]}
              </div>
            );
          }
          
          return (
            <div key={index} style={{ marginBottom: index < t.notices.length - 1 ? '4px' : '0' }}>
              {noticeText}
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginBottom: '14px', 
        fontWeight: 'bold',
        fontSize: '15px',
        color: theme.colors.primary
      }}>
        {t.remainingDays}: {remainingDays}{t.days}
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
            {t.currentCandles}
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
            {t.ownsSeasonPass}
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
            <option value="yes">{t.yes}</option>
            <option value="no">{t.no}</option>
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
            {t.buySeasonPass} (+{BONUS_CANDLES}{t.bonusCandles})
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
        {t.requiredCandles}: {totalRequired}{t.bonusCandles}
      </div>
    </div>
  );
}