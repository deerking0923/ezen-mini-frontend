'use client';

import React, { useState, useRef } from 'react';
import SheetMusicEditor, { NOTE_COLORS } from '@/app/components/SheetMusicEditor';
import MusicPlayer from '@/app/components/MusicPlayer';
import styles from './page.module.css';
import { useTxtConverter } from '@/app/hooks/useTxtConverter';
import { useSheetDownloader } from '@/app/hooks/useSheetDownloader';

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

    const jsonFileInputRef = useRef(null);
    const txtFileInputRef = useRef(null);

    // 모듈화된 훅 사용
    const { txtToSheet } = useTxtConverter();
    const { handleSave, handleDownloadTxt, handleDownloadZip } = useSheetDownloader(title, composer, arranger, sheetData);

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

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>🎵 Sky Music Editor</h1>
                <p>자신만의 스카이 악보를 만들어 보세요.</p>
            </header>

            <div className={styles.topActionSection}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => jsonFileInputRef.current.click()}
                            className={styles.actionButton}
                        >
                            플래너 악보 불러오기 (JSON)
                        </button>
                        <button onClick={handleSave} className={styles.actionButton}>
                            플래너 악보로 저장하기 (JSON)
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => txtFileInputRef.current.click()}
                            className={styles.actionButton}
                        >
                            Sky Studio 악보 가져오기 (TXT)
                        </button>
                        <button
                            onClick={() => handleDownloadTxt()}
                            className={styles.actionButton}
                        >
                            Sky Studio 악보로 만들기 (TXT)
                        </button>
                    </div>
                </div>
                <button onClick={() => setIsPlayerVisible(true)} className={styles.playerOpenButton}>
                    ▶︎ 악보 연주하기
                </button>
                <input
                    type="file"
                    ref={jsonFileInputRef}
                    style={{ display: "none" }}
                    accept=".json"
                    onChange={handleJsonFileChange}
                />
                <input
                    type="file"
                    ref={txtFileInputRef}
                    style={{ display: "none" }}
                    accept=".txt"
                    onChange={handleTxtFileChange}
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
                            />
                        </label>
                        <label>
                            <b>제작자</b>{" "}
                            <input
                                type="text"
                                value={arranger}
                                onChange={(e) => setArranger(e.target.value)}
                            />
                        </label>
                    </div>
                </div>

                <SheetMusicEditor sheetData={sheetData} setSheetData={setSheetData} />
            </div>

            <div className={styles.bottomActionSection}>
                <button onClick={handleDownloadZip} className={styles.downloadButton}>
                    전체 악보 다운로드 (ZIP)
                </button>
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