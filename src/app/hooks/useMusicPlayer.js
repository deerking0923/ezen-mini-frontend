// src/app/hooks/useMusicPlayer.js
import { useState, useEffect, useRef } from 'react';

export const useMusicPlayer = (sheetData, beatElementsRef) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(100);
    const [currentBeat, setCurrentBeat] = useState(-1);
    
    const beatHighlightTimerRef = useRef(null);
    const scrollerRef = useRef(null);
    const secondsPerBeat = 60 / bpm;

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
    }, [currentBeat, isPlaying, beatElementsRef]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    
    const handleBeatClick = (index) => {
        setCurrentBeat(index);
        setIsPlaying(true);
        const scroller = scrollerRef.current;
        const targetNode = beatElementsRef.current[index];
        if (scroller && targetNode) {
            scroller.scrollTo({
                left: targetNode.offsetLeft - scroller.offsetWidth / 2 + targetNode.offsetWidth / 2,
                behavior: 'auto',
            });
        }
    };

    return {
        isPlaying,
        bpm,
        currentBeat,
        setBpm,
        handlePlayPause,
        handleBeatClick,
        scrollerRef
    };
};