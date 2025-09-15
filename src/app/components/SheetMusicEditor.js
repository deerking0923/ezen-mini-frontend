'use client';

import React, { useState, Fragment } from 'react';
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
// --- isCaptureMode와 currentPage props 추가 ---
export default function SheetMusicEditor({
    sheetData,
    setSheetData,
    isPlaying,
    currentBeat,
    onBeatClick,
    beatElementsRef,
    isCaptureMode = false,
    currentPage = 1,
}) {
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
        setSelectedBeatIndex(null);
    };

    const addLine = () => {
        const newLine = Array.from({ length: BEATS_PER_LINE }, createBeat);
        setSheetData(currentSheetData => [...currentSheetData, ...newLine]);
        setSelectedBeatIndex(null);
    };

    const handleColorSelect = (colorId) => {
        setCurrentColorId(colorId);
        setSelectedBeatIndex(null);
    };

    const pages = chunkArray(sheetData, BEATS_PER_PAGE);
    const totalPageCount = Math.max(1, pages.length);

    // --- 캡처 모드에 따라 렌더링할 페이지 결정 ---
    const pagesToRender = isCaptureMode
        ? pages[currentPage - 1] ? [pages[currentPage - 1]] : []
        : pages;
    
    const renderPageContent = (beats, pageIndex) => {
        // 캡처 모드에서는 pageIndex가 항상 0이므로, 실제 페이지 번호는 currentPage prop을 사용
        const actualPageIndex = isCaptureMode ? currentPage - 1 : pageIndex;

        return (
            <div key={actualPageIndex} className={`${styles.page} page`}>
                <div className={styles.sheetGrid}>
                    {beats.map((beat, beatIndexInPage) => {
                        const globalIndex = actualPageIndex * BEATS_PER_PAGE + beatIndexInPage;
                        const isCurrentlyPlaying = !isCaptureMode && isPlaying && currentBeat === globalIndex;
                        const beatWrapperClass = `${styles.beatWrapper} ${isCurrentlyPlaying ? styles.playing : ''}`;

                        return (
                            <div
                                key={globalIndex}
                                className={beatWrapperClass}
                                onClick={(e) => {
                                    if (isCaptureMode) return;
                                    e.stopPropagation();
                                    setSelectedBeatIndex(globalIndex);
                                    onBeatClick(globalIndex);
                                }}
                                ref={el => {
                                    if (beatElementsRef && beatElementsRef.current) {
                                        beatElementsRef.current[globalIndex] = el;
                                    }
                                }}
                            >
                                <div className={styles.beatColumn}>
                                    <div className={styles.noteGrid}>
                                        {beat.map((note, noteIndex) => (
                                            <NoteButton
                                                key={noteIndex}
                                                noteIndex={noteIndex}
                                                isActive={note.isActive}
                                                color={NOTE_COLORS[note.colorId] || NOTE_COLORS.default}
                                                onClick={(e) => {
                                                    if (isCaptureMode) return;
                                                    e.stopPropagation();
                                                    toggleNote(globalIndex, noteIndex);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {!isCaptureMode && selectedBeatIndex === globalIndex && (
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
                {/* 마지막 페이지만 출처 표시 */}
                {actualPageIndex === totalPageCount - 1 && (
                    <div className={`${styles.sourceLink} sourceLink`}>
                        Made with Sky Music Editor at https://korea-sky-planner.com/
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.editorWrapper} onClick={(e) => {
            if (!e.target.closest(`.${styles.beatWrapper}`)) {
                setSelectedBeatIndex(null);
            }
        }}>
            {pagesToRender.map((pageBeats, index) => renderPageContent(pageBeats, index))}
            
            {/* 에디터 모드일 때만 추가 버튼과 팔레트 표시 */}
            {!isCaptureMode && (
                <>
                    <div className={styles.bottomControls} onClick={(e) => e.stopPropagation()}>
                        <button onClick={addBeat} className={styles.addButton}>+1 시트 추가</button>
                        <button onClick={addLine} className={styles.addButton}>+1 줄 추가</button>
                    </div>
                    <div className={styles.paletteContainer} onClick={(e) => e.stopPropagation()}>
                        <ColorPalette selectedColor={currentColorId} onColorSelect={handleColorSelect} />
                    </div>
                </>
            )}
        </div>
    );
}