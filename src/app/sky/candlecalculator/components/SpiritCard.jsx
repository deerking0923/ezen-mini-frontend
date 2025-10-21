"use client";
import React from 'react';
import { theme, translations } from '../styles/theme';
import { LevelRow } from './LevelRow';

export function SpiritCard({ spirit, selectedNodes, onToggleNode, onSelectAll, onClearAll, language }) {
  const t = translations[language];
  
  const selectedCandles = spirit.levels.reduce((sum, level) => {
    const leftSum = level.leftNodes.reduce((nodeSum, node) => {
      return nodeSum + (selectedNodes.has(node.id) ? node.cost : 0);
    }, 0);
    const rightSum = level.rightNodes.reduce((nodeSum, node) => {
      return nodeSum + (selectedNodes.has(node.id) ? node.cost : 0);
    }, 0);
    return sum + leftSum + rightSum;
  }, 0);

  const spiritImagePath = `/sky/calculator/s${spirit.id}.webp`;

  return (
    <div style={{
      border: `2px solid ${theme.colors.border}`,
      borderRadius: '12px',
      padding: '20px',
      background: theme.colors.white,
      width: '300px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        width: '100%',
        height: '100px',
        background: theme.colors.background,
        borderRadius: '8px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden'
      }}>
        <img 
          src={spiritImagePath}
          alt={typeof spirit.name === 'object' ? spirit.name[language] : spirit.name}
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
        <div style={{ fontSize: '14px', color: theme.colors.textLight, display: 'none' }}>
          Spirit {spirit.id}
        </div>
      </div>
      
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '15px',
        textAlign: 'center',
        color: theme.colors.text,
        lineHeight: '1.3'
      }}>
        {typeof spirit.name === 'object' ? spirit.name[language] : spirit.name}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '18px'
      }}>
        <button
          onClick={() => onSelectAll(spirit)}
          style={{
            flex: 1,
            padding: '10px',
            background: theme.colors.primary,
            color: theme.colors.white,
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = theme.colors.primaryDark}
          onMouseLeave={(e) => e.target.style.background = theme.colors.primary}
        >
          {t.selectAll}
        </button>
        <button
          onClick={() => onClearAll(spirit)}
          style={{
            flex: 1,
            padding: '10px',
            background: theme.colors.white,
            color: theme.colors.primary,
            border: `2px solid ${theme.colors.primary}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.primary;
            e.target.style.color = theme.colors.white;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = theme.colors.white;
            e.target.style.color = theme.colors.primary;
          }}
        >
          {t.clear}
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        {spirit.levels.map(level => (
          <LevelRow
            key={level.level}
            level={level}
            selectedNodes={selectedNodes}
            onToggleNode={onToggleNode}
            spiritId={spirit.id}
          />
        ))}
      </div>

      <div style={{
        borderTop: `2px solid ${theme.colors.border}`,
        paddingTop: '12px',
        fontSize: '13px',
        textAlign: 'center'
      }}>
        <div style={{ 
          color: theme.colors.textLight,
          marginBottom: '6px'
        }}>
          {t.total}: {spirit.totalCandles}{t.bonusCandles}
        </div>
        <div style={{ 
          color: theme.colors.primary, 
          fontWeight: 'bold',
          fontSize: '15px'
        }}>
          {t.selected}: {selectedCandles}{t.bonusCandles}
        </div>
      </div>
    </div>
  );
}