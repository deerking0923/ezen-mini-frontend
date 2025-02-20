"use client";
import React, { useState } from "react";
import "./SimpleCandleCalculator.css";

export default function SimpleCandleCalculator() {
  const [count, setCount] = useState(15);

  const handleIncrease = () => {
    setCount(prev => prev + 15);
  };

  const handleDecrease = () => {
    setCount(prev => Math.max(15, prev - 15));
  };

  const price = (count / 15) * 6600;

  return (
    <div className="simple-candle-calculator no-capture">
      <img src="/sky/calculator/candle.webp" alt="Candle" className="candle-image" />
      <div className="candle-info">
        <div className="candle-count">{count}개</div>
        <div className="candle-price">{price}원</div>
      </div>
      <div className="calc-buttons">
        <button className="up-btn" onClick={handleIncrease}>▲</button>
        <button className="down-btn" onClick={handleDecrease}>▼</button>
      </div>
    </div>
  );
}
