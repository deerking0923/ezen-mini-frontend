'use client';

import React, { useState } from 'react';
import { NOTE_COLORS } from './SheetMusicEditor';
import styles from './FloatingPalette.module.css';

export default function FloatingPalette({ 
    selectedBeatIndex, 
    colorLegendData,
    currentColorId,      // 부모로부터 현재 색상 ID를 받음
    setCurrentColorId    // 부모의 색상 변경 함수를 받음
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    // 이제 이 팔레트는 부모의 색상 상태를 변경하는 역할만 합니다.
    const handleColorChange = (colorId) => {
        setCurrentColorId(colorId);
    };

    // 음표가 아닌 "비트(Beat)"가 선택되었을 때만 팔레트를 표시합니다.
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
            
            {isExpanded && (
                <div className={styles.paletteBody}>
                    {colorLegendData.map(item => (
                        // 현재 선택된 색상에 'selected' 스타일을 적용하여 시각적으로 표시
                        <button 
                            key={item.id} 
                            className={`${styles.colorButton} ${currentColorId === item.id ? styles.selected : ''}`} 
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

// FloatingPalette.module.css에 아래 스타일을 추가해주세요.
/*
.colorButton.selected {
    border-color: #3182ce;
    background-color: #ebf8ff;
    font-weight: bold;
}
*/