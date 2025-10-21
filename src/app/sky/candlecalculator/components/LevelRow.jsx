"use client";
import React from 'react';
import { theme } from '../styles/theme';
import { NodeItem } from './NodeItem';

export function LevelRow({ level, selectedNodes, onToggleNode, spiritId }) {
  const hasNodes = level.leftNodes.length > 0 || level.rightNodes.length > 0;
  if (!hasNodes) return null;
  
  // 시즌 노드가 2개 이상인지 확인
  const hasMultipleSeasonNodes = level.rightNodes.length > 1;
  
  return (
    <div style={{
      display: 'flex',
      alignItems: hasMultipleSeasonNodes ? 'center' : 'flex-start',
      marginBottom: '8px',
      gap: '12px'
    }}>
      {/* 왼쪽 레벨 표시 */}
      <div style={{
        fontSize: '12px',
        color: theme.colors.primary,
        fontWeight: 'bold',
        width: '50px',
        textAlign: 'right',
        paddingTop: hasMultipleSeasonNodes ? '0' : '25px'
      }}>
        Level {level.level}
      </div>
      
      {/* 3열 노드 그리드 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '70px 70px 70px',
        gap: '8px',
        alignItems: 'end'
      }}>
        {/* 왼쪽 첫 번째 노드 */}
        {level.leftNodes[0] ? (
          <NodeItem
            node={level.leftNodes[0]}
            isSelected={selectedNodes.has(level.leftNodes[0].id)}
            onToggle={() => onToggleNode(level.leftNodes[0].id)}
            spiritId={spiritId}
          />
        ) : <div style={{ width: '70px', height: '70px' }} />}
        
        {/* 왼쪽 두 번째 노드 */}
        {level.leftNodes[1] ? (
          <NodeItem
            node={level.leftNodes[1]}
            isSelected={selectedNodes.has(level.leftNodes[1].id)}
            onToggle={() => onToggleNode(level.leftNodes[1].id)}
            spiritId={spiritId}
          />
        ) : <div style={{ width: '70px', height: '70px' }} />}
        
        {/* 오른쪽 시즌 노드 - 아래에서부터 쌓기 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column-reverse',
          gap: '4px',
          alignItems: 'center'
        }}>
          {level.rightNodes.map((node) => (
            <NodeItem
              key={node.id}
              node={node}
              isSelected={selectedNodes.has(node.id)}
              onToggle={() => onToggleNode(node.id)}
              spiritId={spiritId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}