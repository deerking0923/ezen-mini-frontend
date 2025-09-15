'use client';

import React, { useState } from 'react'; // 't,' 부분을 삭제했습니다.
import { NOTE_COLORS } from './SheetMusicEditor';
import styles from './FloatingPalette.module.css';

// 이 컴포넌트는 선택된 음표의 박자를 바꾸는 역할만 합니다.
export default function FloatingPalette({ 
    selectedBeatIndex, 
    sheetData, 
    setSheetData, 
    colorLegendData 
}) {
    // 팔레트를 접고 펼치기 위한 상태
    const [isExpanded, setIsExpanded] = useState(true);

    // 색상 변경 로직
    const handleColorChange = (colorId) => {
        if (selectedBeatIndex === null) return;

        const { beatIndex, noteIndex } = selectedBeatIndex;
        const newData = JSON.parse(JSON.stringify(sheetData)); // 데이터 깊은 복사
        newData[beatIndex][noteIndex].colorId = colorId;
        setSheetData(newData);
    };

    // 선택된 음표가 없으면 팔레트를 표시하지 않습니다.
    if (selectedBeatIndex === null) {
        return null;
    }

    return (
        <div className={styles.paletteContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.paletteHeader}>
                <span>🎨 박자 변경</span>
                <button onClick={() => setIsExpanded(!isExpanded)} className={styles.toggleButton}>
                    {isExpanded ? '숨기기' : '펼치기'}
                </button>
            </div>
            
            {/* isExpanded 상태가 true일 때만 색상 선택 버튼들을 보여줍니다. */}
            {isExpanded && (
                <div className={styles.paletteBody}>
                    {colorLegendData.map(item => (
                        <button 
                            key={item.id} 
                            className={styles.colorButton} 
                            onClick={() => handleColorChange(item.id)}
                        >
                            <span 
                                className={styles.colorChip} 
                                style={{ backgroundColor: NOTE_COLORS[item.id].fill }}
                            ></span>
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}