'use client';

import React, { Fragment, useState } from 'react';
import NoteButton from './NoteButton';
import ColorPalette from './ColorPalette';
import styles from './SheetMusicEditor.module.css';

// --- 설정 ---
const BEATS_PER_LINE = 6;
const LINES_PER_PAGE = 10;
const BEATS_PER_PAGE = BEATS_PER_LINE * LINES_PER_PAGE;
const TOTAL_NOTES = 15;

// --- 색상 정의 ---
export const NOTE_COLORS = {
  default: { fill: '#63b3ed', stroke: '#4299e1', id: 'default' },
  half: { fill: '#f56565', stroke: '#c53030', id: 'half' },
  two: { fill: '#f6e05e', stroke: '#d69e2e', id: 'two' },
  three: { fill: '#f6ad55', stroke: '#dd6b20', id: 'three' },
  four: { fill: '#48bb78', stroke: '#2f855a', id: 'four' },
};

// --- 헬퍼 함수 ---
const createNote = () => ({ isActive: false, colorId: 'default' });
const createBeat = () => Array.from({ length: TOTAL_NOTES }, createNote);

const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

// --- 컴포넌트 ---
export default function SheetMusicEditor({ sheetData, setSheetData }) {
  const [currentColorId, setCurrentColorId] = useState('default');
  const [selectedBeatIndex, setSelectedBeatIndex] = useState(null);

  const toggleNote = (beatIndex, noteIndex) => {
    setSelectedBeatIndex(beatIndex);
    setSheetData(currentSheetData => {
      const newSheetData = currentSheetData.map(beat => beat.map(note => ({ ...note })));
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
    setSelectedBeatIndex(null);
  };

  const insertBeatAfter = (beatIndex) => {
    setSheetData(currentSheetData => {
      const newSheetData = [...currentSheetData];
      newSheetData.splice(beatIndex + 1, 0, createBeat());
      return newSheetData;
    });
  };

  const addBeat = () => {
    setSheetData(currentSheetData => [...currentSheetData, createBeat()]);
  };

  const addLine = () => {
    const newLine = Array.from({ length: BEATS_PER_LINE }, createBeat);
    setSheetData(currentSheetData => [...currentSheetData, ...newLine]);
  };

  const pages = chunkArray(sheetData, BEATS_PER_PAGE);
  const totalPageCount = Math.max(1, pages.length);
  
  // 1페이지에 해당하는 시트들 (항상 존재)
  const firstPageBeats = pages[0] || [];

  return (
    <div className={styles.editorWrapper} onClick={(e) => {
      if (!e.target.closest(`.${styles.beatWrapper}`)) {
        setSelectedBeatIndex(null);
      }
    }}>
      {/* 1페이지 렌더링 */}
      <div className={`${styles.page} page`}>
        <div className={styles.sheetGrid}>
          {firstPageBeats.map((beat, beatIndexInPage) => {
            const globalIndex = beatIndexInPage;
            return (
              <div
                key={globalIndex}
                className={styles.beatWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={styles.beatColumn}
                  onClick={() => setSelectedBeatIndex(globalIndex)}
                >
                  <div className={styles.noteGrid}>
                    {beat.map((note, noteIndex) => (
                      <NoteButton
                        key={noteIndex}
                        noteIndex={noteIndex}
                        isActive={note.isActive}
                        color={NOTE_COLORS[note.colorId] || NOTE_COLORS.default}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNote(globalIndex, noteIndex);
                        }}
                      />
                    ))}
                  </div>
                </div>
                {selectedBeatIndex === globalIndex && (
                  <div className={styles.beatControls}>
                    <button onClick={(e) => { e.stopPropagation(); insertBeatAfter(globalIndex); }}>+</button>
                    <button onClick={(e) => { e.stopPropagation(); deleteBeat(globalIndex); }}>-</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.pageFooter}>
          <span>1 / {totalPageCount}</span>
        </div>
        {totalPageCount === 1 && (
          <div className={`${styles.sourceLink} sourceLink`}>
            Made with Sky Music Editor at https://korea-sky-planner.com/
          </div>
        )}
      </div>

      {/* 2페이지 이상 렌더링 */}
      {pages.slice(1).map((pageBeats, pageIndex) => {
        const actualPageIndex = pageIndex + 1;
        return (
          <div key={actualPageIndex} className={`${styles.page} page`}>
            <div className={styles.sheetGrid}>
              {pageBeats.map((beat, beatIndexInPage) => {
                const globalIndex = actualPageIndex * BEATS_PER_PAGE + beatIndexInPage;
                return (
                  <div
                    key={globalIndex}
                    className={styles.beatWrapper}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={styles.beatColumn}
                      onClick={() => setSelectedBeatIndex(globalIndex)}
                    >
                      <div className={styles.noteGrid}>
                        {beat.map((note, noteIndex) => (
                          <NoteButton
                            key={noteIndex}
                            noteIndex={noteIndex}
                            isActive={note.isActive}
                            color={NOTE_COLORS[note.colorId] || NOTE_COLORS.default}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNote(globalIndex, noteIndex);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    {selectedBeatIndex === globalIndex && (
                      <div className={styles.beatControls}>
                        <button onClick={(e) => { e.stopPropagation(); insertBeatAfter(globalIndex); }}>+</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteBeat(globalIndex); }}>-</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.pageFooter}>
              <span>{actualPageIndex + 1} / {totalPageCount}</span>
            </div>
            {actualPageIndex === totalPageCount - 1 && (
              <div className={`${styles.sourceLink} sourceLink`}>
                Made with Sky Music Editor at https://korea-sky-planner.com/
              </div>
            )}
          </div>
        );
      })}

      <div className={styles.bottomControls} onClick={(e) => e.stopPropagation()}>
        <button onClick={addBeat} className={styles.addButton}>+1 시트 추가</button>
        <button onClick={addLine} className={styles.addButton}>+1 줄 추가</button>
      </div>
      <div className={styles.paletteContainer} onClick={(e) => e.stopPropagation()}>
        <ColorPalette selectedColor={currentColorId} onColorSelect={setCurrentColorId} />
      </div>
    </div>
  );
}
