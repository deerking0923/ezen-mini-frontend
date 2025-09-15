import React from 'react';
import styles from './NoteButton.module.css';

// 기존 모양 정의는 그대로 유지합니다.
const NOTE_SHAPES = [
  'diamond-circle', 'diamond', 'circle', 'diamond', 'circle',
  'circle', 'diamond', 'diamond-circle', 'diamond', 'circle',
  'circle', 'diamond', 'circle', 'diamond', 'diamond-circle',
];

// ✨ 박자 ID에 따라 표시할 기호를 정의합니다.
const DURATION_SYMBOLS = {
    half: '½',
    default: '1', // 정음표는 아무것도 표시하지 않습니다.
    two: '2',
    three: '3',
    four: '4',
};

// ✨ colorId prop을 새로 받도록 수정합니다.
export default function NoteButton({ noteIndex, isActive, color, colorId, onClick }) {
  const shape = NOTE_SHAPES[noteIndex];
  const buttonClassName = `${styles.noteButton} ${isActive ? styles.active : ''}`;

  const activeStyle = isActive ? { fill: color.fill, stroke: color.stroke } : {};

  // ✨ 활성화 상태이고, 표시할 기호가 있을 때만 symbol 변수에 값을 할당합니다.
  const symbol = isActive ? (DURATION_SYMBOLS[colorId] || '') : '';

  return (
    <button className={buttonClassName} onClick={onClick} aria-label={`Note ${noteIndex}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {shape.includes('diamond') && 
          <polygon points="50,5 95,50 50,95 5,50" className={styles.diamond} style={activeStyle} />}
        {shape.includes('circle') && 
          <circle cx="50" cy="50" r="35" className={styles.circle} style={activeStyle} />}

        {/* ✨ --- 이 부분이 추가되었습니다 --- ✨ */}
        {/* symbol 변수에 값이 있을 때만 (활성화 & 정음표 아님) text 렌더링 */}
        {symbol && (
            <text
                x="50"
                y="50"
                textAnchor="middle"
                dy=".35em" // 수직 정렬을 위한 미세 조정
                fill="white"
                fontSize="45"
                fontWeight="bold"
                fontFamily="sans-serif"
                // 글자 가독성을 높이기 위한 그림자 효과 및 클릭 이벤트 방지
                style={{ pointerEvents: 'none' }}
            >
                {symbol}
            </text>
        )}
        {/* ✨ --- 여기까지 --- ✨ */}
      </svg>
    </button>
  );
}