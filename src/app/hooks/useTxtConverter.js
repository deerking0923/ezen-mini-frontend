// app/hooks/useTxtConverter.js
import { useState } from 'react';

export const useTxtConverter = () => {
  const [convertedData, setConvertedData] = useState(null);

  const txtToSheet = (fileContent) => {
    try {
      const data = JSON.parse(fileContent)[0];
      const { bpm, bitsPerPage, songNotes, name, author, transcribedBy } = data;

      const msPerBeat = 60000 / bpm;
      const numKeys = 15;

      const maxTime = Math.max(...songNotes.map(note => note.time), 0);
      const numRows = Math.ceil(maxTime / msPerBeat) + 1;

      const newSheetData = Array.from({ length: numRows }, () =>
        Array.from({ length: numKeys }, () => ({ isActive: false, colorId: "default" }))
      );

      songNotes.forEach(note => {
        const { time, key } = note;
        const rowIndex = Math.floor(time / msPerBeat);
        const keyIndex = parseInt(key.split('Key')[1]);

        if (rowIndex >= 0 && rowIndex < newSheetData.length && keyIndex >= 0 && keyIndex < numKeys) {
          newSheetData[rowIndex][keyIndex].isActive = true;
        }
      });

      setConvertedData({
        title: name,
        composer: author,
        arranger: transcribedBy,
        sheetData: newSheetData,
      });
      return { success: true, data: convertedData };
    } catch (e) {
      console.error("파일 파싱 오류:", e);
      setConvertedData(null);
      return { success: false, error: "유효하지 않은 TXT 파일입니다." };
    }
  };

  return { txtToSheet, convertedData };
};