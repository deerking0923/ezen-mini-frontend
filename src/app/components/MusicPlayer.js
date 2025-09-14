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

  // --- 드래그 및 모멘텀 스크롤을 위한 Refs ---
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastMoveTimeRef = useRef(0);
  const lastMoveXRef = useRef(0);
  // ---

  const secondsPerBeat = 60 / bpm;

  // 하이라이트 및 자동 스크롤 타이머 로직
  useEffect(() => {
    if (beatHighlightTimerRef.current) {
      clearInterval(beatHighlightTimerRef.current);
    }

    if (isPlaying) {
      const startBeat = currentBeat === -1 ? 0 : currentBeat;
      setCurrentBeat(startBeat);

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
    if (currentBeat >= 0 && scrollerRef.current && isPlaying && !isDraggingRef.current) {
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
    if (!isPlaying) {
      setCurrentBeat(index);
      const scroller = scrollerRef.current;
      const targetNode = beatElementsRef.current[index];
      if (scroller && targetNode) {
        scroller.scrollTo({
          left: targetNode.offsetLeft - scroller.offsetWidth / 2 + targetNode.offsetWidth / 2,
          behavior: 'auto',
        });
      }
    }
  };

  // --- 드래그 및 모멘텀 스크롤 로직 ---

  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const handleDragStart = (e) => {
    isDraggingRef.current = true;
    startXRef.current = getClientX(e);
    scrollLeftRef.current = scrollerRef.current.scrollLeft;
    velocityRef.current = 0;
    lastMoveTimeRef.current = performance.now();
    lastMoveXRef.current = startXRef.current;

    // 진행 중인 모멘텀 애니메이션 중지
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    // 드래그 시작 시 자동 재생 중지
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const handleDragMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault(); // 드래그 중 텍스트 선택 등 기본 동작 방지

    const x = getClientX(e);
    const walk = (x - startXRef.current) * 1.5; // 드래그 감도 조절 (1.5배)
    scrollerRef.current.scrollLeft = scrollLeftRef.current - walk;

    // 속도 계산
    const now = performance.now();
    const deltaTime = now - lastMoveTimeRef.current;
    const deltaX = x - lastMoveXRef.current;
    
    if (deltaTime > 0) {
      velocityRef.current = (deltaX / deltaTime) * 1.5; // 속도에도 감도 적용
    }
    
    lastMoveTimeRef.current = now;
    lastMoveXRef.current = x;
  };
  
  const momentumLoop = () => {
    if (!scrollerRef.current || Math.abs(velocityRef.current) < 0.1) {
      velocityRef.current = 0;
      return;
    }
    
    scrollerRef.current.scrollLeft -= velocityRef.current * 16; // 16ms(60fps) 간격으로 이동
    velocityRef.current *= 0.95; // 마찰력 (값이 1에 가까울수록 오래 미끄러짐)
    
    animationFrameRef.current = requestAnimationFrame(momentumLoop);
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    // 모멘텀 애니메이션 시작
    if (Math.abs(velocityRef.current) > 0.5) {
      animationFrameRef.current = requestAnimationFrame(momentumLoop);
    }
  };

  // ---

  return (
    <div className={styles.overlay}>
      <div className={styles.playerContainer}>
        <div className={styles.header}>
          <h2>{title || '악보 연주'}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div 
          className={styles.scroller} 
          ref={scrollerRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
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