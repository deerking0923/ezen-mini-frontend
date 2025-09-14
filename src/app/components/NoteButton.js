import React from 'react';
import styles from './NoteButton.module.css';

const NOTE_SHAPES = [
  'diamond-circle', 'diamond', 'circle', 'diamond', 'circle',
  'circle', 'diamond', 'diamond-circle', 'diamond', 'circle',
  'circle', 'diamond', 'circle', 'diamond', 'diamond-circle',
];

// color prop을 새로 받음
export default function NoteButton({ noteIndex, isActive, color, onClick }) {
  const shape = NOTE_SHAPES[noteIndex];
  const buttonClassName = `${styles.noteButton} ${isActive ? styles.active : ''}`;

  // 활성화 상태일 때만 color prop으로 받은 색상을 적용
  const activeStyle = isActive ? { fill: color.fill, stroke: color.stroke } : {};

  return (
    <button className={buttonClassName} onClick={onClick} aria-label={`Note ${noteIndex}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {shape.includes('diamond') && 
          <polygon points="50,5 95,50 50,95 5,50" className={styles.diamond} style={activeStyle} />}
        {shape.includes('circle') && 
          <circle cx="50" cy="50" r="35" className={styles.circle} style={activeStyle} />}
      </svg>
    </button>
  );
}