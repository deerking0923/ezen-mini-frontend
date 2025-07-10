import Link from "next/link";
import styles from "./layout.module.css";
import { QuizProvider } from "./sky/context/QuizContext";

/* ───── 사이트 도메인 (반드시 https:// 포함, 끝에 슬래시 X) ───── */
export const metadataBase = new URL("https://korea-sky-planner.com");

/* ───── metadata ───── */
export const metadata = {
  title: "스카이 플래너",
  description: "Sky: Children of the Light 한국 유저를 위한 팬사이트",
  openGraph: {
    title: "스카이 플래너",
    description: "Sky: Children of the Light 한국 유저를 위한 팬사이트",
    url: "https://korea-sky-planner.com",
    siteName: "스카이 플래너",
    images: [
      {
        url: "/sky/presentation.jpg", // ✔ public 경로 (상대)
        width: 1200, // 권장 사이즈
        height: 630,
        alt: "스카이 플래너 대표 이미지",
      },
    ],
    type: "website",
  },
};

/* ───── viewport ───── */
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <QuizProvider>
          {/* 배너 영역 */}
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

              <img
                src="/sky/presentation.jpg"
                alt="스카이 플래너 대표 이미지"
                width={1200}
                height={630}
                className={styles.ogImage}
                aria-hidden
              />

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

          {/* 페이지 콘텐츠 */}
          <main className={styles.content}>{children}</main>
        </QuizProvider>
      </body>
    </html>
  );
}
