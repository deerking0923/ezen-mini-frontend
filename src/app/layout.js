import Link from 'next/link';
import styles from './layout.module.css';
import { QuizProvider } from './sky/context/QuizContext';

/* ───────── 뷰포트 ───────── */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      {/* ───── <head> : OG 대표 이미지 확정 ───── */}
      <head>
        <meta
          property="og:image"
          content="https://korea-sky-planner.com/sky/presentation.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* 필요하다면 title·description도 직접 지정 가능 */}
      </head>

      <body>
        <QuizProvider>
          {/* ───── 배너 영역 ───── */}
          <header className={styles.banner}>
            <div className={styles.overlay}>
              <Link href="/" className={styles.titleLink}>
                <h1 className={styles.title}>스카이 플래너</h1>
              </Link>

              <p className={styles.subtitle}>
                이 사이트는 thatgamecompany의
                <br className={styles.mobileBreak} />
                Sky: Children of the Light 팬사이트입니다.
              </p>

              {/* OG 이미지가 이미 head에 있으므로 여기에 숨김 이미지 필요 X */}

              <div className={styles.ctaWrapper}>
                <Link
                  href="https://cafe.naver.com/blacknbiqa/490434"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaButton}
                >
                  <img
                    src="/sky/extra/cafe_icon.png"
                    alt="네이버 카페 아이콘"
                    className={styles.icon}
                  />
                  네이버 카페로 바로가기
                </Link>

                <Link
                  href="https://game.naver.com/lounge/thatskylounge/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaButton}
                >
                  <img
                    src="/sky/extra/gamelounge_icon.png"
                    alt="게임 라운지 아이콘"
                    className={styles.icon}
                  />
                  공식 게임 라운지로 가기
                </Link>
              </div>

              <span className={styles.maker}>만든이 진사슴</span>
            </div>
          </header>

          {/* ───── 페이지 콘텐츠 ───── */}
          <main className={styles.content}>{children}</main>
        </QuizProvider>
      </body>
    </html>
  );
}
