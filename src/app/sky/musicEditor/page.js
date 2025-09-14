'use client';

import React from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import SheetMusicEditor from '@/app/components/SheetMusicEditor';
import styles from './page.module.css';

export default function SkyMusicEditorPage() {

  const handleDownload = async () => {
    const infoForm = document.getElementById('info-form');
    // .page 클래스는 SheetMusicEditor 내부에 있습니다.
    const pageElements = Array.from(document.querySelectorAll('.page'));
    
    if (!infoForm || pageElements.length === 0) {
      return alert('오류: 캡처할 대상을 찾을 수 없습니다.');
    }

    // === 수정: 알림창 문구 변경 ===
    alert('다운로드를 시작합니다. 시간이 조금 오래 걸릴 수도 있습니다.');

    const zip = new JSZip();
    const mainContentWidth = document.getElementById('main-content-to-capture').offsetWidth;

    // 캡처를 위한 보이지 않는 임시 컨테이너 생성
    const captureContainer = document.createElement('div');
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    captureContainer.style.top = '0px';
    document.body.appendChild(captureContainer);

    try {
      for (let i = 0; i < pageElements.length; i++) {
        // 매번 임시 컨테이너를 비우고 새로 구성
        captureContainer.innerHTML = '';
        
        const pageWrapper = document.createElement('div');
        pageWrapper.style.width = `${mainContentWidth}px`;
        pageWrapper.style.padding = '2rem';
        pageWrapper.style.background = '#f7fafc';

        // 1페이지일 경우, 정보란(복제본)과 첫 페이지(복제본)를 함께 넣음
        if (i === 0) {
          pageWrapper.appendChild(infoForm.cloneNode(true));
        }
        
        const currentPageClone = pageElements[i].cloneNode(true);
        const sourceLink = currentPageClone.querySelector('.sourceLink');

        // 마지막 페이지인 경우, 출처 표시
        if (i === pageElements.length - 1 && sourceLink) {
          sourceLink.style.display = 'block';
        }
        
        pageWrapper.appendChild(currentPageClone);
        captureContainer.appendChild(pageWrapper);

        const canvas = await html2canvas(pageWrapper, { 
          scale: 2, 
          useCORS: true,
          backgroundColor: null, // pageWrapper의 배경색을 사용
        });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        zip.file(`악보_${i + 1}페이지.png`, blob);
      }
    } catch (error) {
      console.error("캡처 중 오류 발생:", error);
      alert("죄송합니다. 악보 캡처 중 오류가 발생했습니다.");
    } finally {
      // 임시 컨테이너 반드시 제거
      document.body.removeChild(captureContainer);
    }

    if (Object.keys(zip.files).length > 0) {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = '전체악보.zip';
      link.click();
      URL.revokeObjectURL(link.href);
      // === 수정: 완료 알림창 제거 ===
    }
  };

  return (
    <main className={styles.main}>
      <div id="main-content-to-capture">
        <header className={styles.header}>
          <h1>🎵 Sky Music Editor</h1>
          <p>자신만의 스카이 악보를 만들어 보세요.</p>
        </header>
        
        <div id="info-form" className={styles.infoForm}>
          <input type="text" className={styles.titleInput} placeholder="악보 제목" />
          <div className={styles.metaInputs}>
            <label><b>원작자</b> <input type="text" /></label>
            <label><b>제작자</b> <input type="text" /></label>
          </div>
        </div>
        
        <SheetMusicEditor />
      </div>
      
      <div className={styles.downloadSection}>
        <button onClick={handleDownload} className={styles.downloadButton}>
          전체 악보 다운로드 (ZIP)
        </button>
      </div>
    </main>
  );
}