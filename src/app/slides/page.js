'use client';

import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./slides.css";

export default function Slides() {
  const sliderRef = useRef(null);
  const totalSlides = 62;
  const images = Array.from({ length: totalSlides }, (_, index) => {
    const num = (index + 1).toString().padStart(3, '0');
    return `/ppt/${num}.png`;
  });

  // 현재 활성 슬라이드 인덱스를 상태로 관리
  const [activeSlide, setActiveSlide] = useState(0);
  const maxDots = 10; // 표시할 최대 dot 개수

  const settings = {
    dots: false,   // 기본 dot 비활성화 (커스텀 dot 사용)
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    lazyLoad: 'ondemand',
    afterChange: (current) => {
      setActiveSlide(current);
    },
  };

  // 활성화된 dot가 중앙에 오도록 visibleDots(표시할 dot들의 범위)를 계산
  let start = activeSlide - Math.floor(maxDots / 2);
  let end = activeSlide + Math.floor(maxDots / 2);

  // 시작 인덱스가 음수면 보정
  if (start < 0) {
    start = 0;
    end = Math.min(maxDots - 1, totalSlides - 1);
  }
  // 끝 인덱스가 totalSlides를 초과하면 보정
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
  );
}
