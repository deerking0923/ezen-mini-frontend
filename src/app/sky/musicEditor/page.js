'use client';

import React, { useState, useRef, useEffect } from 'react';
import SheetMusicEditor, { NOTE_COLORS } from '@/app/components/SheetMusicEditor';
import MusicPlayer from '@/app/components/MusicPlayer';
import styles from './page.module.css';
import { useTxtConverter } from '@/app/hooks/useTxtConverter';
import { useSheetDownloader } from '@/app/hooks/useSheetDownloader';
import { useMusicPlayer } from '@/app/hooks/useMusicPlayer';

// 색상 범례 데이터
const colorLegendData = [
    { id: 'half', name: '1/2박' },
    { id: 'default', name: '정음표' },
    { id: 'two', name: '2박' },
    { id: 'three', name: '3박' },
    { id: 'four', name: '4박' },
];

export default function SkyMusicEditorPage() {
    const [title, setTitle] = useState('');
    const [composer, setComposer] = useState('');
    const [arranger, setArranger] = useState('');
    const [sheetData, setSheetData] = useState(() => {
        const createNote = () => ({ isActive: false, colorId: "default" });
        const createBeat = () => Array.from({ length: 15 }, createNote);
        return Array.from({ length: 18 }, createBeat);
    });
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadMessage, setDownloadMessage] = useState('');
    
    const beatElementsRef = useRef([]);
    const jsonFileInputRef = useRef(null);
    const txtFileInputRef = useRef(null);

    const { txtToSheet } = useTxtConverter();
    const { handleSave, handleDownloadTxt, handleDownloadZip } = useSheetDownloader(title, composer, arranger, sheetData);
    
    const { isPlaying, bpm, currentBeat, setBpm, handlePlayPause, handleBeatClick, scrollerRef } = useMusicPlayer(sheetData, beatElementsRef);

    const handleJsonFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);
                setTitle(loadedData.title || "");
                setComposer(loadedData.composer || "");
                setArranger(loadedData.arranger || "");
                setSheetData(loadedData.sheetData || []);
                alert("악보를 성공적으로 불러왔습니다.");
            } catch (error) {
                alert("오류: 유효하지 않은 파일입니다.");
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    };

    const handleTxtFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = txtToSheet(e.target.result);
            if (result.success) {
                const { title, composer, arranger, sheetData } = result.data;
                setTitle(title);
                setComposer(composer);
                setArranger(arranger);
                setSheetData(sheetData);
                alert("TXT 파일을 악보로 성공적으로 변환했습니다.");
            } else {
                alert("오류: 유효하지 않은 TXT 파일입니다.");
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    };

    const onDownloadZipClick = () => {
        setIsDownloading(true);
        setDownloadProgress(0);
        setDownloadMessage('준비 중...');

        handleDownloadZip(({ progress, message }) => {
            if (message) setDownloadMessage(message);
            if (progress) setDownloadProgress(progress);
        }).finally(() => {
            setIsDownloading(false);
            setDownloadProgress(0);
            setDownloadMessage('');
        });
    };

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerTitleContainer}>
                    <div className={styles.headerTitle}>
                        <h1 className={styles.title}>🎵 Sky Music Editor</h1>
                        <span className={styles.madeByText}>made by 진사슴</span>
                    </div>
                    <p className={styles.headerSubtitle}>자신만의 스카이 악보를 만들어 보세요.</p>
                </div>
                <div className={styles.skyStudioLinks}>
                    <button className={styles.skyStudioButton} onClick={() => window.open('https://play.google.com/store/apps/details?id=com.Maple.SkyStudio&pli=1', '_blank')} disabled={isDownloading}>
                        Sky Studio Android
                    </button>
                    <button className={styles.skyStudioButton} onClick={() => window.open('https://apps.apple.com/us/app/sky-studio/id1522241329', '_blank')} disabled={isDownloading}>
                        Sky Studio iOS
                    </button>
                    <span className={styles.madeByText}>made by 단풍잎</span>
                </div>
            </header>

            {/* **새롭게 추가된 공지 패널** */}
            <div className={styles.noticePanel}>
                <p>
                    ⚠️ 10페이지 이상 악보 이미지 저장(ZIP) 작업은 PC에서 이용 바랍니다. <br />
                    (JSON이나 TXT 저장은 모바일에서도 정상 작동합니다.)
                </p>
                <p>
                    20페이지가 넘어가는 캡처는 [화면 응답 버튼]이 뜨면 [대기]를 누르고 잠시만 기다려주세요. <br />
                    (대략 20분 소요될 수 있습니다. 그 이상은 나누어 작업 바랍니다.)
                </p>
            </div>

            <div className={styles.topActionSection}>
                <div className={styles.buttonGroupWrapper}>
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={() => jsonFileInputRef.current.click()}
                            className={styles.actionButton}
                            disabled={isDownloading}
                        >
                            플래너 악보 불러오기 (JSON)
                        </button>
                        <button onClick={handleSave} className={styles.actionButton} disabled={isDownloading}>
                            플래너 악보로 저장하기 (JSON)
                        </button>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={() => txtFileInputRef.current.click()}
                            className={styles.actionButton}
                            disabled={isDownloading}
                        >
                            Sky Studio 악보 가져오기 (TXT)
                        </button>
                        <button
                            onClick={() => handleDownloadTxt()}
                            className={styles.actionButton}
                            disabled={isDownloading}
                        >
                            Sky Studio 악보로 만들기 (TXT)
                        </button>
                    </div>
                </div>
                <button onClick={onDownloadZipClick} className={styles.downloadButton} disabled={isDownloading}>
                    {isDownloading ? `다운로드 중... ${Math.round(downloadProgress)}%` : '전체 악보 다운로드 (ZIP)'}
                </button>
                {isDownloading && (
                    <div className={styles.downloadProgressContainer}>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${downloadProgress}%` }}></div>
                        </div>
                        <span className={styles.progressMessage}>{downloadMessage}</span>
                    </div>
                )}
                <input
                    type="file"
                    ref={jsonFileInputRef}
                    style={{ display: "none" }}
                    accept=".json"
                    onChange={handleJsonFileChange}
                    disabled={isDownloading}
                />
                <input
                    type="file"
                    ref={txtFileInputRef}
                    style={{ display: "none" }}
                    accept=".txt"
                    onChange={handleTxtFileChange}
                    disabled={isDownloading}
                />
            </div>

            <div id="main-content-to-capture">
                <div id="info-form" className={styles.infoForm}>
                    <input
                        type="text"
                        className={styles.titleInput}
                        placeholder="악보 제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isDownloading}
                    />
                    <div className={styles.colorLegend}>
                        {colorLegendData.map(item => (
                            <div key={item.id} className={styles.legendItem}>
                                <span className={styles.legendColorChip} style={{ backgroundColor: NOTE_COLORS[item.id].fill }}></span>
                                {item.name}
                            </div>
                        ))}
                    </div>
                    <div className={styles.metaInputs}>
                        <label>
                            <b>원작자</b>{" "}
                            <input
                                type="text"
                                value={composer}
                                onChange={(e) => setComposer(e.target.value)}
                                disabled={isDownloading}
                            />
                        </label>
                        <label>
                            <b>제작자</b>{" "}
                            <input
                                type="text"
                                value={arranger}
                                onChange={(e) => setArranger(e.target.value)}
                                disabled={isDownloading}
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.sheetContainer} ref={scrollerRef}>
                    <SheetMusicEditor
                        sheetData={sheetData}
                        setSheetData={setSheetData}
                        isPlaying={isPlaying}
                        currentBeat={currentBeat}
                        onBeatClick={handleBeatClick}
                        beatElementsRef={beatElementsRef}
                    />
                </div>
            </div>
                
            <div className={styles.bottomActionSection}>
                <div className={styles.musicControlsContainer}>
                    <div className={styles.musicControls}>
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
                                onChange={(e) => setBpm(Number(e.target.value))}
                                disabled={isPlaying}
                            />
                        </div>
                    </div>
                    <div className={styles.playerOpenButtonContainer}>
                        <button onClick={() => setIsPlayerVisible(true)} className={styles.playerOpenButton}>
                            ▶︎ 악보 연주하기
                        </button>
                    </div>
                </div>
            </div>

            {isPlayerVisible && (
                <MusicPlayer
                    sheetData={sheetData}
                    title={title}
                    onClose={() => setIsPlayerVisible(false)}
                />
            )}
        </main>
    );
}