// src/app/hooks/useSheetDownloader.js
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

export const useSheetDownloader = (title, composer, arranger, sheetData) => {

    const convertJsonToTxt = () => {
        try {
            const bpm = 500;
            const bitsPerPage = 16;
            const msPerBeat = 60000 / bpm;

            const songNotes = [];
            sheetData.forEach((beat, beatIndex) => {
                beat.forEach((note, keyIndex) => {
                    if (note.isActive) {
                        const time = Math.round(beatIndex * msPerBeat);
                        const key = `1Key${keyIndex}`;
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
    
const handleDownloadZip = async (onProgress) => {
        const infoForm = document.getElementById("info-form");
        const pageElements = Array.from(document.querySelectorAll(".page"));

        if (!infoForm || pageElements.length === 0) {
            return alert("오류: 캡처할 대상을 찾을 수 없습니다.");
        }

        const isConfirmed = window.confirm(
            "다운로드를 시작하시겠습니까? 시간이 조금 오래 걸릴 수도 있습니다. 완료될때까지 페이지를 벗어나지 마세요."
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
            // **수정된 부분: Promise 기반의 루프를 사용하여 비동기 처리**
            const processPage = (i) => {
                return new Promise(async (resolve, reject) => {
                    if (i >= pageElements.length) {
                        return resolve();
                    }

                    try {
                        onProgress({ message: `악보 ${i + 1}/${pageElements.length} 페이지 캡처 중...` });

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

                        const blob = await new Promise((resolveBlob) =>
                            canvas.toBlob(resolveBlob, "image/png")
                        );

                        zip.file(`악보_${i + 1}페이지.png`, blob);
                        canvas.remove();

                        // 짧은 지연 시간을 두어 브라우저 메인 스레드를 해제
                        setTimeout(() => resolve(processPage(i + 1)), 50);

                    } catch (error) {
                        reject(error);
                    }
                });
            };

            await processPage(0);

            // ... 나머지 ZIP 파일 생성 및 다운로드 로직은 동일 ...
            onProgress({ message: "ZIP 파일 생성 중...", progress: 0 });

            const zipBlob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 9 }
            }, (metadata) => {
                if (metadata.percent) {
                    onProgress({ message: "ZIP 파일 생성 중...", progress: metadata.percent });
                }
            });

            const link = document.createElement("a");
            const url = URL.createObjectURL(zipBlob);
            link.href = url;
            link.download = `${title || "전체악보"}.zip`;
            link.click();
            URL.revokeObjectURL(url);
            
            alert("악보 다운로드가 완료되었습니다!");
            onProgress({ message: "완료!", progress: 100 });

        } catch (error) {
            console.error("다운로드 중 오류 발생:", error);
            alert("죄송합니다. 다운로드 중 오류가 발생했습니다.");
            onProgress({ message: "오류 발생", progress: 0 });
        } finally {
            if (captureContainer.parentNode) {
                document.body.removeChild(captureContainer);
            }
        }
    };

    return { handleSave, handleDownloadTxt, handleDownloadZip };
};