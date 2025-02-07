'use client';

import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./slides.css";

// 화살표 버튼(원하는 경우) - 슬라이드 영역 외부에 배치할 수도 있음
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className + " custom-arrow"}
      style={{ ...style }}
      onClick={onClick}
    >
      Prev
    </button>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className + " custom-arrow"}
      style={{ ...style }}
      onClick={onClick}
    >
      Next
    </button>
  );
}

export default function Slides() {
  // 슬라이드 이미지 영역에만 커스텀 커서 효과 적용할 ref
  const sliderAreaRef = useRef(null);

  useEffect(() => {
    const sliderArea = sliderAreaRef.current;
    if (!sliderArea) return;
    // sliderArea를 기준으로 자식 요소의 위치를 조정하기 위해 relative로 지정
    sliderArea.style.position = "relative";

    // 커스텀 레이저 커서 요소 생성 (초기엔 숨김)
    const cursor = document.createElement("div");
    cursor.classList.add("laser-cursor");
    cursor.style.display = "none";
    sliderArea.appendChild(cursor);

    const moveCursor = (e) => {
      // sliderArea 내부 좌표 계산 (viewport 좌표 → sliderArea 내부 좌표)
      const rect = sliderArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };

    const handleMouseEnter = () => {
      // 영역 내에서는 기본 커서를 숨기고 커스텀 커서를 표시
      sliderArea.style.cursor = "none";
      cursor.style.display = "block";
      sliderArea.addEventListener("mousemove", moveCursor);
    };

    const handleMouseLeave = () => {
      // 영역을 벗어나면 기본 커서로 복원
      sliderArea.style.cursor = "auto";
      cursor.style.display = "none";
      sliderArea.removeEventListener("mousemove", moveCursor);
    };

    sliderArea.addEventListener("mouseenter", handleMouseEnter);
    sliderArea.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      sliderArea.removeEventListener("mouseenter", handleMouseEnter);
      sliderArea.removeEventListener("mouseleave", handleMouseLeave);
      sliderArea.removeEventListener("mousemove", moveCursor);
      if (cursor && sliderArea.contains(cursor)) {
        sliderArea.removeChild(cursor);
      }
    };
  }, []);

  // 슬라이더 관련 변수 및 상태
  const sliderRef = useRef(null);
  const totalSlides = 63;
  const images = Array.from({ length: totalSlides }, (_, index) => {
    const num = (index + 1).toString().padStart(3, "0");
    return `/ppt/${num}.png`;
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const maxDots = 10; // 표시할 최대 dot 개수

  const settings = {
    dots: false, // 기본 dot 비활성화 (커스텀 dot 사용)
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    lazyLoad: "ondemand",
    afterChange: (current) => {
      setActiveSlide(current);
    },
    // 화살표 버튼을 커스텀하여 슬라이드 이미지 영역 밖에 배치하거나 별도 스타일 적용 가능
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  // 커스텀 dot 영역에서 표시할 dot 범위 계산
  let start = activeSlide - Math.floor(maxDots / 2);
  let end = activeSlide + Math.floor(maxDots / 2);
  if (start < 0) {
    start = 0;
    end = Math.min(maxDots - 1, totalSlides - 1);
  }
  if (end > totalSlides - 1) {
    end = totalSlides - 1;
    start = Math.max(0, end - maxDots + 1);
  }

  const visibleDots = [];
  for (let i = start; i <= end; i++) {
    visibleDots.push(i);
  }

  return (
    <div className="slider-container">
      {/* 슬라이드 이미지 영역에만 커스텀 커서 적용 */}
      <div ref={sliderAreaRef} className="slider-area">
        <Slider ref={sliderRef} {...settings}>
          {images.map((src, index) => (
            <div key={index} className="slide">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="slide-image"
              />
            </div>
          ))}
        </Slider>
      </div>
      {/* 컨트롤 영역(도트, 화살표 등)은 별도 컨테이너에 배치하여 기본 커서를 유지 */}
      <div className="custom-controls">
        <div className="custom-dots">
          {visibleDots.map((dotIndex) => (
            <button
              key={dotIndex}
              className={`dot ${dotIndex === activeSlide ? "active" : ""}`}
              onClick={() => sliderRef.current.slickGoTo(dotIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
