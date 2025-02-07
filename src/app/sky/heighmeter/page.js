"use client"; // 클라이언트 컴포넌트임을 명시

import { useState, useRef } from "react";
import Image from "next/image";
import "./heighmeter.css"; // 분리된 CSS 파일

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null); // 업로드된 이미지
  const [scale, setScale] = useState(1); // 확대/축소 비율
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 이미지 이동 위치
  const imageRef = useRef(null);

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result); // 업로드된 이미지 저장
      };
      reader.readAsDataURL(file);
    }
  };

  // 버튼 클릭 시 확대/축소 처리 (증분 값을 0.05로 설정)
  const handleZoom = (zoomIn) => {
    setScale((prevScale) => Math.max(0.1, prevScale + (zoomIn ? 0.001 : -0.001)));
  };

  // 마우스 휠 이벤트를 통한 확대/축소 처리
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIn = e.deltaY < 0;
    setScale((prevScale) => Math.max(0.1, prevScale + (zoomIn ? 0.02 : -0.02)));
  };

  // 마우스 드래그를 통한 이미지 이동 처리
  const handleDrag = (e) => {
    if (e.buttons !== 1) return; // 마우스 왼쪽 버튼일 때만
    setPosition((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  return (
    <main className="container">
      <h1>게임 캐릭터 키 측정</h1>

      {/* 이미지 업로드 및 컨트롤 */}
      <div className="controls">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="zoom-controls">
          <button onClick={() => handleZoom(true)}>확대</button>
          <button onClick={() => handleZoom(false)}>축소</button>
        </div>
        <div className="slider-container">
          <label htmlFor="scale-slider">Zoom: </label>
          <input
            id="scale-slider"
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* 이미지 캔버스 */}
      <div
        className="image-canvas"
        onMouseMove={handleDrag}
        onMouseDown={(e) => e.preventDefault()} // 드래그 중 클릭 방지
        onWheel={handleWheel} // 마우스 휠 확대/축소
      >
        {/* 업로드된 이미지 */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            ref={imageRef}
            className="uploaded-image"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            }}
          />
        )}

        {/* 투명 PNG 레이어 (예: 키 측정 가이드 이미지) */}
        <Image
          src="/heigh.png"
          alt="Overlay"
          layout="fill"
          objectFit="contain"
          className="overlay"
        />
      </div>
    </main>
  );
}
