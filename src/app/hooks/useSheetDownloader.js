import domtoimage from 'dom-to-image-more'; // html2canvas 대신 dom-to-image-more를 import

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
    
    // ▼▼▼ 새 라이브러리를 사용하도록 변경된 함수 ▼▼▼
    const handleDownloadPage = async (pageNumber) => {
        const captureElement = document.getElementById("main-content-to-capture");
        if (!captureElement) {
            alert("오류: 캡처할 대상을 찾을 수 없습니다.");
            return;
        }

        const options = {
            quality: 1.0,
            bgcolor: '#f7fafc', // 배경색 지정
        };

        try {
            // dom-to-image-more 라이브러리를 사용하여 PNG 데이터 URL 생성
            const dataUrl = await domtoimage.toPng(captureElement, options);
            
            // 데이터 URL을 이용해 파일 다운로드
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${title || '악보'}_${pageNumber}페이지.png`;
            link.click();

        } catch (error) {
            console.error("페이지 캡처 중 오류 발생:", error);
            alert("죄송합니다. 페이지 캡처 중 오류가 발생했습니다.");
        }
    };

    return { handleSave, handleDownloadTxt, handleDownloadPage };
};