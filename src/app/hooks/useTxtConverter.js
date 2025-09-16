// src/app/hooks/useTxtConverter.js
import { useState } from 'react';

// 텍스트 기반 악보를 파싱하는 새로운 함수
const parsePlainTextSheet = (fileContent) => {
  const lines = fileContent.trim().split('\n');
  if (lines.length < 2) throw new Error("Invalid plain text format.");

  // 1. 헤더 정보 추출 (BPM, 제목 등)
  const headerLine = lines.shift().replace('<DontCopyThisLine>', '').trim();
  const headerParts = headerLine.split(' ');
  const bpm = parseInt(headerParts[0], 10);
  const title = headerParts.slice(3, -1).join(' ');
  const author = headerParts[headerParts.length - 1];

  if (isNaN(bpm)) throw new Error("Invalid BPM in header.");

  // 2. 노트 표기법을 key 인덱스(0-14)로 변환하는 맵
  const keyMap = {};
  ['A', 'B', 'C'].forEach((row, rowIndex) => {
    for (let i = 1; i <= 5; i++) {
      keyMap[`${row}${i}`] = rowIndex * 5 + (i - 1);
    }
  });

  // 3. 노트 데이터 파싱
  const allNotes = lines.join(' ').trim().split(/\s+/);
  const newSheetData = allNotes.map(beat => {
    const beatRow = Array.from({ length: 15 }, () => ({ isActive: false, colorId: "default" }));
    if (beat === '.') return beatRow; // 쉼표는 빈 줄로 처리

    const notesInBeat = beat.match(/[A-C][1-5]/g);
    if (notesInBeat) {
      notesInBeat.forEach(noteKey => {
        const keyIndex = keyMap[noteKey];
        if (keyIndex !== undefined) {
          beatRow[keyIndex].isActive = true;
        }
      });
    }
    return beatRow;
  });

  return {
    title: title || "Untitled",
    composer: author || "Unknown",
    arranger: "Unknown",
    sheetData: newSheetData,
  };
};

// JSON 기반 악보를 파싱하는 기존 함수
const parseJsonSheet = (fileContent) => {
  const data = JSON.parse(fileContent)[0];
  const { bpm, songNotes, name, author, transcribedBy } = data;

  if (!songNotes || songNotes.length === 0) {
    throw new Error("Song notes are empty.");
  }

  const msPerBeat = 60000 / bpm;
  const numKeys = 15;
  const maxTime = Math.max(...songNotes.map(note => note.time), 0);
  const numRows = Math.ceil(maxTime / msPerBeat) + 1;

  const newSheetData = Array.from({ length: numRows }, () =>
    Array.from({ length: numKeys }, () => ({ isActive: false, colorId: "default" }))
  );

  songNotes.forEach(note => {
    const { time, key } = note;
    const rowIndex = Math.round(time / msPerBeat);
    const keyIndex = parseInt(key.split('Key')[1]);

    if (rowIndex >= 0 && rowIndex < newSheetData.length && keyIndex >= 0 && keyIndex < numKeys) {
      newSheetData[rowIndex][keyIndex].isActive = true;
    }
  });

  return {
    title: name,
    composer: author,
    arranger: transcribedBy,
    sheetData: newSheetData,
  };
};


export const useTxtConverter = () => {
  const [convertedData, setConvertedData] = useState(null);

  // 파일을 받아서 형식을 자동으로 감지하고 변환하는 메인 함수
  const txtToSheet = (fileContent) => {
    try {
      // 먼저 JSON 형식으로 파싱 시도
      const jsonData = parseJsonSheet(fileContent);
      setConvertedData(jsonData);
      return { success: true, data: jsonData };
    } catch (jsonError) {
      // JSON 파싱 실패 시, 새로운 텍스트 형식으로 파싱 시도
      try {
        const plainTextData = parsePlainTextSheet(fileContent);
        setConvertedData(plainTextData);
        return { success: true, data: plainTextData };
      } catch (plainTextError) {
        // 두 형식 모두 실패한 경우 에러 반환
        console.error("File parsing error (both JSON and Plain Text failed):", jsonError, plainTextError);
        setConvertedData(null);
        return { success: false, error: "지원하지 않는 TXT 악보 형식입니다." };
      }
    }
  };

  return { txtToSheet, convertedData };
};