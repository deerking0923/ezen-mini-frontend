import React from 'react';
import { NOTE_COLORS } from './SheetMusicEditor'; // 색상 정의 import
import styles from './ColorPalette.module.css';

const COLOR_MAP = [
  { id: 'half', name: '1/2박' },
  { id: 'default', name: '정음표' },
  { id: 'two', name: '2박' },
  { id: 'three', name: '3박' },
  { id: 'four', name: '4박' },
];

export default function ColorPalette({ selectedColor, onColorSelect }) {
  return (
    <div className={styles.paletteContainer}>
      <p className={styles.paletteTitle}>박자 선택</p>
      <div className={styles.colorOptions}>
        {COLOR_MAP.map(({ id, name }) => (
          <button
            key={id}
            className={`${styles.colorButton} ${selectedColor === id ? styles.selected : ''}`}
            onClick={() => onColorSelect(id)}
            aria-label={name}
          >
            <span
              className={styles.colorChip}
              style={{ backgroundColor: NOTE_COLORS[id].fill }}
            />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}