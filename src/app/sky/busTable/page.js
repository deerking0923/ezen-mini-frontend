"use client";
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import styles from './busTable.module.css';
import { mainRoute, seasonMaps, guideCategories, translations } from './busTableData';

const themes = {
  blue: {
    background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 60%, #38bdf8 100%)',
    border: '#0ea5e9',
    title: '#1e40af',
    mainBorder: '#3b82f6',
    selected: '#3b82f6',
    selectedText: '#1e40af',
    line: '#60a5fa'
  },
  red: {
    background: 'linear-gradient(180deg, #fee2e2 0%, #fecaca 30%, #fca5a5 60%, #f87171 100%)',
    border: '#ef4444',
    title: '#991b1b',
    mainBorder: '#dc2626',
    selected: '#dc2626',
    selectedText: '#991b1b',
    line: '#f87171'
  },
  yellow: {
    background: 'linear-gradient(180deg, #fef9c3 0%, #fef08a 30%, #fde047 60%, #facc15 100%)',
    border: '#eab308',
    title: '#854d0e',
    mainBorder: '#ca8a04',
    selected: '#ca8a04',
    selectedText: '#854d0e',
    line: '#fde047'
  },
  green: {
    background: 'linear-gradient(180deg, #d1f5d3 0%, #b5ebb7 30%, #8fe08f 60%, #6dd66f 100%)',
    border: '#4ade80',
    title: '#166534',
    mainBorder: '#22c55e',
    selected: '#22c55e',
    selectedText: '#166534',
    line: '#4ade80'
  },
  purple: {
    background: 'linear-gradient(180deg, #e9d5ff 0%, #d8b4fe 30%, #c084fc 60%, #a855f7 100%)',
    border: '#a855f7',
    title: '#6b21a8',
    mainBorder: '#9333ea',
    selected: '#9333ea',
    selectedText: '#6b21a8',
    line: '#c084fc'
  }
};

export default function BusTable() {
  const [language, setLanguage] = useState('ko');
  const [theme, setTheme] = useState('blue');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [introduction, setIntroduction] = useState('');
  
  const captureRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = translations[language];
  const currentRoute = mainRoute[language];
  const currentSeasonMaps = seasonMaps[language];
  const currentCategories = guideCategories[language];
  const currentTheme = themes[theme];

  const toggleLocation = (id) => {
    setSelectedLocations(prev => 
      prev.includes(id) 
        ? prev.filter(locId => locId !== id)
        : [...prev, id]
    );
  };

  const toggleOption = (categoryId, itemId, value, isMultiple) => {
    const key = `${categoryId}_${itemId}`;
    
    setSelectedOptions(prev => {
      const currentValues = prev[key] || [];
      
      if (isMultiple) {
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [key]: currentValues.filter(v => v !== value)
          };
        } else {
          return {
            ...prev,
            [key]: [...currentValues, value]
          };
        }
      } else {
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [key]: []
          };
        } else {
          return {
            ...prev,
            [key]: [value]
          };
        }
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!captureRef.current) return;
    
    try {
      window.scrollTo(0, 0);
      
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0,10);
      link.download = `Sky_Bus_Route_${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      {/* 언어 전환 & 테마 선택 버튼 */}
      <div className={styles.topControls}>
        <div className={styles.languageToggleContainer}>
          <button 
            onClick={() => setLanguage('ko')} 
            className={language === 'ko' ? styles.activeLang : ''}
          >
            한국어
          </button>
          <span>/</span>
          <button 
            onClick={() => setLanguage('en')} 
            className={language === 'en' ? styles.activeLang : ''}
          >
            English
          </button>
        </div>

        <div className={styles.colorSelector}>
          <span className={styles.colorLabel}>테마:</span>
          <button 
            className={`${styles.colorButton} ${theme === 'blue' ? styles.activeColor : ''}`}
            onClick={() => setTheme('blue')}
            style={{ background: 'linear-gradient(135deg, #bae6fd, #38bdf8)' }}
          />
          <button 
            className={`${styles.colorButton} ${theme === 'red' ? styles.activeColor : ''}`}
            onClick={() => setTheme('red')}
            style={{ background: 'linear-gradient(135deg, #fecaca, #f87171)' }}
          />
          <button 
            className={`${styles.colorButton} ${theme === 'yellow' ? styles.activeColor : ''}`}
            onClick={() => setTheme('yellow')}
            style={{ background: 'linear-gradient(135deg, #fef08a, #facc15)' }}
          />
          <button 
            className={`${styles.colorButton} ${theme === 'green' ? styles.activeColor : ''}`}
            onClick={() => setTheme('green')}
            style={{ background: 'linear-gradient(135deg, #bef264, #84cc16)' }}
          />
          <button 
            className={`${styles.colorButton} ${theme === 'purple' ? styles.activeColor : ''}`}
            onClick={() => setTheme('purple')}
            style={{ background: 'linear-gradient(135deg, #d8b4fe, #a855f7)' }}
          />
        </div>
      </div>

      <div 
        ref={captureRef} 
        className={styles.captureArea} 
        style={{ 
          background: currentTheme.background,
          borderColor: currentTheme.border
        }}
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title} style={{ color: currentTheme.title }}>{t.title}</h1>
          
          <div className={styles.profileSection}>
            <div 
              className={styles.profileImageWrapper}
              onClick={() => fileInputRef.current?.click()}
              style={{ borderColor: currentTheme.mainBorder }}
            >
              {profileImage ? (
                <img src={profileImage} alt="프로필" className={styles.profileImage} />
              ) : (
                <span className={styles.profilePlaceholder}>👤</span>
              )}
            </div>
            <div className={styles.profileInfo}>
              <label className={styles.profileLabel}>{t.driverLabel}</label>
              <input
                type="text"
                className={styles.profileInput}
                placeholder={t.driverPlaceholder}
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                style={{ color: currentTheme.title }}
              />
              <input
                type="text"
                className={styles.profileIntro}
                placeholder={t.introPlaceholder}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.hiddenFileInput}
            />
          </div>
        </div>

        {/* 메인 노선도 */}
        <div className={styles.routeSection} style={{ borderColor: currentTheme.mainBorder }}>
          <div className={styles.routeMap}>
            {/* 노선 연결선 */}
            <style jsx>{`
              .${styles.routeMap}::before {
                background: ${currentTheme.line} !important;
              }
            `}</style>
            
            {currentRoute.map((location) => {
              const isMainSelected = selectedLocations.includes(location.id);
              
              return (
                <div key={location.id} className={styles.locationWrapper}>
                  <div
                    className={`${styles.mainLocation} ${
                      isMainSelected ? styles.mainLocationSelected : ''
                    }`}
                    onClick={() => toggleLocation(location.id)}
                    style={{
                      borderColor: isMainSelected ? currentTheme.selected : currentTheme.mainBorder,
                      backgroundColor: isMainSelected ? currentTheme.selected : 'white',
                      color: isMainSelected ? 'white' : currentTheme.title
                    }}
                  >
                    {isMainSelected && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                    <div>{location.icon}</div>
                    <div>{location.name}</div>
                  </div>
                  
                  {location.subLocations.length > 0 && (
                    <div className={styles.subLocations}>
                      {location.subLocations.map((sub) => {
                        const isSubSelected = selectedLocations.includes(sub.id);
                        
                        return (
                          <div
                            key={sub.id}
                            className={`${styles.subLocation} ${
                              isSubSelected ? styles.subLocationSelected : ''
                            }`}
                            onClick={() => toggleLocation(sub.id)}
                            style={{
                              borderColor: isSubSelected ? currentTheme.selected : '#cbd5e1',
                              backgroundColor: isSubSelected ? currentTheme.selected : 'white',
                              color: isSubSelected ? 'white' : '#64748b'
                            }}
                          >
                            {sub.name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 시즌맵 */}
          <div className={styles.seasonMapSection}>
            <div className={styles.seasonMapTitle}>
              {t.seasonMapTitle}
            </div>
            <div className={styles.seasonMapList}>
              {currentSeasonMaps.map((map) => {
                const isSelected = selectedLocations.includes(map.id);
                
                return (
                  <div
                    key={map.id}
                    className={`${styles.seasonMapItem} ${
                      isSelected ? styles.seasonMapItemSelected : ''
                    }`}
                    onClick={() => toggleLocation(map.id)}
                  >
                    {map.icon} {map.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 옵션 영역 */}
        <div className={styles.optionsWrapper}>
          {/* 안내 사항 */}
          <div className={styles.categorySection}>
            <h2 className={styles.categoryTitle} style={{ color: currentTheme.title }}>
              {currentCategories.info.title}
            </h2>
            <div className={styles.optionsGrid}>
              {currentCategories.info.items.map((item) => (
                <div key={item.id} className={styles.optionGroup}>
                  <div className={styles.optionHeader} style={{ color: currentTheme.title }}>
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <div className={styles.optionButtons}>
                    {item.options.map((opt, index) => {
                      const key = `info_${item.id}`;
                      const isSelected = selectedOptions[key]?.includes(opt);
                      
                      return (
                        <button
                          key={index}
                          className={`${styles.optionButton} ${
                            isSelected ? styles.optionButtonSelected : ''
                          }`}
                          onClick={() => toggleOption('info', item.id, opt, item.multiple)}
                          style={{
                            backgroundColor: isSelected ? currentTheme.selected : '#f1f5f9',
                            borderColor: isSelected ? currentTheme.selectedText : '#cbd5e1',
                            color: isSelected ? 'white' : '#64748b'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 모두의 에티켓 */}
          <div className={styles.categorySection}>
            <h2 className={styles.categoryTitle} style={{ color: currentTheme.title }}>
              {currentCategories.etiquette.title}
            </h2>
            <div className={styles.optionsGrid}>
              {currentCategories.etiquette.items.map((item) => (
                <div key={item.id} className={styles.optionGroup}>
                  <div className={styles.optionHeader} style={{ color: currentTheme.title }}>
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  {item.fixed ? (
                    <div className={styles.fixedMessage}></div>
                  ) : (
                    <div className={styles.optionButtons}>
                      {item.options.map((opt, index) => {
                        const key = `etiquette_${item.id}`;
                        const isSelected = selectedOptions[key]?.includes(opt);
                        
                        return (
                          <button
                            key={index}
                            className={`${styles.optionButton} ${
                              isSelected ? styles.optionButtonSelected : ''
                            }`}
                            onClick={() => toggleOption('etiquette', item.id, opt, true)}
                            style={{
                              backgroundColor: isSelected ? currentTheme.selected : '#f1f5f9',
                              borderColor: isSelected ? currentTheme.selectedText : '#cbd5e1',
                              color: isSelected ? 'white' : '#64748b'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 다운로드 버튼 */}
      <div className={styles.downloadSection}>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          {t.downloadButton}
        </button>
      </div>
    </div>
  );
}