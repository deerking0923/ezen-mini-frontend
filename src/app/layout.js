import Link from 'next/link';
import styles from './layout.module.css';
import { QuizProvider } from './sky/context/QuizContext';   // ★ 추가

/* ───── metadata ───── */
export const metadata = {
  title: '스카이 플래너',
};

/* ───── viewport (분리) ───── */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {/* ─── 모든 페이지를 퀴즈 컨텍스트로 감싸기 ─── */}
        <QuizProvider>
          {/* ───── 배너 영역 ───── */}
          <header className={styles.banner}>
            <div className={styles.overlay}>
              {/* 타이틀 → 클릭하면 루트("/") 로 이동 */}
              <Link href="/" className={styles.titleLink}>
                <h1 className={styles.title}>스카이 플래너</h1>
              </Link>

              <p className={styles.subtitle}>
                이 사이트는 thatgamecompany의
                <br className={styles.mobileBreak} />
                Sky: Children of the Light 팬사이트입니다.
              </p>

              {/* CTA 버튼 */}
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

              {/* 만든이 문구 */}
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
