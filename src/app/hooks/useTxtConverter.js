// src/app/hooks/useTxtConverter.js
import { useState } from 'react';

// 환경변수에서 암호화 키와 솔트 값을 가져옵니다.
// NEXT.js에서는 클라이언트 측에서도 환경변수에 접근할 수 있도록 NEXT_PUBLIC_ 접두사를 사용해야 합니다.
const songKey = process.env.NEXT_PUBLIC_SONG_KEY;
const salt = process.env.NEXT_PUBLIC_SALT;

// 암호화 함수
const encryptSong = (text) => {
    if (!songKey) {
        throw new Error("Encryption key (NEXT_PUBLIC_SONG_KEY) is not set.");
    }
    let encryptedText = [];
    const keyLength = songKey.length;
    let keyCounter = 0;
    for (let i = 0; i < text.length; i++) {
        encryptedText.push(text.charCodeAt(i) + songKey.charCodeAt(keyCounter) - 100);
        keyCounter++;
        if (keyCounter >= keyLength) keyCounter = 0;
    }
    return encryptedText;
};

// 복호화 함수
const decryptSong = (array) => {
    if (!songKey) {
        throw new Error("Encryption key (NEXT_PUBLIC_SONG_KEY) is not set.");
    }
    let decryptedText = "";
    let keyLength = songKey.length;
    let keyCounter = 0;
    for (let i = 0; i < array.length; i++) {
        decryptedText += String.fromCharCode(array[i] - songKey.charCodeAt(keyCounter) + 100);
        keyCounter++;
        if (keyCounter >= keyLength) keyCounter = 0;
    }
    return decryptedText;
};

// 텍스트 기반 악보를 파싱하는 함수
const parsePlainTextSheet = (fileContent) => {
    const lines = fileContent.trim().split('\n');
    if (lines.length < 2) throw new Error("Invalid plain text format.");
    // ... (나머지 기존 코드) ...
    const headerLine = lines.shift().replace('<DontCopyThisLine>', '').trim();
    const headerParts = headerLine.split(' ');
    const bpm = parseInt(headerParts[0], 10);
    const title = headerParts.slice(3, -1).join(' ');
    const author = headerParts[headerParts.length - 1];

    if (isNaN(bpm)) throw new Error("Invalid BPM in header.");

    const keyMap = {};
    ['A', 'B', 'C'].forEach((row, rowIndex) => {
        for (let i = 1; i <= 5; i++) {
            keyMap[`${row}${i}`] = rowIndex * 5 + (i - 1);
        }
    });

    const allNotes = lines.join(' ').trim().split(/\s+/);
    const newSheetData = allNotes.map(beat => {
        const beatRow = Array.from({ length: 15 }, () => ({ isActive: false, colorId: "default" }));
        if (beat === '.') return beatRow;

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

// JSON 기반 악보를 파싱하는 함수 (암호화 복호화 로직 포함)
const parseJsonSheet = (fileContent) => {
    let data;
    try {
        const parsedContent = JSON.parse(fileContent);
        data = Array.isArray(parsedContent) ? parsedContent[0] : parsedContent;
    } catch (e) {
        throw new Error("Invalid JSON format.");
    }

    const { bpm, songNotes, name, author, transcribedBy, isEncrypted } = data;

    let notesData;
    if (isEncrypted) {
        if (!songKey || !salt) {
             throw new Error("Encryption keys are not set. Cannot decrypt file.");
        }
        if (!Array.isArray(songNotes)) {
            throw new Error("Encrypted notes are not an array.");
        }
        
        try {
            const decryptedString = decryptSong(songNotes);
            const originalNotesString = decryptedString.startsWith(salt) ? decryptedString.substring(salt.length) : decryptedString;
            notesData = JSON.parse(originalNotesString);
        } catch (e) {
            throw new Error("Decrypted data is not a valid JSON string.");
        }
    } else {
        notesData = songNotes;
    }

    if (!notesData || notesData.length === 0) {
        throw new Error("Song notes are empty.");
    }

    const msPerBeat = 60000 / bpm;
    const numKeys = 15;
    const maxTime = Math.max(...notesData.map(note => note.time), 0);
    const numRows = Math.ceil(maxTime / msPerBeat) + 1;

    const newSheetData = Array.from({ length: numRows }, () =>
        Array.from({ length: numKeys }, () => ({ isActive: false, colorId: "default" }))
    );

    notesData.forEach(note => {
        const { time, key } = note;
        const rowIndex = Math.round(time / msPerBeat);
        const keyIndex = parseInt(key.split('Key')[1]);

        if (rowIndex >= 0 && rowIndex < newSheetData.length && keyIndex >= 0 && keyIndex < numKeys) {
            newSheetData[rowIndex][keyIndex].isActive = true;
        }
    });

    return {
        title: name || "Untitled",
        composer: author || "Unknown",
        arranger: transcribedBy || "Unknown",
        sheetData: newSheetData,
    };
};

export const useTxtConverter = () => {
    const [convertedData, setConvertedData] = useState(null);
    const [isEncrypted, setIsEncrypted] = useState(false);

    const txtToSheet = (fileContent) => {
        try {
            const parsedContent = JSON.parse(fileContent);
            const isFileEncrypted = Array.isArray(parsedContent) ? parsedContent[0]?.isEncrypted : parsedContent?.isEncrypted;
            
            const jsonData = parseJsonSheet(fileContent);
            setConvertedData(jsonData);
            setIsEncrypted(isFileEncrypted || false);
            return { success: true, data: jsonData };
        } catch (jsonError) {
            console.warn("JSON parsing failed, attempting Plain Text:", jsonError.message);
            try {
                const plainTextData = parsePlainTextSheet(fileContent);
                setConvertedData(plainTextData);
                setIsEncrypted(false);
                return { success: true, data: plainTextData };
            } catch (plainTextError) {
                console.error("File parsing error (both JSON and Plain Text failed):", plainTextError);
                setConvertedData(null);
                setIsEncrypted(false);
                return { success: false, error: "지원하지 않는 TXT 악보 형식입니다." };
            }
        }
    };
    
    const sheetToTxt = (sheetData) => {
        const { title, composer, arranger, bpm } = sheetData;
        const notesArray = sheetData.sheetData.map((beat, index) => {
            const notesInBeat = beat.filter(note => note.isActive).map(note => ({
                time: Math.round((60000 / bpm) * index),
                key: `1Key${beat.indexOf(note)}`
            }));
            return notesInBeat;
        }).flat();
        
        let finalJson = {
            name: title || "Untitled",
            author: composer || "Unknown",
            arrangedBy: arranger || "",
            transcribedBy: "Your Name",
            permission: "",
            isComposed: true,
            bpm: bpm,
            bitsPerPage: 16,
            pitchLevel: 10,
            isEncrypted: isEncrypted,
            keyVersion: isEncrypted ? 1 : undefined,
            songNotes: notesArray,
        };
        
        if (isEncrypted) {
            if (!songKey || !salt) {
                throw new Error("Encryption keys are not set. Cannot save encrypted file.");
            }
            const songNotesString = JSON.stringify(notesArray);
            const saltedSongNotesString = salt + songNotesString;
            const encryptedNotesArray = encryptSong(saltedSongNotesString);
            finalJson.songNotes = encryptedNotesArray;
        }

        return JSON.stringify([finalJson], null, 2);
    };

    return { txtToSheet, sheetToTxt, convertedData };
};