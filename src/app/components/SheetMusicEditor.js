'use client';

import React, { useState } from 'react';
import NoteButton from './NoteButton';
import ColorPalette from './ColorPalette';
import styles from './SheetMusicEditor.module.css';

const BEATS_PER_LINE = 6;
const LINES_PER_PAGE = 10;
const BEATS_PER_PAGE = BEATS_PER_LINE * LINES_PER_PAGE;
const TOTAL_NOTES = 15;

export const NOTE_COLORS = {
    default: { fill: '#63b3ed', stroke: '#4299e1', id: 'default' },
    half: { fill: '#f56565', stroke: '#c53030', id: 'half' },
    two: { fill: '#f6e05e', stroke: '#d69e2e', id: 'two' },
    three: { fill: '#f6ad55', stroke: '#dd6b20', id: 'three' },
    four: { fill: '#48bb78', stroke: '#2f855a', id: 'four' },
};

const createNote = () => ({ isActive: false, colorId: 'default' });
const createBeat = () => Array.from({ length: TOTAL_NOTES }, createNote);

const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

export default function SheetMusicEditor({
    sheetData,
    setSheetData,
    isPlaying,
    currentBeat,
    onBeatClick,
    beatElementsRef,
    isCaptureMode = false,
    currentPage = 1,
    // --- ◀◀ Props로 상태를 전달받음 ---
    selectedBeatIndex,
    setSelectedBeatIndex,
}) {
    const [currentColorId, setCurrentColorId] = useState('default');
    
    // --- ◀◀ 자체 상태 관리 제거 ---
    // const [selectedBeatIndex, setSelectedBeatIndex] = useState(null);

    const toggleNote = (beatIndex, noteIndex) => {
        setSelectedBeatIndex(beatIndex);
        setSheetData(currentSheetData => {
            const newSheetData = [...currentSheetData.map(beat => [...beat.map(note => ({...note}))])];
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
    
    // --- ◀◀ 1줄 없애기 기능 ---
    const removeLine = () => {
        if (sheetData.length > BEATS_PER_LINE) {
            setSheetData(currentSheetData => currentSheetData.slice(0, currentSheetData.length - BEATS_PER_LINE));
        }
        setSelectedBeatIndex(null);
    };

    const handleColorSelect = (colorId) => {
        setCurrentColorId(colorId);
        setSelectedBeatIndex(null);
    };

    const pages = chunkArray(sheetData, BEATS_PER_PAGE);
    const totalPageCount = Math.max(1, pages.length);

    const pagesToRender = isCaptureMode
        ? (pages[currentPage - 1] ? [pages[currentPage - 1]] : [])
        : pages;
    
    const renderPageContent = (beats, pageIndex) => {
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
                                    if (onBeatClick) onBeatClick(globalIndex);
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
                {actualPageIndex === totalPageCount - 1 && (
                    <div className={`${styles.sourceLink} sourceLink`}>
                        Made with Sky Music Editor at https://korea-sky-planner.com/
                    </div>
                )}
            </div>
        );
    };

    return (
        // --- ◀◀ 클릭 시 비트 선택 해제 ---
        <div className={styles.editorWrapper} onClick={() => setSelectedBeatIndex(null)}>
            {pagesToRender.map((pageBeats, index) => renderPageContent(pageBeats, index))}
            
            {!isCaptureMode && (
                <>
                    <div className={styles.bottomControls} onClick={(e) => e.stopPropagation()}>
                        <button onClick={addBeat} className={styles.addButton}>1 시트 추가</button>
                        <button onClick={addLine} className={styles.addButton}>1 줄 추가</button>
                        {/* --- ◀◀ 1줄 없애기 버튼 추가 --- */}
                        <button 
                            onClick={removeLine} 
                            className={styles.addButton} 
                            disabled={sheetData.length <= BEATS_PER_LINE}
                        >
                            1줄 없애기
                        </button>
                    </div>
                    <div className={styles.paletteContainer} onClick={(e) => e.stopPropagation()}>
                        <ColorPalette selectedColor={currentColorId} onColorSelect={handleColorSelect} />
                    </div>
                </>
            )}
        </div>
    );
}