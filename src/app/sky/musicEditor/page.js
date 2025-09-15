'use client';

import React, { useState, useRef, useEffect } from 'react';
import SheetMusicEditor, { NOTE_COLORS } from '@/app/components/SheetMusicEditor';
import MusicPlayer from '@/app/components/MusicPlayer';
import FloatingPalette from '@/app/components/FloatingPalette'; // 새로 만든 팔레트 import
import styles from './page.module.css';
import { useTxtConverter } from '@/app/hooks/useTxtConverter';
import { useSheetDownloader } from '@/app/hooks/useSheetDownloader';
import { useMusicPlayer } from '@/app/hooks/useMusicPlayer';

const BEATS_PER_LINE = 6;
const LINES_PER_PAGE = 10;
const BEATS_PER_PAGE = BEATS_PER_LINE * LINES_PER_PAGE;

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
    const [downloadMessage, setDownloadMessage] = useState('');
    const [isCaptureMode, setIsCaptureMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBeatIndex, setSelectedBeatIndex] = useState(null);

    const beatElementsRef = useRef([]);
    const jsonFileInputRef = useRef(null);
    const txtFileInputRef = useRef(null);

    const { txtToSheet } = useTxtConverter();
    const { handleSave, handleDownloadTxt, handleDownloadPage } = useSheetDownloader(title, composer, arranger, sheetData);
    
    const { isPlaying, bpm, currentBeat, setBpm, handlePlayPause, handleBeatClick, scrollerRef } = useMusicPlayer(sheetData, beatElementsRef);
    
    const totalPages = Math.ceil(sheetData.length / BEATS_PER_PAGE) || 1;

    const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    
    const handlePageInputChange = (e) => {
        const value = e.target.value;
        if (value === '') { setCurrentPage(''); return; }
        const pageNum = parseInt(value, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };
    const handlePageInputBlur = (e) => { if (e.target.value === '') setCurrentPage(1); };

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
    
    const onDownloadPageClick = async () => {
        setIsDownloading(true);
        setDownloadMessage(`악보 ${currentPage}페이지 캡처 중...`);
        await handleDownloadPage(currentPage);
        setIsDownloading(false);
        setDownloadMessage('');
    };

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerTitleContainer}>
                    <div className={styles.headerTitle}>
                        <h1 className={styles.title}>🎵 Sky Music Editor</h1>
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

            <div className={styles.noticePanel}>
                <div className={styles.noticeHeader}>
                    <span className={styles.noticeIcon}>💡</span>
                    사용 안내
                </div>
                <ul className={styles.noticeList}>
                    <li>플래너 악보와 Sky Studio 악보 모두 사용 가능합니다. PC 작업 환경에 맞추어져 있습니다.</li>
                    <li>플래너 악보로 저장 시 박자 색깔까지 함께 저장됩니다. 박자 표시가 있다면 플래너 악보로 저장해주세요!</li>
                    <li>Sky Studio 악보는 모두 정음표로 변환됩니다. 단일 악기 악보만 호환이 됩니다.</li>
                    <li>악보 저장 시 기기 내 [최신 파일]이나 [다운로드] 폴더 등에서 파일을 찾을 수 있습니다.</li>
                    <li>캡처 모드에서 악보를 한 페이지씩 이미지로 저장할 수 있습니다.</li>
                    <li>악보를 다 만들기 전까지 새로고침을 피해주세요! 중간중간 악보를 저장하시길 권장드립니다.</li>
                </ul>
            </div>
            
            <div className={styles.topActionSection} onClick={() => setSelectedBeatIndex(null)}>
                <div className={styles.buttonGroupWrapper}>
                    <div className={styles.buttonGroup}>
                        <button onClick={(e) => { e.stopPropagation(); jsonFileInputRef.current.click(); }} className={styles.actionButton} disabled={isDownloading}>
                            플래너 악보 불러오기 (JSON)
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className={styles.actionButton} disabled={isDownloading}>
                            플래너 악보로 저장하기 (JSON)
                        </button>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button onClick={(e) => { e.stopPropagation(); txtFileInputRef.current.click(); }} className={styles.actionButton} disabled={isDownloading}>
                            Sky Studio 악보 가져오기 (TXT)
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDownloadTxt(); }} className={styles.actionButton} disabled={isDownloading}>
                            Sky Studio 악보로 만들기 (TXT)
                        </button>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsCaptureMode(!isCaptureMode);
                        setCurrentPage(1);
                        setSelectedBeatIndex(null);
                    }}
                    className={styles.modeToggleButton}
                    disabled={isDownloading}
                >
                    {isCaptureMode ? '✏️ 에디터로 돌아가기' : '📷 캡처 모드로 전환'}
                </button>

                {isCaptureMode ? (
                    <div className={styles.captureControls}>
                        <div className={styles.pagination}>
                            <button onClick={(e) => { e.stopPropagation(); handlePrevPage(); }} disabled={currentPage <= 1 || isDownloading}>이전</button>
                            <span className={styles.pageInfo}>
                                <input
                                    type="text" value={currentPage}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={handlePageInputChange} onBlur={handlePageInputBlur}
                                    className={styles.pageInput}
                                    disabled={isDownloading}
                                />
                                / {totalPages}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); handleNextPage(); }} disabled={currentPage >= totalPages || isDownloading}>다음</button>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onDownloadPageClick(); }} className={styles.downloadButton} disabled={isDownloading}>
                            {isDownloading ? `캡처 중...` : `현재 페이지 다운로드 (PNG)`}
                        </button>
                    </div>
                ) : (
                    <div className={styles.playerOpenButtonContainer}>
                        <button onClick={(e) => { e.stopPropagation(); setIsPlayerVisible(true); }} className={styles.playerOpenButton}>
                            ▶︎ 악보 연주하기
                        </button>
                    </div>
                )}
                
                {isDownloading && (
                    <div className={styles.downloadProgressContainer}>
                        <span className={styles.progressMessage}>{downloadMessage}</span>
                    </div>
                )}
                
                <input type="file" ref={jsonFileInputRef} style={{ display: "none" }} accept=".json" onChange={handleJsonFileChange} disabled={isDownloading} />
                <input type="file" ref={txtFileInputRef} style={{ display: "none" }} accept=".txt" onChange={handleTxtFileChange} disabled={isDownloading} />
            </div>

            <div id="main-content-to-capture">
                {isCaptureMode && currentPage === 1 && (
                    <div className={styles.captureHeader}></div>
                )}

                {(!isCaptureMode || (isCaptureMode && currentPage === 1)) && (
                    <div id="info-form" className={styles.infoForm}>
                        <p className={styles.sheetHeader}>스카이 플래너 악보 에디터</p>
                        <input type="text" className={styles.titleInput} placeholder="악보 제목" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isDownloading || isPlaying} />
                        <div className={styles.colorLegend}>
                            {colorLegendData.map(item => (
                                <div key={item.id} className={styles.legendItem}>
                                    <span className={styles.legendColorChip} style={{ backgroundColor: NOTE_COLORS[item.id].fill }}></span>
                                    {item.name}
                                </div>
                            ))}
                        </div>
                        <div className={styles.metaInputs}>
                            <label><b>원작자</b> <input type="text" value={composer} onChange={(e) => setComposer(e.target.value)} disabled={isDownloading || isPlaying} /></label>
                            <label><b>제작자</b> <input type="text" value={arranger} onChange={(e) => setArranger(e.target.value)} disabled={isDownloading || isPlaying} /></label>
                        </div>
                    </div>
                )}

                <div className={isCaptureMode ? '' : styles.sheetContainer} ref={scrollerRef}>
                    <SheetMusicEditor
                        sheetData={sheetData} setSheetData={setSheetData}
                        isPlaying={isPlaying} currentBeat={currentBeat}
                        onBeatClick={handleBeatClick} beatElementsRef={beatElementsRef}
                        isCaptureMode={isCaptureMode} currentPage={currentPage}
                        selectedBeatIndex={selectedBeatIndex} setSelectedBeatIndex={setSelectedBeatIndex}
                    />
                </div>
            </div>
            
            {isPlayerVisible && (
                <MusicPlayer sheetData={sheetData} title={title} onClose={() => setIsPlayerVisible(false)} />
            )}

            {/* ▼▼▼ 이 부분이 핵심입니다 ▼▼▼ */}
            <FloatingPalette
                selectedBeatIndex={selectedBeatIndex}
                sheetData={sheetData}
                setSheetData={setSheetData}
                colorLegendData={colorLegendData}
            />
        </main>
    );
}