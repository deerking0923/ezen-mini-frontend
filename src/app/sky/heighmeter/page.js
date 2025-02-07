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

  // 캔버스 DOM 참조
  const canvasRef = useRef(null);

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
   *  - "이미지 크기의 세 배" 범위 내에서만 이동 가능하도록 설정
   */
  function clampPosition(posX, posY, newScale) {
    // 캔버스 요소가 없으면 그대로 반환
    const canvas = canvasRef.current;
    if (!canvas) return { x: posX, y: posY };

    // 이미지 원본 크기
    const { width: imgW, height: imgH } = imageSize;
    // 아직 이미지 로드 전이면 그대로
    if (imgW === 0 || imgH === 0) {
      return { x: posX, y: posY };
    }

    // 캔버스 크기
    const rect = canvas.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // 스케일 적용 후의 실제 이미지 크기
    const scaledWidth = imgW * newScale;
    const scaledHeight = imgH * newScale;

    // -------------------------------------------
    // "이미지 크기의 세 배(3배)" 범위로 이동 허용
    // -------------------------------------------
    // 예: 가로 방향
    //   - 최소 X: (컨테이너 폭 - 이미지폭 * 3)
    //     => 왼쪽으로 최대 2*이미지폭만큼 추가로 빠져나갈 수 있음
    //   - 최대 X: 이미지폭 * 2
    //     => 오른쪽으로 최대 2*이미지폭만큼 빠져나갈 수 있음
    // 세로 방향도 마찬가지 로직

    const multiple = 1.5; // 여기서 3을 다른 값으로 바꾸면 범위 조절 가능!
    const minX = containerWidth - scaledWidth * multiple;
    const maxX = scaledWidth * (multiple - 1);

    const minY = containerHeight - scaledHeight * multiple;
    const maxY = scaledHeight * (multiple - 1);

    // 실제 이동값을 위 범위로 제한
    const clampedX = Math.min(Math.max(posX, minX), maxX);
    const clampedY = Math.min(Math.max(posY, minY), maxY);

    return { x: clampedX, y: clampedY };
  }

  // --- 드래그 (마우스) ---
  const handleDrag = (e) => {
    if (e.buttons !== 1) return;

    // 새 위치
    const newX = position.x + e.movementX;
    const newY = position.y + e.movementY;

    // clamp
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
    const step = 0.1;
    let newScale = oldScale + (zoomIn ? step : -step);
    if (newScale < 0.1) newScale = 0.1; // 최소 스케일 제한

    // 마우스 기준 확대/축소
    let newX = position.x + offsetX * (1 - newScale / oldScale);
    let newY = position.y + offsetY * (1 - newScale / oldScale);

    // clamp
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
      // 한 손가락 드래그
      const { pageX, pageY } = e.touches[0];
      setInitialTouchData({
        type: "drag",
        startX: pageX,
        startY: pageY,
        initialX: position.x,
        initialY: position.y,
      });
    } else if (e.touches.length === 2) {
      // 두 손가락 핀치 줌
      const [t1, t2] = e.touches;
      const distance = getDistance(t1, t2);

      // 핀치 중심(두 손가락 중간 지점)
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

    const dragMultiplier = 1.0;   // 드래그 민감도
    const zoomSensitivity = 1.0;  // 줌 민감도 (1 = 원래 비율)

    if (initialTouchData.type === "drag" && e.touches.length === 1) {
      const { pageX, pageY } = e.touches[0];
      const deltaX = pageX - initialTouchData.startX;
      const deltaY = pageY - initialTouchData.startY;
      const newX = initialTouchData.initialX + deltaX * dragMultiplier;
      const newY = initialTouchData.initialY + deltaY * dragMultiplier;

      // clamp
      const clamped = clampPosition(newX, newY, scale);
      setPosition(clamped);
    } else if (initialTouchData.type === "pinch" && e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const newDistance = getDistance(t1, t2);
      const ratio = newDistance / initialTouchData.startDistance;

      // 새 스케일
      const newScale =
        initialTouchData.initialScale *
        (1 + (ratio - 1) * zoomSensitivity);

      // 핀치 중심 기준 보정
      const { pinchCenter } = initialTouchData;
      const oldScale = initialTouchData.initialScale;
      let newX =
        initialTouchData.initialPosition.x +
        pinchCenter.x * (1 - newScale / oldScale);
      let newY =
        initialTouchData.initialPosition.y +
        pinchCenter.y * (1 - newScale / oldScale);

      // clamp
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
      <h1>게임 캐릭터 키 측정</h1>

      <div className="controls">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="zoom-controls">
          <button
            onClick={() => {
              const newS = scale + 0.1;
              const clampedPos = clampPosition(position.x, position.y, newS);
              setScale(newS);
              setPosition(clampedPos);
            }}
          >
            확대
          </button>
          <button
            onClick={() => {
              const newS = Math.max(0.1, scale - 0.1);
              const clampedPos = clampPosition(position.x, position.y, newS);
              setScale(newS);
              setPosition(clampedPos);
            }}
          >
            축소
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
              // 이미지 원본 크기 저장
              const { naturalWidth, naturalHeight } = e.currentTarget;
              setImageSize({ width: naturalWidth, height: naturalHeight });
            }}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
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
