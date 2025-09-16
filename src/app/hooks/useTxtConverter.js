// src/app/hooks/useTxtConverter.js

import { useState } from 'react';

const songKey = process.env.NEXT_PUBLIC_SONG_KEY;
const salt = process.env.NEXT_PUBLIC_SALT;

const encryptSong = (text) => {
    if (!songKey) {
        throw new Error("Encryption key (NEXT_PUBLIC_SONG_KEY) is not set.");
    }
    let encryptedText = [];
    let keyLength = songKey.length;
    let keyCounter = 0;
    
    for (let i = 0; i < text.length; i++) {
        encryptedText.push(text.charCodeAt(i) + songKey.charCodeAt(keyCounter) - 100);
        keyCounter++;
        if (keyCounter >= keyLength) keyCounter = 0;
    }
    return encryptedText;
};

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

const encryptSheet = (sheetObject) => {
    const sheetString = JSON.stringify(sheetObject);
    const saltedString = sheetString + salt;
    const encryptedData = encryptSong(saltedString);
    return {
        encrypted: true,
        data: encryptedData,
    };
};

const decryptSheet = (encryptedObject) => {
    if (!encryptedObject || !encryptedObject.data) {
        throw new Error("Invalid encrypted object format.");
    }
    const decryptedWithSalt = decryptSong(encryptedObject.data);
    if (decryptedWithSalt.endsWith(salt)) {
        const originalString = decryptedWithSalt.slice(0, -salt.length);
        return JSON.parse(originalString);
    }
    throw new Error("Decryption failed: Salt mismatch");
};


const parsePlainTextSheet = (fileContent) => {
    const lines = fileContent.trim().split('\n');
    if (lines.length < 2) throw new Error("Invalid plain text format.");

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
        bpm: bpm || 240,
    };
};

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
            const decryptedStringWithSalt = decryptSong(songNotes);
            if (decryptedStringWithSalt.endsWith(salt)) {
                const originalNotesString = decryptedStringWithSalt.slice(0, -salt.length);
                notesData = JSON.parse(originalNotesString);
            } else {
                throw new Error("Decryption failed: salt mismatch.");
            }
        } catch (e) {
            throw new Error("Decrypted data is not a valid JSON string.");
        }
    } else {
        notesData = songNotes;
    }

    if (!notesData || !Array.isArray(notesData)) {
        throw new Error("Song notes are empty or in an invalid format.");
    }

    const currentBpm = bpm || 240;
    const msPerBeat = 60000 / currentBpm;
    const numKeys = 15;

    const maxTime = notesData.length > 0 ? Math.max(...notesData.map(note => note.time), 0) : 0;
    const numRows = Math.ceil(maxTime / msPerBeat) + 20;

    const newSheetData = Array.from({ length: numRows }, () =>
        Array.from({ length: numKeys }, () => ({ isActive: false, colorId: "default" }))
    );

    notesData.forEach(note => {
        const { time, key } = note;
        const rowIndex = Math.round(time / msPerBeat);
        const keyIndexString = key.substring(key.indexOf('Key') + 3);
        const keyIndex = parseInt(keyIndexString);

        if (rowIndex >= 0 && rowIndex < newSheetData.length && !isNaN(keyIndex) && keyIndex >= 0 && keyIndex < numKeys) {
            newSheetData[rowIndex][keyIndex].isActive = true;
        }
    });

    return {
        title: name || "Untitled",
        composer: author || "Unknown",
        arranger: transcribedBy || "Unknown",
        sheetData: newSheetData,
        bpm: currentBpm,
    };
};

export const useTxtConverter = () => {
    const [isEncrypted, setIsEncrypted] = useState(false);

    const txtToSheet = (fileContent) => {
        try {
            const jsonData = parseJsonSheet(fileContent);
            const parsedContent = JSON.parse(fileContent);
            const isFileEncrypted = Array.isArray(parsedContent) ? parsedContent[0]?.isEncrypted : parsedContent?.isEncrypted;
            
            setIsEncrypted(isFileEncrypted || false);
            return { success: true, data: jsonData };
        } catch (jsonError) {
            console.warn("JSON parsing failed, attempting Plain Text:", jsonError.message);
            try {
                const plainTextData = parsePlainTextSheet(fileContent);
                setIsEncrypted(false);
                return { success: true, data: plainTextData };
            } catch (plainTextError) {
                console.error("File parsing error (both JSON and Plain Text failed):", plainTextError);
                setIsEncrypted(false);
                return { success: false, error: "지원하지 않는 TXT 악보 형식입니다." };
            }
        }
    };
    
    const sheetToTxt = (sheetInfo, encrypt) => {
        const { title, composer, arranger, bpm, sheetData } = sheetInfo;

        const notesArray = sheetData.flatMap((beat, beatIndex) => {
            const notesInBeat = [];
            beat.forEach((note, keyIndex) => {
                if (note.isActive) {
                    notesInBeat.push({
                        time: Math.round((60000 / bpm) * beatIndex),
                        key: `1Key${keyIndex}`
                    });
                }
            });
            return notesInBeat;
        });
        
        let finalJson = {
            name: title || "Untitled",
            author: composer || "Unknown",
            arrangedBy: arranger || "",
            transcribedBy: "Your Name",
            permission: "",
            isComposed: true,
            bpm: bpm || 240,
            bitsPerPage: 16,
            pitchLevel: 10,
            isEncrypted: encrypt,
            keyVersion: encrypt ? 1 : 0,
            songNotes: notesArray,
        };
        
        if (encrypt) {
            if (!songKey || !salt) {
                throw new Error("Encryption keys are not set. Cannot save encrypted file.");
            }
            const songNotesString = JSON.stringify(notesArray);
            const saltedString = songNotesString + salt;
            const encryptedNotesArray = encryptSong(saltedString);
            finalJson.songNotes = encryptedNotesArray;
        }

        return JSON.stringify([finalJson]);
    };

    return { 
        txtToSheet, 
        sheetToTxt, 
        isEncrypted,
        setIsEncrypted, 
        encryptSheet,
        decryptSheet
    };
};