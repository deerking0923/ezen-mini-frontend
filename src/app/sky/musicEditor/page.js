'use client';

import React, { useState, useRef, useEffect } from 'react';
import SheetMusicEditor, { NOTE_COLORS } from '@/app/components/SheetMusicEditor';
import MusicPlayer from '@/app/components/MusicPlayer';
import FloatingPalette from '@/app/components/FloatingPalette';
import styles from './page.module.css';
import { useTxtConverter } from '@/app/hooks/useTxtConverter';
import { useSheetDownloader } from '@/app/hooks/useSheetDownloader';
import { useMusicPlayer } from '@/app/hooks/useMusicPlayer';

// 1. 언어별 텍스트 데이터를 모두 이곳에서 관리합니다.
const translations = {
  ko: {
    mainTitle: '🎵 Sky Music Editor',
    subtitle: '자신만의 악보를 만들어보세요! _ 만든이 진사슴',
    madeBy: 'made by 단풍잎',
    guideTitle: '사용 안내',
    guideItems: [
      '플래너 악보와 Sky Studio 악보 모두 사용 가능합니다.',
      '플래너 악보로 저장 시 박자 색깔까지 함께 저장됩니다. 박자 표시가 있다면 플래너 악보로 저장해주세요!',
      'Sky Studio 악보는 모두 1박으로 변환됩니다. 단일 악기 악보만 호환이 됩니다.',
      '악보 저장 시 기기 내 [최신 파일]이나 [다운로드] 폴더 등에서 파일을 찾을 수 있습니다.',
      '캡처 모드에서 악보를 한 페이지씩 이미지로 저장할 수 있습니다.',
      '악보를 다 만들기 전까지 새로고침을 피해주세요! 중간중간 악보를 저장하시길 권장드립니다.',
    ],
    loadPlanner: '플래너 악보 불러오기 (JSON)',
    savePlanner: '플래너 악보로 저장하기 (JSON)',
    loadSkyStudio: 'Sky Studio 악보 가져오기 (TXT)',
    saveSkyStudio: 'Sky Studio 악보로 만들기 (TXT)',
    toEditor: '✏️ 에디터로 돌아가기',
    toCapture: '📷 캡처 모드로 전환',
    linesPerPage: '페이지 당 줄:',
    beatsPerLine: '줄 당 비트:',
    prevPage: '이전',
    nextPage: '다음',
    downloadPage: '현재 페이지 다운로드 (PNG)',
    capturing: '캡처 중...',
    downloadProgress: (page) => `악보 ${page}페이지 캡처 중...`,
    playSheet: '▶︎ 악보 연주하기',
    sheetHeader: '스카이 플래너 악보 에디터',
    sheetTitlePlaceholder: '악보 제목',
    composer: '원작자',
    arranger: '제작자',
    alertLoadSuccess: '악보를 성공적으로 불러왔습니다.',
    alertInvalidFile: '오류: 유효하지 않은 파일입니다.',
    alertTxtSuccess: 'TXT 파일을 악보로 성공적으로 변환했습니다.',
    alertInvalidTxt: (error) => `오류: ${error || '유효하지 않은 TXT 파일입니다.'}`,
    colorLegend: [
      { id: 'half', name: '½박' },
      { id: 'default', name: '1박' },
      { id: 'two', name: '2박' },
      { id: 'three', name: '3박' },
      { id: 'four', name: '4박' },
    ],
  },
  en: {
    mainTitle: '🎵 Sky Music Editor',
    subtitle: 'Create your own Sky music sheet _ made by RealDeer',
    madeBy: 'made by 단풍잎',
    guideTitle: 'User Guide',
    guideItems: [
      'Both Planner and Sky Studio sheets are supported.',
      'When saving as a Planner sheet, beat colors are saved. Please use this format if you use custom beat colors!',
      'Sky Studio sheets are converted to 1-beat notes. Only single-instrument sheets are compatible.',
      'Saved files can be found in your device\'s "Recent files" or "Downloads" folder.',
      'You can save the sheet music page by page as an image in Capture Mode.',
      'Please avoid refreshing the page before you are done! We recommend saving your work periodically.',
    ],
    loadPlanner: 'Load Planner Sheet (JSON)',
    savePlanner: 'Save as Planner Sheet (JSON)',
    loadSkyStudio: 'Import Sky Studio Sheet (TXT)',
    saveSkyStudio: 'Export as Sky Studio Sheet (TXT)',
    toEditor: '✏️ Back to Editor',
    toCapture: '📷 Switch to Capture Mode',
    linesPerPage: 'Lines/Page:',
    beatsPerLine: 'Beats/Line:',
    prevPage: 'Prev',
    nextPage: 'Next',
    downloadPage: 'Download Current Page (PNG)',
    capturing: 'Capturing...',
    downloadProgress: (page) => `Capturing page ${page} of the sheet...`,
    playSheet: '▶︎ Play Sheet Music',
    sheetHeader: 'Sky Planner Sheet Editor',
    sheetTitlePlaceholder: 'Sheet Title',
    composer: 'Composer',
    arranger: 'Arranger',
    alertLoadSuccess: 'Sheet loaded successfully.',
    alertInvalidFile: 'Error: Invalid file.',
    alertTxtSuccess: 'Successfully converted TXT file to sheet.',
    alertInvalidTxt: (error) => `Error: ${error || 'Invalid TXT file.'}`,
    colorLegend: [
        { id: 'half', name: '½ Beat' },
        { id: 'default', name: '1 Beat' },
        { id: 'two', name: '2 Beats' },
        { id: 'three', name: '3 Beats' },
        { id: 'four', name: '4 Beats' },
    ],
  },
};

export default function SkyMusicEditorPage() {
    const [language, setLanguage] = useState('ko'); // 2. 언어 상태 관리
    const t = translations[language]; // 현재 언어의 텍스트 객체
    const colorLegendData = t.colorLegend; // 언어에 따라 범례 데이터 변경

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
    const [currentColorId, setCurrentColorId] = useState('default');
    const [beatsPerLine, setBeatsPerLine] = useState(6);
    const [linesPerPage, setLinesPerPage] = useState(10);

    const beatElementsRef = useRef([]);
    const jsonFileInputRef = useRef(null);
    const txtFileInputRef = useRef(null);

    const { txtToSheet } = useTxtConverter();
    const { handleSave, handleDownloadTxt, handleDownloadPage } = useSheetDownloader(title, composer, arranger, sheetData);
    
    const { isPlaying, bpm, currentBeat, setBpm, handlePlayPause, handleBeatClick, scrollerRef } = useMusicPlayer(sheetData, beatElementsRef);
    
    const BEATS_PER_PAGE = beatsPerLine * linesPerPage;
    const totalPages = Math.ceil(sheetData.length / BEATS_PER_PAGE) || 1;

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

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
                alert(t.alertLoadSuccess);
            } catch (error) {
                alert(t.alertInvalidFile);
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
                alert(t.alertTxtSuccess);
            } else {
                alert(t.alertInvalidTxt(result.error));
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    };
    
    const onDownloadPageClick = async () => {
        setIsDownloading(true);
        setDownloadMessage(t.downloadProgress(currentPage));
        await handleDownloadPage(currentPage);
        setIsDownloading(false);
        setDownloadMessage('');
    };

    return (
        <main className={styles.main}>
            {/* 3. 언어 토글 버튼 UI */}
            <div className={styles.languageToggleContainer}>
                <button onClick={() => setLanguage('ko')} className={language === 'ko' ? styles.activeLang : ''}>한국어</button>
                <span>/</span>
                <button onClick={() => setLanguage('en')} className={language === 'en' ? styles.activeLang : ''}>English</button>
            </div>

            <header className={styles.header}>
                <div className={styles.headerTitleContainer}>
                    <div className={styles.headerTitle}>
                        <h1 className={styles.title}>{t.mainTitle}</h1>
                    </div>
                    <p className={styles.headerSubtitle}>{t.subtitle}</p>
                </div>
                <div className={styles.skyStudioLinks}>
                    <button className={styles.skyStudioButton} onClick={() => window.open('https://play.google.com/store/apps/details?id=com.Maple.SkyStudio&pli=1', '_blank')} disabled={isDownloading}>
                        Sky Studio Android
                    </button>
                    <button className={styles.skyStudioButton} onClick={() => window.open('https://apps.apple.com/us/app/sky-studio/id1522241329', '_blank')} disabled={isDownloading}>
                        Sky Studio iOS
                    </button>
                    <span className={styles.madeByText}>{t.madeBy}</span>
                </div>
            </header>

            <div className={styles.noticePanel}>
                <div className={styles.noticeHeader}>
                    <span className={styles.noticeIcon}>💡</span>
                    {t.guideTitle}
                </div>
                <ul className={styles.noticeList}>
                    {t.guideItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            
            <div className={styles.topActionSection} onClick={() => setSelectedBeatIndex(null)}>
                <div className={styles.buttonGroupWrapper}>
                    <div className={styles.buttonGroup}>
                        <button onClick={(e) => { e.stopPropagation(); jsonFileInputRef.current.click(); }} className={styles.actionButton} disabled={isDownloading}>
                            {t.loadPlanner}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className={styles.actionButton} disabled={isDownloading}>
                            {t.savePlanner}
                        </button>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button onClick={(e) => { e.stopPropagation(); txtFileInputRef.current.click(); }} className={styles.actionButton} disabled={isDownloading}>
                            {t.loadSkyStudio}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDownloadTxt(); }} className={styles.actionButton} disabled={isDownloading}>
                            {t.saveSkyStudio}
                        </button>
                    </div>
                </div>

                <div className={styles.modeButtonsContainer}>
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
                        {isCaptureMode ? t.toEditor : t.toCapture}
                    </button>
                    
                    <div className={styles.selectWrapper}>
                        <label htmlFor="linesPerPageSelect">{t.linesPerPage}</label>
                        <select
                            id="linesPerPageSelect"
                            value={linesPerPage}
                            onChange={(e) => setLinesPerPage(Number(e.target.value))}
                            className={styles.selectBox}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 3} value={i + 3}>{i + 3}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.selectWrapper}>
                        <label htmlFor="beatsPerLineSelect">{t.beatsPerLine}</label>
                        <select
                            id="beatsPerLineSelect"
                            value={beatsPerLine}
                            onChange={(e) => setBeatsPerLine(Number(e.target.value))}
                            className={styles.selectBox}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                        </select>
                    </div>
                </div>

                {isCaptureMode ? (
                    <div className={styles.captureControls}>
                        <div className={styles.pagination}>
                            <button onClick={(e) => { e.stopPropagation(); handlePrevPage(); }} disabled={currentPage <= 1 || isDownloading}>{t.prevPage}</button>
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
                            <button onClick={(e) => { e.stopPropagation(); handleNextPage(); }} disabled={currentPage >= totalPages || isDownloading}>{t.nextPage}</button>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onDownloadPageClick(); }} className={styles.downloadButton} disabled={isDownloading}>
                            {isDownloading ? t.capturing : t.downloadPage}
                        </button>
                    </div>
                ) : (
                    <div className={styles.playerOpenButtonContainer}>
                        <button onClick={(e) => { e.stopPropagation(); setIsPlayerVisible(true); }} className={styles.playerOpenButton}>
                            {t.playSheet}
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
                        <p className={styles.sheetHeader}>{t.sheetHeader}</p>
                        <input type="text" className={styles.titleInput} placeholder={t.sheetTitlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} disabled={isDownloading || isPlaying} />
                        <div className={styles.colorLegend}>
                            {colorLegendData.map(item => (
                                <div key={item.id} className={styles.legendItem}>
                                    <span className={styles.legendColorChip} style={{ backgroundColor: NOTE_COLORS[item.id].fill }}></span>
                                    {item.name}
                                </div>
                            ))}
                        </div>
                        <div className={styles.metaInputs}>
                            <label><b>{t.composer}</b> <input type="text" value={composer} onChange={(e) => setComposer(e.target.value)} disabled={isDownloading || isPlaying} /></label>
                            <label><b>{t.arranger}</b> <input type="text" value={arranger} onChange={(e) => setArranger(e.target.value)} disabled={isDownloading || isPlaying} /></label>
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
                        currentColorId={currentColorId}
                        setCurrentColorId={setCurrentColorId}
                        beatsPerLine={beatsPerLine}
                        linesPerPage={linesPerPage}
                    />
                </div>
            </div>
            
            {isPlayerVisible && (
                <MusicPlayer sheetData={sheetData} title={title} onClose={() => setIsPlayerVisible(false)} />
            )}

            <FloatingPalette
                selectedBeatIndex={selectedBeatIndex}
                colorLegendData={colorLegendData}
                currentColorId={currentColorId}
                setCurrentColorId={setCurrentColorId}
            />
        </main>
    );
}