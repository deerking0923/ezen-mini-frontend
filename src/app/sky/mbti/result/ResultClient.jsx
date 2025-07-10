'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { QuizContext } from '../../context/QuizContext';
import { calcResult } from '../../utils/calculateResult';
import styles from './ResultPage.module.css';

export default function ResultClient() {
  const ctx = useContext(QuizContext);          // 퀴즈 컨텍스트
  const router = useRouter();

  /* 빌드 · 새로고침 시 Provider 없으면 가드 화면 */
  if (!ctx) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        결과는 퀴즈를 완료한 뒤에만 확인할 수 있습니다. <br />
        <Link href="/sky/mbti">퀴즈 풀러 가기</Link>
      </div>
    );
  }

  /* 실제 결과 계산 */
  const { answers } = ctx;
  const code = calcResult(answers);
  const fullImageSrc = `/sky/mbti/result3/${code.toLowerCase()}.jpg`;
  const headImageSrc = `/sky/mbti/result3/${code.toLowerCase()}_head.jpg`;

  /* 마운트 후에만 렌더링(SSR flash 방지) */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  /* 버튼 핸들러 */
  const download = (src, name) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className={styles.container}>
      {/* 결과 이미지 */}
      <div className={styles.imageWrapper}>
        <Image
          src={fullImageSrc}
          alt={`${code} 결과 이미지`}
          width={500}
          height={800}
          priority
          style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
        />
      </div>

      {/* 다운로드 버튼 */}
      <div className={styles.buttonRow}>
        <button
          className={`${styles.button} ${styles.downloadLink}`}
          onClick={() => download(headImageSrc, `${code}_head.jpg`)}
        >
          결과 다운로드
        </button>
      </div>

      {/* 공유 / 다른 유형 버튼 */}
      <div className={`${styles.buttonRow} ${styles.secondaryRow}`}>
        <button
          className={styles.secondaryButton}
          onClick={() =>
            navigator.clipboard.writeText(
              'https://korea-sky-planner.com/sky/mbti',
            )
          }
        >
          공유하기
        </button>
        <button
          className={styles.secondaryButton}
          onClick={() => router.push('/sky/mbti/gallery')}
        >
          다른 유형 보러가기
        </button>
      </div>
    </main>
  );
}
