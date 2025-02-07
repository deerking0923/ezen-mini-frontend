"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic"; // Next.js 동적 임포트
import Image from "next/image";
import "./heighmeter.css";

/** html2canvas는 서버 사이드에서 동작이 불가능하므로
 *  ssr: false 옵션으로 동적으로 임포트해야 합니다. */
const html2canvas = dynamic(() => import("html2canvas"), { ssr: false });

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 확대/축소
  const handleZoom = (zoomIn) => {
    setScale((prev) => Math.max(0.1, prev + (zoomIn ? 0.001 : -0.001)));
  };

  // 마우스 드래그로 위치 이동
  const handleDrag = (e) => {
    if (e.buttons !== 1) return;
    setPosition((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  // 마우스 휠
  const handleWheel = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const zoomIn = e.deltaY < 0;
    setScale((prev) => Math.max(0.1, prev + (zoomIn ? 0.02 : -0.02)));
  };
  

  // *** html2canvas로 DOM을 캡처하여 다운로드 ***
  const handleDownload = async () => {
    if (!uploadedImage) return;
  
    try {
      // 여기서 html2canvas를 동적 임포트하여 default export를 받아옴
      const { default: html2canvas } = await import("html2canvas");
      const element = document.querySelector(".image-canvas");
      if (!element) {
        console.error("캡처할 요소를 찾을 수 없습니다.");
        return;
      }
  
      // html2canvas 옵션에 useCORS를 추가하여 CORS 문제 예방
      const canvas = await html2canvas(element, { useCORS: true });
      
      // 디버깅: canvas가 실제 HTMLCanvasElement인지 확인
      console.log("캔버스 객체:", canvas);
      if (typeof canvas.toDataURL !== "function") {
        console.error("캔버스에 toDataURL이 없습니다:", canvas);
        return;
      }
      
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "result.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("이미지 다운로드 중 에러 발생:", err);
    }
  };
  

  return (
    <main className="container">
      <h1>게임 캐릭터 키 측정</h1>

      <div className="controls">
        {/* 업로드 */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="zoom-controls">
          <button onClick={() => handleZoom(true)}>확대</button>
          <button onClick={() => handleZoom(false)}>축소</button>
        </div>

        {/* <div className="slider-container">
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
        </div> */}

        <button onClick={handleDownload}>결과 다운로드</button>
      </div>

      {/* 여기 .image-canvas를 캡처하면,
          업로드 이미지 + 오버레이가 포함된 최종 결과가 그대로 스샷됩니다. */}
      <div
        className="image-canvas"
        onMouseMove={handleDrag}
        onMouseDown={(e) => e.preventDefault()}
        onWheel={handleWheel}
      >
        {/* 사용자가 업로드한 이미지 */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="uploaded-image"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            }}
          />
        )}

        {/* 투명 PNG 레이어 (가이드) */}
        <Image
  src="/height.png"
  alt="Overlay"
  fill
  style={{ objectFit: "contain" }}
  className="overlay"
/>

      </div>
    </main>
  );
}
