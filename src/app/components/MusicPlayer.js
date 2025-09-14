'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NOTE_COLORS } from './SheetMusicEditor';
import NoteButton from './NoteButton';
import styles from './MusicPlayer.module.css';

export default function MusicPlayer({ sheetData, title, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const scrollerRef = useRef(null);
  const beatElementsRef = useRef([]);
  const beatHighlightTimerRef = useRef(null);

  const secondsPerBeat = 60 / bpm;

  // 하이라이트 및 자동 스크롤 타이머 로직
  useEffect(() => {
    if (beatHighlightTimerRef.current) {
      clearInterval(beatHighlightTimerRef.current);
    }

    if (isPlaying) {
      const startBeat = currentBeat === -1 ? 0 : currentBeat;
      // 재생 시작 시 즉시 첫 비트 하이라이트
      setCurrentBeat(startBeat);

      // 일정 간격으로 다음 비트로 이동
      beatHighlightTimerRef.current = setInterval(() => {
        setCurrentBeat(prev => {
          const nextBeat = prev + 1;
          if (nextBeat >= sheetData.length) {
            setIsPlaying(false);
            return -1;
          }
          return nextBeat;
        });
      }, secondsPerBeat * 1000);
    }
    
    return () => clearInterval(beatHighlightTimerRef.current);
  }, [isPlaying, secondsPerBeat, sheetData.length, currentBeat]);


  // currentBeat가 변경될 때마다 해당 위치로 부드럽게 스크롤
  useEffect(() => {
    if (currentBeat >= 0 && scrollerRef.current && isPlaying) {
      const targetNode = beatElementsRef.current[currentBeat];
      if (targetNode) {
        scrollerRef.current.scrollTo({
          left: targetNode.offsetLeft - scrollerRef.current.offsetWidth / 2 + targetNode.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentBeat, isPlaying]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleBeatClick = (index) => {
    // 재생 중이 아닐 때만 시작 지점 변경 가능
    if (!isPlaying) {
      setCurrentBeat(index);
      const scroller = scrollerRef.current;
      const targetNode = beatElementsRef.current[index];
      if (scroller && targetNode) {
        // 클릭 시에는 즉시 이동
        scroller.scrollTo({
          left: targetNode.offsetLeft - scroller.offsetWidth / 2 + targetNode.offsetWidth / 2,
          behavior: 'auto', // 'instant' 대신 'auto'가 더 자연스러울 수 있음
        });
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.playerContainer}>
        <div className={styles.header}>
          <h2>{title || '악보 연주'}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.scroller} ref={scrollerRef}>
          <div className={styles.focusLine}></div>
          <div className={styles.sheetTrack}>
            {sheetData.map((beat, index) => (
              <div 
                key={index}
                ref={el => beatElementsRef.current[index] = el}
                className={`${styles.beatColumn} ${currentBeat === index ? styles.active : ''}`}
                onClick={() => handleBeatClick(index)}
              >
                <div className={styles.noteGrid}>
                  {beat.map((note, noteIndex) => (
                    <NoteButton
                      key={noteIndex}
                      noteIndex={noteIndex}
                      isActive={note.isActive}
                      color={NOTE_COLORS[note.colorId] || NOTE_COLORS.default}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <button onClick={handlePlayPause} className={styles.playButton}>
            {isPlaying ? '■' : '▶︎'}
          </button>
          <div className={styles.bpmControl}>
            <label>BPM: {bpm}</label>
            <input 
              type="range" 
              min="40" 
              max="240" 
              value={bpm}
              onChange={(e) => {
                if (!isPlaying) setBpm(Number(e.target.value));
              }}
              disabled={isPlaying}
            />
          </div>
        </div>
      </div>
    </div>
  );
}