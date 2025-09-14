// src/app/hooks/useSheetDownloader.js
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

export const useSheetDownloader = (title, composer, arranger, sheetData) => {

    // JSON 데이터를 TXT 파일 형식으로 변환하는 함수
    const convertJsonToTxt = () => {
        try {
            // 여기서는 BPM과 비트 정보를 알 수 없으므로, 기본값을 사용합니다.
            // 실제 프로젝트에서는 이 정보도 UI에서 입력받아야 합니다.
            const bpm = 500;
            const bitsPerPage = 16;
            const msPerBeat = 60000 / bpm;

            const songNotes = [];
            sheetData.forEach((beat, beatIndex) => {
                beat.forEach((note, keyIndex) => {
                    if (note.isActive) {
                        const time = Math.round(beatIndex * msPerBeat);
                        const key = `1Key${keyIndex}`; // 레이어 정보가 없으므로 1로 고정
                        songNotes.push({ time, key });
                    }
                });
            });

            const txtData = {
                name: title,
                author: composer,
                transcribedBy: arranger,
                isComposed: true,
                bpm,
                bitsPerPage,
                pitchLevel: 8,
                isEncrypted: false,
                songNotes,
            };

            const txtString = JSON.stringify([txtData], null, 2);
            return txtString;

        } catch (e) {
            console.error("JSON to TXT conversion error:", e);
            return null;
        }
    };

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

    const handleDownloadTxt = () => {
        const txtString = convertJsonToTxt();
        if (txtString) {
            const blob = new Blob([txtString], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${title || "sky-sheet"}.txt`;
            link.click();
            URL.revokeObjectURL(url);
        } else {
            alert("TXT 파일 변환에 실패했습니다.");
        }
    };
    
    const handleDownloadZip = async () => {
        const infoForm = document.getElementById("info-form");
        const pageElements = Array.from(document.querySelectorAll(".page"));

        if (!infoForm || pageElements.length === 0) {
            return alert("오류: 캡처할 대상을 찾을 수 없습니다.");
        }

        const isConfirmed = window.confirm(
            "다운로드를 시작하시겠습니까? 시간이 조금 오래 걸릴 수도 있습니다."
        );
        if (!isConfirmed) return;

        const zip = new JSZip();
        const mainContentWidth = document.getElementById("main-content-to-capture").offsetWidth;

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
            alert("악보 다운로드가 완료되었습니다!");
        }
    };

    return { handleSave, handleDownloadTxt, handleDownloadZip };
};