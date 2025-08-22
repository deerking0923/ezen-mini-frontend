'use client';

import { useRouter } from 'next/navigation';
import styles from './MainPage.module.css';

export default function MainPageClient() {
  const router = useRouter();
  const navigateTo = (path) => router.push(path);

  const menu = [
    { title: '키재러 가기', img: '/sky/extra/height.png', path: '/sky/height' },
    { title: '양초 계산기', img: '/sky/extra/calculator.png', path: '/sky/candlecalculator' },
    { title: '유랑 대백과', img: '/sky/extra/dictionary.png', path: '/sky/travelingSprits/generalVisits/list' },
    { title: '이달의 모의고사', img: '/sky/extra/test.png', path: '/sky/test' },
    { title: '성향 테스트', img: '/sky/extra/mbti.png', path: '/sky/mbti' },
    { title: '키재기 가이드', img: '/guide.png', path: 'https://cafe.naver.com/blacknbiqa/490434' },
  ];

  return (
    <section className={styles.container}>
      {/* 메뉴 리스트 */}
      <div className={styles.menuCol}>
        {menu.map(({ title, img, path }) => (
          <button key={title} className={styles.menuBtn} onClick={() => navigateTo(path)}>
            <img src={img} alt={title} className={styles.icon} />
            <span className={styles.label}>{title}</span>
          </button>
        ))}
      </div>

      {/* 오른쪽 대표 이미지 */}
      <div className={styles.imageWrap}>
        <img
          src="/sky/extra/MainImage.png"
          alt="Sky main scene"
          className={styles.mainImage}
          loading="lazy"
        />
      </div>
    </section>
  );
}
