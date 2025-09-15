import html2canvas from 'html2canvas';

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
    
    const handleDownloadPage = async (pageNumber) => {
        const captureElement = document.getElementById("main-content-to-capture");
        if (!captureElement) {
            alert("오류: 캡처할 대상을 찾을 수 없습니다.");
            return;
        }

        try {
            const canvas = await html2canvas(captureElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f7fafc',
            });
            
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${title || '악보'}_${pageNumber}페이지.png`;
            link.click();
            URL.revokeObjectURL(url);
            
            canvas.remove();

        } catch (error) {
            console.error("페이지 캡처 중 오류 발생:", error);
            alert("죄송합니다. 페이지 캡처 중 오류가 발생했습니다.");
        }
    };

    return { handleSave, handleDownloadTxt, handleDownloadPage };
};