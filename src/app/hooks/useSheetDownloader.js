// src/app/hooks/useSheetDownloader.js

import domtoimage from 'dom-to-image-more';

export const useSheetDownloader = (title) => {

    const handleSave = (dataToSave, isEncrypted) => {
        const jsonString = JSON.stringify(dataToSave);
            
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        
        const fileName = isEncrypted ? dataToSave.title : dataToSave.title;
        link.download = `${fileName || "sky-sheet"}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadPage = async (pageNumber) => {
        const captureElement = document.getElementById("main-content-to-capture");
        if (!captureElement) {
            alert("오류: 캡처할 대상을 찾을 수 없습니다.");
            return;
        }

        const options = {
            quality: 1.0,
            bgcolor: '#f7fafc',
            scale: 3,
        };

        try {
            const dataUrl = await domtoimage.toPng(captureElement, options);
            
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${title || '악보'}_${pageNumber}페이지.png`;
            link.click();

        } catch (error) {
            console.error("페이지 캡처 중 오류 발생:", error);
            alert("죄송합니다. 페이지 캡처 중 오류가 발생했습니다.");
        }
    };

    return { handleSave, handleDownloadPage };
};