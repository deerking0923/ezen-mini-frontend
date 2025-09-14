'use client';

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";
// === 수정: NOTE_COLORS를 import하여 범례에서 사용 ===
import SheetMusicEditor, { NOTE_COLORS } from "@/app/components/SheetMusicEditor";
import styles from "./page.module.css";

// === 추가: colorLegendData 변수 선언 ===
const colorLegendData = [
  { id: 'half', name: '1/2박' }, { id: 'default', name: '정음표' },
  { id: 'two', name: '2박' }, { id: 'three', name: '3박' }, { id: 'four', name: '4박' },
];

export default function SkyMusicEditorPage() {
  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [arranger, setArranger] = useState("");
  const [sheetData, setSheetData] = useState(() => {
    const createNote = () => ({ isActive: false, colorId: "default" });
    const createBeat = () => Array.from({ length: 15 }, createNote);
    return Array.from({ length: 18 }, createBeat);
  });

  const fileInputRef = useRef(null);

  const handleSave = () => {
    const saveData = { title, composer, arranger, sheetData };
    const jsonString = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "sky-sheet"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event) => {
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

  const handleDownload = async () => {
    const infoForm = document.getElementById("info-form");
    const pageElements = Array.from(document.querySelectorAll(".page"));

    if (!infoForm || pageElements.length === 0) {
      return alert("오류: 캡처할 대상을 찾을 수 없습니다.");
    }

    alert(
      "다운로드를 시작합니다. 시간이 조금 걸릴 수도 있습니다. ㅠㅔ이지를 벗어나지 마세요."
    );

    const zip = new JSZip();
    const mainContentWidth = document.getElementById(
      "main-content-to-capture"
    ).offsetWidth;

    const captureContainer = document.createElement("div");
    captureContainer.style.position = "absolute";
    captureContainer.style.left = "-9999px";
    captureContainer.style.top = "0px";
    document.body.appendChild(captureContainer);

    try {
      for (let i = 0; i < pageElements.length; i++) {
        captureContainer.innerHTML = "";

        const pageWrapper = document.createElement("div");
        pageWrapper.style.width = `${mainContentWidth}px`;
        pageWrapper.style.padding = "2rem";
        pageWrapper.style.background = "#f7fafc";

        if (i === 0) {
          pageWrapper.appendChild(infoForm.cloneNode(true));
        }

        const currentPageClone = pageElements[i].cloneNode(true);
        const sourceLink = currentPageClone.querySelector(".sourceLink");

        if (i === pageElements.length - 1 && sourceLink) {
          sourceLink.style.display = "block";
        }

        pageWrapper.appendChild(currentPageClone);
        captureContainer.appendChild(pageWrapper);

        const canvas = await html2canvas(pageWrapper, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );

        zip.file(`악보_${i + 1}페이지.png`, blob);
      }
    } catch (error) {
      console.error("캡처 중 오류 발생:", error);
      alert("죄송합니다. 악보 캡처 중 오류가 발생했습니다.");
    } finally {
      document.body.removeChild(captureContainer);
    }

    if (Object.keys(zip.files).length > 0) {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "전체악보.zip";
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>🎵 Sky Music Editor</h1>
        <p>자신만의 스카이 악보를 만들어 보세요.</p>
      </header>

      <div className={styles.loadSection}>
        <button
          onClick={() => fileInputRef.current.click()}
          className={styles.actionButton}
        >
          악보 파일 불러오기
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".json"
          onChange={handleFileChange}
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
            {colorLegendData.map((item) => (
              <div key={item.id} className={styles.legendItem}>
                <span
                  className={styles.legendColorChip}
                  style={{ backgroundColor: NOTE_COLORS[item.id].fill }}
                ></span>
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
        <button onClick={handleSave} className={styles.actionButton}>
          악보 저장
        </button>
        <button onClick={handleDownload} className={styles.downloadButton}>
          전체 악보 다운로드 (ZIP)
        </button>
      </div>
    </main>
  );
}