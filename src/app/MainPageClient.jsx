'use client';

import { useRouter } from 'next/navigation';
import styles from './MainPage.module.css';

export default function MainPageClient() {
  const router = useRouter();

  const navigateTo = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      router.push(path);
    }
  };

  const menu = [
    { title: '키 재기', img: '/sky/extra/height.png', path: '/sky/height' },
    { title: '양초 계산기', img: '/sky/extra/calculator.png', path: '/sky/temp' },
    { title: '유랑 대백과', img: '/sky/extra/dictionary.png', path: '/sky/travelingSprits/generalVisits/list' },
    { title: '오래된 유랑', img: '/sky/extra/oldestSprits.png', path: '/sky/travelingSprits/oldestSprits' },
    //{ title: '버스 노선표', img: '/sky/extra/busTable.png', path: '/sky/busTable' },
    { title: '악보 만들기', img: '/sky/extra/musicEditor.png', path: '/sky/musicEditor' },
    { title: '10월 모의고사', img: '/sky/extra/test.png', path: '/sky/test' },
    { title: '성향 테스트', img: '/sky/extra/mbti.png', path: '/sky/mbti' },
    { title: '크레딧', img: '/sky/extra/profile.png', path: '/sky/credit' },
  ];

  return (
    <>

      <main className={styles.container}>
        {/* 메뉴 그리드 */}
        <section className={styles.menuGrid}>
          {menu.map(({ title, img, path }) => (
            <button key={title} className={styles.menuCard} onClick={() => navigateTo(path)}>
              <img src={img} alt={title} className={styles.icon} />
              <span className={styles.label}>{title}</span>
            </button>
          ))}
        </section>
      </main>
    </>
  );
}
