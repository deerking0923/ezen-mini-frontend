'use client';

import React, { useState } from 'react';
import NoteButton from './NoteButton';
import ColorPalette from './ColorPalette';
import styles from './SheetMusicEditor.module.css';

// ... (NOTE_COLORS, createNote, createBeat 함수는 이전과 동일)
const BEATS_PER_LINE = 6;
const TOTAL_NOTES = 15;
const INITIAL_BEATS = 12;

export const NOTE_COLORS = {
  default: { fill: '#63b3ed', stroke: '#4299e1', id: 'default' },
  half: { fill: '#f56565', stroke: '#c53030', id: 'half' },
  two: { fill: '#f6e05e', stroke: '#d69e2e', id: 'two' },
  three: { fill: '#48bb78', stroke: '#2f855a', id: 'three' },
  four: { fill: '#4299e1', stroke: '#2b6cb0', id: 'four' },
};

const createNote = () => ({ isActive: false, colorId: 'default' });
const createBeat = () => Array.from({ length: TOTAL_NOTES }, createNote);


export default function SheetMusicEditor() {
  const [sheetData, setSheetData] = useState(
    Array.from({ length: INITIAL_BEATS }, createBeat)
  );
  const [currentColorId, setCurrentColorId] = useState('default');
  // === 새로운 상태: 현재 선택된 시트의 인덱스를 저장 ===
  const [selectedBeatIndex, setSelectedBeatIndex] = useState(null);

  // 시트의 배경(빈 공간)을 클릭했을 때 호출되는 함수
  const handleBeatSelect = (e, beatIndex) => {
    // 이벤트 버블링을 막기 위해, 클릭된 요소가 핸들러가 달린 요소 자신일 때만 실행
    if (e.target === e.currentTarget) {
      // 이미 선택된 시트를 다시 클릭하면 선택 해제(토글)
      setSelectedBeatIndex(prevIndex => prevIndex === beatIndex ? null : beatIndex);
    }
  };

  const toggleNote = (beatIndex, noteIndex) => {
    // 노트 클릭 시에는 시트 선택이 해제되도록 함
    setSelectedBeatIndex(null);
    setSheetData(currentSheetData => {
      // ... (내부 로직은 이전과 동일)
      const newSheetData = currentSheetData.map(beat => beat.map(note => ({...note})));
      const note = newSheetData[beatIndex][noteIndex];
      if (note.isActive && note.colorId === currentColorId) {
        note.isActive = false;
      } else {
        note.isActive = true;
        note.colorId = currentColorId;
      }
      return newSheetData;
    });
  };

  const deleteBeat = (beatIndex) => {
    setSheetData(currentSheetData => {
      const newSheetData = [...currentSheetData];
      newSheetData.splice(beatIndex, 1);
      return newSheetData;
    });
    setSelectedBeatIndex(null); // 삭제 후 선택 해제
  };
  
  const insertBeatAfter = (beatIndex) => {
    setSheetData(currentSheetData => {
      const newSheetData = [...currentSheetData];
      newSheetData.splice(beatIndex + 1, 0, createBeat());
      return newSheetData;
    });
  };

  // === 새로운 기능: 맨 뒤에 시트 1개 추가 ===
  const addBeat = () => {
    setSheetData(currentSheetData => [...currentSheetData, createBeat()]);
  };
  
  const addLine = () => {
    const newLine = Array.from({ length: BEATS_PER_LINE }, createBeat);
    setSheetData(currentSheetData => [...currentSheetData, ...newLine]);
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.sheetContainer}>
        {sheetData.map((beat, beatIndex) => (
          <div 
            key={beatIndex} 
            className={`${styles.beatColumn} ${selectedBeatIndex === beatIndex ? styles.selected : ''}`}
            onClick={(e) => handleBeatSelect(e, beatIndex)}
          >
            <div className={styles.noteGrid}>
              {beat.map((note, noteIndex) => (
                <NoteButton
                  key={noteIndex}
                  noteIndex={noteIndex}
                  isActive={note.isActive}
                  color={NOTE_COLORS[note.colorId]}
                  onClick={() => toggleNote(beatIndex, noteIndex)}
                />
              ))}
            </div>
            
            {/* 선택된 시트에만 조작 버튼이 보이도록 조건부 렌더링 */}
            {selectedBeatIndex === beatIndex && (
              <div className={styles.beatControls}>
                <button onClick={() => insertBeatAfter(beatIndex)} title="뒤에 시트 추가">+</button>
                <button onClick={() => deleteBeat(beatIndex)} title="시트 삭제">×</button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* === '+1 시트 추가' 버튼 복구 === */}
      <div className={styles.controls}>
        <button onClick={addBeat} className={styles.addButton}>+1 시트 추가</button>
        <button onClick={addLine} className={styles.addButton}>+1 줄 추가</button>
      </div>

      <ColorPalette selectedColor={currentColorId} onColorSelect={setCurrentColorId} />
    </div>
  );
}