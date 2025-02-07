"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "./heighmeter.css";

/** html2canvas는 서버 사이드에서 동작할 수 없으므로 ssr: false 옵션으로 동적 임포트 */
const html2canvas = dynamic(() => import("html2canvas"), { ssr: false });

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialTouchData, setInitialTouchData] = useState(null);

  // 이미지 캔버스 DOM 참조 (터치 이벤트 직접 등록 용)
  const canvasRef = useRef(null);

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

  // 확대/축소 처리 (버튼 클릭)
  const handleZoom = (zoomIn) => {
    setScale((prev) => Math.max(0.1, prev + (zoomIn ? 0.001 : -0.001)));
  };

  // PC: 마우스 드래그로 이미지 이동
  const handleDrag = (e) => {
    if (e.buttons !== 1) return;
    setPosition((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  // PC: 마우스 휠 이벤트
  const handleWheel = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const zoomIn = e.deltaY < 0;
    setScale((prev) => Math.max(0.1, prev + (zoomIn ? 0.02 : -0.02)));
  };

  // 터치 간 거리 계산 함수 (pinch 제스처 용)
  const getDistance = (touch1, touch2) => {
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 터치 시작 (touchstart)
  const handleTouchStart = (e) => {
    // 여기서 preventDefault()를 호출하려면 non-passive 리스너여야 합니다.
    e.preventDefault();

    if (e.touches.length === 1) {
      // 한 손가락: 드래그 시작
      const { pageX, pageY } = e.touches[0];
      setInitialTouchData({
        type: "drag",
        startX: pageX,
        startY: pageY,
        initialX: position.x,
        initialY: position.y,
      });
    } else if (e.touches.length === 2) {
      // 두 손가락: pinch-to-zoom 시작
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = getDistance(touch1, touch2);
      setInitialTouchData({
        type: "pinch",
        startDistance: distance,
        initialScale: scale,
      });
    }
  };

  // 터치 이동 (touchmove)
  const handleTouchMove = (e) => {
    e.preventDefault();

    if (!initialTouchData) return;

    if (initialTouchData.type === "drag" && e.touches.length === 1) {
      const { pageX, pageY } = e.touches[0];
      const deltaX = pageX - initialTouchData.startX;
      const deltaY = pageY - initialTouchData.startY;
      setPosition({
        x: initialTouchData.initialX + deltaX,
        y: initialTouchData.initialY + deltaY,
      });
    } else if (initialTouchData.type === "pinch" && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = getDistance(touch1, touch2);
      const ratio = newDistance / initialTouchData.startDistance;
      setScale(initialTouchData.initialScale * ratio);
    }
  };

  // 터치 종료 (touchend)
  const handleTouchEnd = (e) => {
    setInitialTouchData(null);
  };

  // useEffect를 사용하여 터치 이벤트를 { passive: false } 옵션으로 등록
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touchStartHandler = (e) => handleTouchStart(e);
    const touchMoveHandler = (e) => handleTouchMove(e);
    const touchEndHandler = (e) => handleTouchEnd(e);

    canvas.addEventListener("touchstart", touchStartHandler, { passive: false });
    canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
    canvas.addEventListener("touchend", touchEndHandler, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", touchStartHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
      canvas.removeEventListener("touchend", touchEndHandler);
    };
  }, [canvasRef, position, scale, initialTouchData]);

  // html2canvas로 DOM 캡처 후 다운로드
  const handleDownload = async () => {
    if (!uploadedImage) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const element = document.querySelector(".image-canvas");
      if (!element) {
        console.error("캡처할 요소를 찾을 수 없습니다.");
        return;
      }
      const canvas = await html2canvas(element, { useCORS: true });
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
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="zoom-controls">
          <button onClick={() => handleZoom(true)}>확대</button>
          <button onClick={() => handleZoom(false)}>축소</button>
        </div>
      </div>

      {/* onTouch* 핸들러는 useEffect에서 직접 등록하므로 JSX에는 포함하지 않습니다 */}
      <div
        className="image-canvas"
        ref={canvasRef}
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

      <div className="download-container">
        <button onClick={handleDownload}>결과 다운로드</button>
      </div>
    </main>
  );
}
