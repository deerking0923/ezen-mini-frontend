"use client";
import React from "react";


export default function GuideSidebar({ onClick }) {
  return (
    <div className="guide-sidebar" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="guide-box">
        <img
          src="/sky/calculator/guide.webp"
          alt="시즌 가이드"
          className="guide-photo"
        />
        <div className="guide-items">
          <div className="guide-item">
            <img
              src="/sky/calculator/guide_item1.webp"
              alt="아이템 1"
              className="guide-item-photo"
            />
            <div className="guide-item-cost">
              <img
                src="/sky/calculator/heart.webp"
                alt="heart"
                className="heart-icon"
              />
              <span>1</span>
            </div>
          </div>
          <div className="guide-item">
            <img
              src="/sky/calculator/guide_item2.webp"
              alt="아이템 2"
              className="guide-item-photo"
            />
            <div className="guide-item-cost">
              <img
                src="/sky/calculator/heart.webp"
                alt="heart"
                className="heart-icon"
              />
              <span>2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
