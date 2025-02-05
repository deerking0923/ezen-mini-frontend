"use client";

import { useEffect } from "react";
import Link from "next/link";
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
    <>
      {/* 첫 화면 (Hero) */}
      <section className="hero">
        <h1 className="title">나만의 문장을 만나다</h1>
      </section>

      {/* 사진 섹션 */}
      <section className="photo-section">
        {/* 첫 번째 카드 - 왼쪽 사진 */}
        <div className="card card-left">
          <img src="/img1.jpg" alt="추억 사진 1" />
          <div className="card-text">
          &quot;인간이 더는 생각할 수 없다면 그것은 인간이 아니다. 인간은 점차 품위를 상실하고 있다. 빠르게 선택하는 것이 효율적이라는 것은 이 시대를 대표하는 인간성 오류다.&quot;
            <br />- 프리드리히 니체
          </div>
        </div>

        {/* 두 번째 카드 - 오른쪽 사진 */}
        <div className="card card-right">
          <img src="/img2.jpg" alt="추억 사진 2" />
          <div className="card-text">
          &quot;진리를 찾는데 있어서 가장 방해가 되는 것은 빈약한 지성이나 거짓된 가상이 아니다. 그것은 바로 선입견과 편견이다.&quot;
            <br />- 아르투어 쇼펜하우어
          </div>
        </div>

        {/* 세 번째 카드 - 왼쪽 사진 */}
        <div className="card card-left">
          <img src="/img3.jpg" alt="추억 사진 3" />
          <div className="card-text">
          &quot;사람이 어떤 일을 하는지도 중요하지만, 사실은 그 일을 하는 사람이 어떤 사람인지가 더 중요하다.&quot;
            <br />- 존 스튜어트 밀
          </div>
        </div>

        {/* 네 번째 카드 - 오른쪽 사진 */}
        <div className="card card-right">
          <img src="/img4.jpg" alt="추억 사진 4" />
          <div className="card-text">
          &quot;무지를 아는 것이 진정한 앎의 시작이다.&quot;
            <br />- 소크라테스
          </div>
        </div>

        {/* 다섯 번째 카드 - 왼쪽 사진 */}
        <div className="card card-left">
          <img src="/img5.jpg" alt="추억 사진 5" />
          <div className="card-text">
          &quot;현재를 지배하는 자는 과거를 지배한다.&quot;
            <br />- 조지 오웰 &lt;1984&gt;
          </div>
        </div>
        <div>
        {/* 시작 버튼 */}
          <Link href="/questions">시작</Link>
          
        </div>
      </section>
    </>
  );
}
