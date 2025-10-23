"use client";
import React, { useState } from 'react';
import { theme } from '../styles/theme';

export function SimpleCandleCalculator() {
  const [count, setCount] = useState(15);

  const handleIncrease = () => {
    setCount(prev => prev + 15);
  };

  const handleDecrease = () => {
    setCount(prev => Math.max(15, prev - 15));
  };

  const price = (count / 15) * 6600;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '20px',
      border: `2px solid ${theme.colors.border}`,
      borderRadius: '12px',
      background: theme.colors.white,
      marginTop: '30px',
      maxWidth: '350px',
      margin: '30px auto 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src="/sky/calculator/candle.webp"
          alt="candle"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{ fontSize: '40px', display: 'none' }}>
          🕯️
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: theme.colors.text
        }}>
          {count}개
        </div>
        <div style={{
          fontSize: '16px',
          color: theme.colors.primary,
          fontWeight: 'bold'
        }}>
          {price.toLocaleString()}원
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <button
          onClick={handleIncrease}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            background: theme.colors.primary,
            color: theme.colors.white,
            fontSize: '20px',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'background 0.2s',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => e.target.style.background = theme.colors.primaryDark}
          onMouseLeave={(e) => e.target.style.background = theme.colors.primary}
        >
          ▲
        </button>
        <button
          onClick={handleDecrease}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            background: theme.colors.primary,
            color: theme.colors.white,
            fontSize: '20px',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'background 0.2s',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => e.target.style.background = theme.colors.primaryDark}
          onMouseLeave={(e) => e.target.style.background = theme.colors.primary}
        >
          ▼
        </button>
      </div>
    </div>
  );
}