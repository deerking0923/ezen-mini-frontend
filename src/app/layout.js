import Link from 'next/link';
import styles from './layout.module.css';
import { QuizProvider } from './sky/context/QuizContext';
import GoogleAnalytics from './GoogleAnalytics';   // ← GA 컴포넌트
import '@/app/globals.css';

/* ───────── 뷰포트 메타 ───────── */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta
          property="og:image"
          content="https://korea-sky-planner.com/sky/presentation.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>

      <body>
        {/* ───── Google Analytics: 한 번만 로드 ───── */}
        <GoogleAnalytics />

        <QuizProvider>
          {/* ───── 배너 ───── */}
          <header className={styles.banner}>
            {/* 좌상단 크레딧 링크 */}
            <Link href="/sky/credit" className={styles.creditLink}>
              © credit
            </Link>

            <div className={styles.overlay}>
              <Link href="/" className={styles.titleLink}>
                <h1 className={styles.title}>스카이 플래너</h1>
              </Link>

              <p className={styles.subtitle}>
                이 사이트는 thatgamecompany의&nbsp;
                <br className={styles.mobileBreak} />
                Sky: Children of the Light 팬사이트입니다.
              </p>

              <div className={styles.ctaWrapper}>
                <Link
                  href="https://cafe.naver.com/blacknbiqa"
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
