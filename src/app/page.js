"use client";

import { useEffect } from "react";
import "./page.css";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-container">
      <h1 className="title">나만의 문장을 만나다</h1>

      {/* 첫 번째 카드 - 왼쪽 사진 */}
      <div className="card card-left">
        <img src="/img1.jpg" alt="추억 사진 1" />
        <div className="card-text">
          "성공은 준비된 사람에게 온다."
          <br />- 첫 번째 친구
        </div>
      </div>

      {/* 두 번째 카드 - 오른쪽 사진 */}
      <div className="card card-right">
        <img src="/img2.jpg" alt="추억 사진 2" />
        <div className="card-text">
          "항상 도전하라. 실패해도 괜찮다."
          <br />- 두 번째 친구
        </div>
      </div>

      {/* 세 번째 카드 - 왼쪽 사진 */}
      <div className="card card-left">
        <img src="/img3.jpg" alt="추억 사진 3" />
        <div className="card-text">
          "작은 한 걸음이 위대한 여정을 시작한다."
          <br />- 세 번째 친구
        </div>
      </div>

      {/* 네 번째 카드 - 오른쪽 사진 */}
      <div className="card card-right">
        <img src="/img4.jpg" alt="추억 사진 4" />
        <div className="card-text">
          "진정한 친구는 어려울 때 빛난다."
          <br />- 네 번째 친구
        </div>
      </div>

      {/* 다섯 번째 카드 - 왼쪽 사진 */}
      <div className="card card-left">
        <img src="/img5.jpg" alt="추억 사진 5" />
        <div className="card-text">
          "웃음은 최고의 약이다."
          <br />- 다섯 번째 친구
        </div>
      </div>
    </div>
  );
}
