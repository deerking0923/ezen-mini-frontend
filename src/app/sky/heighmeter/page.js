"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "./heighmeter.css";

/** html2canvas는 서버 사이드에서 동작할 수 없으므로 ssr: false 옵션으로 동적 임포트 */
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

  // 확대/축소 처리
  const handleZoom = (zoomIn) => {
    setScale((prev) => Math.max(0.1, prev + (zoomIn ? 0.001 : -0.001)));
  };

  // 마우스 드래그로 이미지 이동
  const handleDrag = (e) => {
    if (e.buttons !== 1) return;
    setPosition((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  // 마우스 휠: cancelable일 경우에만 preventDefault 호출
  const handleWheel = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const zoomIn = e.deltaY < 0;
    setScale((prev) => Math.max(0.1, prev + (zoomIn ? 0.02 : -0.02)));
  };

  // html2canvas로 DOM 캡처 후 다운로드
  const handleDownload = async () => {
    if (!uploadedImage) return;

    try {
      // 동적으로 html2canvas 모듈 임포트
      const { default: html2canvas } = await import("html2canvas");
      const element = document.querySelector(".image-canvas");
      if (!element) {
        console.error("캡처할 요소를 찾을 수 없습니다.");
        return;
      }

      // useCORS 옵션을 추가해 CORS 문제 예방
      const canvas = await html2canvas(element, { useCORS: true });
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
        {/* 이미지 업로드 및 확대/축소 컨트롤 */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="zoom-controls">
          <button onClick={() => handleZoom(true)}>확대</button>
          <button onClick={() => handleZoom(false)}>축소</button>
        </div>
      </div>

      {/* 이미지 캔버스: 업로드된 이미지와 오버레이(가이드)를 표시 */}
      <div
        className="image-canvas"
        onMouseMove={handleDrag}
        onMouseDown={(e) => e.preventDefault()}
        onWheel={handleWheel}
      >
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

        <Image
          src="/height.png"
          alt="Overlay"
          fill
          style={{ objectFit: "contain" }}
          className="overlay"
        />
      </div>

      {/* 다운로드 버튼: 이미지 캔버스 아래에 배치 */}
      <div className="download-container">
        <button onClick={handleDownload}>결과 다운로드</button>
      </div>
    </main>
  );
}
