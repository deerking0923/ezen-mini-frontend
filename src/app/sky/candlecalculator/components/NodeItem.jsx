"use client";
import React from 'react';
import { theme } from '../styles/theme';

export function NodeItem({ node, isSelected, onToggle, spiritId }) {
  const isSeason = node.type === "season";
  
  // 이미지 경로: /sky/calculator/s1_l5_s1.webp
  const imagePath = `/sky/calculator/${node.id}.webp`;
  
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block'
    }}>
      <div
        onClick={onToggle}
        style={{
          width: '70px',
          height: '70px',
          border: isSelected ? `3px solid ${theme.colors.selected}` : `2px solid ${theme.colors.border}`,
          borderRadius: '8px',
          cursor: 'pointer',
          background: theme.colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s',
          boxShadow: isSelected ? '0 2px 8px rgba(33,150,243,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = theme.colors.hover;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = theme.colors.white;
        }}
      >
        {/* 노드 이미지 */}
        <img 
          src={imagePath}
          alt={node.id}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // 이미지 로드 실패시 기본 아이콘 표시
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{ fontSize: '28px', display: 'none' }}>
          {isSeason ? '⭐' : '📦'}
        </div>
        
        {/* 시즌 아이콘 배지 */}
        {isSeason && (
          <div style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            width: '18px',
            height: '18px',
            background: theme.colors.season,
            borderRadius: '50%',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}>
            🌟
          </div>
        )}
        
        {/* 비용 배지 */}
        {node.cost > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            background: theme.colors.primary,
            color: theme.colors.white,
            padding: '2px 7px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {node.cost}
          </div>
        )}
      </div>
    </div>
  );
}