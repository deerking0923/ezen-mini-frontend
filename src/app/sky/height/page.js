"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "./heighmeter.css";


/** html2canvas는 서버 사이드에서 동작할 수 없으므로 ssr: false 옵션으로 동적 임포트 */
const html2canvas = dynamic(() => import("html2canvas"), { ssr: false });

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);

  // 스케일 / 위치
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 이미지 원본 크기 (naturalWidth, naturalHeight)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // 터치(핀치/드래그) 관련 저장
  const [initialTouchData, setInitialTouchData] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // 캔버스 DOM 참조
  const canvasRef = useRef(null);

  // 방향키 이동 간격 (초기값 5)
  const [arrowStep, setArrowStep] = useState(5);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setArrowStep(1); // 모바일에서는 더 정밀하게 (예: 2픽셀)
      } else {
        setArrowStep(5);
      }
    }
  }, []);

  // PC / 모바일에 따라 확대/축소 버튼의 스텝을 다르게 설정
  const [zoomStep, setZoomStep] = useState(0.01);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setZoomStep(0.0005); // 모바일에서는 좀 더 정밀하게
      } else {
        setZoomStep(0.01);
      }
    }
  }, []);

  // 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  /**
   * 위치를 제한(clamp)하는 함수
   */
  function clampPosition(posX, posY, newScale) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: posX, y: posY };

    const { width: imgW, height: imgH } = imageSize;
    if (imgW === 0 || imgH === 0) {
      return { x: posX, y: posY };
    }

    const rect = canvas.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const scaledWidth = imgW * newScale;
    const scaledHeight = imgH * newScale;

    const multiple = 1.5; // 이동 범위 조절
    const minX = containerWidth - scaledWidth * multiple;
    const maxX = scaledWidth * (multiple - 1);
    const minY = containerHeight - scaledHeight * multiple;
    const maxY = scaledHeight * (multiple - 1);

    const clampedX = Math.min(Math.max(posX, minX), maxX);
    const clampedY = Math.min(Math.max(posY, minY), maxY);

    return { x: clampedX, y: clampedY };
  }

  // --- 드래그 (마우스) ---
  const handleDrag = (e) => {
    if (e.buttons !== 1) return;
    const newX = position.x + e.movementX;
    const newY = position.y + e.movementY;
    const clamped = clampPosition(newX, newY, scale);
    setPosition(clamped);
  };

  // --- 휠 줌 (마우스) ---
  const handleWheel = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const oldScale = scale;
    const zoomIn = e.deltaY < 0;
    let newScale = oldScale + (zoomIn ? 0.05 : -0.05);
    if (newScale < 0.1) newScale = 0.1;

    let newX = position.x + offsetX * (1 - newScale / oldScale);
    let newY = position.y + offsetY * (1 - newScale / oldScale);
    const clamped = clampPosition(newX, newY, newScale);

    setScale(newScale);
    setPosition(clamped);
  };

  // --- 터치 계산용 ---
  const getDistance = (touch1, touch2) => {
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // --- 터치 시작 ---
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const { pageX, pageY } = e.touches[0];
      setInitialTouchData({
        type: "drag",
        startX: pageX,
        startY: pageY,
        initialX: position.x,
        initialY: position.y,
      });
    } else if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const distance = getDistance(t1, t2);
      const pinchCenter = {
        x: (t1.pageX + t2.pageX) / 2,
        y: (t1.pageY + t2.pageY) / 2,
      };
      setInitialTouchData({
        type: "pinch",
        startDistance: distance,
        initialScale: scale,
        initialPosition: { ...position },
        pinchCenter,
      });
    }
  };

  // --- 터치 이동 ---
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!initialTouchData) return;

    const dragMultiplier = 1.0;
    // zoomSensitivity는 상태 변수로 사용 (모바일/PC에 따라 다름)
    
    if (initialTouchData.type === "drag" && e.touches.length === 1) {
      const { pageX, pageY } = e.touches[0];
      const deltaX = pageX - initialTouchData.startX;
      const deltaY = pageY - initialTouchData.startY;
      const newX = initialTouchData.initialX + deltaX * dragMultiplier;
      const newY = initialTouchData.initialY + deltaY * dragMultiplier;
      const clamped = clampPosition(newX, newY, scale);
      setPosition(clamped);
    } else if (initialTouchData.type === "pinch" && e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const newDistance = getDistance(t1, t2);
      const ratio = newDistance / initialTouchData.startDistance;
      const dampingFactor = 0.5;
    let newScale = initialTouchData.initialScale * (1 + (ratio - 1) * dampingFactor);
      //if (newScale < 0.2) newScale = 0.2; // 최소 스케일 제한
      const { pinchCenter } = initialTouchData;
      const oldScale = initialTouchData.initialScale;
      let newX = initialTouchData.initialPosition.x + pinchCenter.x * (1 - newScale / oldScale);
      let newY = initialTouchData.initialPosition.y + pinchCenter.y * (1 - newScale / oldScale);
      const clamped = clampPosition(newX, newY, newScale);
      setScale(newScale);
      setPosition(clamped);
    }
  };
  // --- 터치 종료 ---
  const handleTouchEnd = () => {
    setInitialTouchData(null);
  };

  // --- 리스너 등록 (passive: false) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touchStartHandler = (e) => handleTouchStart(e);
    const touchMoveHandler = (e) => handleTouchMove(e);
    const touchEndHandler = () => handleTouchEnd();
    canvas.addEventListener("touchstart", touchStartHandler, { passive: false });
    canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
    canvas.addEventListener("touchend", touchEndHandler, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", touchStartHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
      canvas.removeEventListener("touchend", touchEndHandler);
    };
  }, [canvasRef, position, scale, initialTouchData]);

  // --- html2canvas 캡처 ---
  const handleDownload = async () => {
    if (!uploadedImage) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const element = document.querySelector(".image-canvas");
      if (!element) {
        console.error("캔버스 요소를 찾을 수 없습니다.");
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
      console.error("이미지 다운로드 중 오류:", err);
    }
  };

  return (
    <main className="container">
      <h1>
        빛아 키 측정 사이트 <span className="subtitle">made by 진사슴</span>
      </h1>

      <div className="instructions-btn-container">
        <button onClick={() => setShowInstructions(true)}>측정 방법 보기</button>
      </div>

      <div className="controls">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="zoom-controls">
          <button
            onClick={() => {
              const newS = scale + zoomStep;
              const clampedPos = clampPosition(position.x, position.y, newS);
              setScale(newS);
              setPosition(clampedPos);
            }}
          >
            확대
          </button>
          <button
            onClick={() => {
              const newS = Math.max(0.1, scale - zoomStep);
              const clampedPos = clampPosition(position.x, position.y, newS);
              setScale(newS);
              setPosition(clampedPos);
            }}
          >
            축소
          </button>
        </div>

        {/* 방향키 컨트롤 추가 (일렬로 표시) */}
        <div className="arrow-controls">
          <button
            className="arrow-btn"
            onClick={() => {
              const newPos = clampPosition(position.x, position.y - arrowStep, scale);
              setPosition(newPos);
            }}
          >
            ↑
          </button>
          <button
            className="arrow-btn"
            onClick={() => {
              const newPos = clampPosition(position.x, position.y + arrowStep, scale);
              setPosition(newPos);
            }}
          >
            ↓
          </button>
          <button
            className="arrow-btn"
            onClick={() => {
              const newPos = clampPosition(position.x - arrowStep, position.y, scale);
              setPosition(newPos);
            }}
          >
            ←
          </button>
          <button
            className="arrow-btn"
            onClick={() => {
              const newPos = clampPosition(position.x + arrowStep, position.y, scale);
              setPosition(newPos);
            }}
          >
            →
          </button>
        </div>
      </div>

      <div
        className="image-canvas"
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseMove={handleDrag}
        onMouseDown={(e) => e.preventDefault()}
      >
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="uploaded-image"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              setImageSize({ width: naturalWidth, height: naturalHeight });
            }}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          />
        )}
        <Image
          src="/sky-height.png"
          alt="Overlay"
          fill
          style={{ objectFit: "contain" }}
          className="overlay"
        />
        {/* 이미지 캔버스 우측 하단 텍스트 */}
        <div className="credit-text">
          &lt;realdeerworld.com/sky/height&gt;
        </div>
      </div>

      {/* 새로운 캡션 텍스트 추가 (이미지 캔버스 바로 아래, 다운로드 버튼 위) */}
      <div className="caption-text">
        &lt;네이버 Sky 카페 - 큐큘님&gt; [미세팁] 카페기준 키재기
      </div>

      <div className="download-container">
        <button onClick={handleDownload}>결과 다운로드</button>
      </div>

      {/* 모달 팝업 */}
      {showInstructions && (
        <div className="modal" onClick={() => setShowInstructions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p className="popup-header">
              &lt;네이버 Sky 카페 - 미욘새님&gt; 키 재는 방법 [지켜야 할 사항] 정리
            </p>
            <button className="close-btn" onClick={() => setShowInstructions(false)}>
              &times;
            </button>
            <img src="/guide.png" alt="측정 방법" />
          </div>
        </div>
      )}
    </main>
  );
}
