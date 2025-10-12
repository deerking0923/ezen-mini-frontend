"use client";
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import styles from './busTable.module.css';
import { mainRoute, seasonMaps, guideCategories } from './busTableData';

export default function BusTable() {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [introduction, setIntroduction] = useState('');
  
  const captureRef = useRef(null);
  const fileInputRef = useRef(null);

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
      link.download = `스카이_양작노선표_${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div ref={captureRef} className={styles.captureArea}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>🚌 스카이 양작 노선표</h1>
          
          <div className={styles.profileSection}>
            <div 
              className={styles.profileImageWrapper}
              onClick={() => fileInputRef.current?.click()}
            >
              {profileImage ? (
                <img src={profileImage} alt="프로필" className={styles.profileImage} />
              ) : (
                <span className={styles.profilePlaceholder}>👤</span>
              )}
            </div>
            <div className={styles.profileInfo}>
              <label className={styles.profileLabel}>버스 기사</label>
              <input
                type="text"
                className={styles.profileInput}
                placeholder="이름 입력"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
              <input
                type="text"
                className={styles.profileIntro}
                placeholder="자기소개 한마디"
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
        <div className={styles.routeSection}>
          <div className={styles.routeMap}>
            {mainRoute.map((location) => {
              const isMainSelected = selectedLocations.includes(location.id);
              
              return (
                <div key={location.id} className={styles.locationWrapper}>
                  <div
                    className={`${styles.mainLocation} ${
                      isMainSelected ? styles.mainLocationSelected : ''
                    }`}
                    onClick={() => toggleLocation(location.id)}
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
              ✨ 시즌맵
            </div>
            <div className={styles.seasonMapList}>
              {seasonMaps.map((map) => {
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
            <h2 className={styles.categoryTitle}>
              {guideCategories.info.title}
            </h2>
            <div className={styles.optionsGrid}>
              {guideCategories.info.items.map((item) => (
                <div key={item.id} className={styles.optionGroup}>
                  <div className={styles.optionHeader}>
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
            <h2 className={styles.categoryTitle}>
              {guideCategories.etiquette.title}
            </h2>
            <div className={styles.optionsGrid}>
              {guideCategories.etiquette.items.map((item) => (
                <div key={item.id} className={styles.optionGroup}>
                  <div className={styles.optionHeader}>
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
          📥다운로드
        </button>
      </div>
    </div>
  );
}