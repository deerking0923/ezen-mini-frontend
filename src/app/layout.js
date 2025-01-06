'use client'; // 클라이언트 컴포넌트로 설정
import './globals.css'; // 글로벌 스타일
import './layout.css'; // 레이아웃 스타일
import { usePathname } from 'next/navigation'; // 현재 경로를 가져옵니다.
import Link from 'next/link'; // Link 컴포넌트 추가

export default function Layout({ children }) {
  const pathname = usePathname(); // 현재 경로를 가져옵니다.

  // 홈 페이지에서는 레이아웃을 적용하지 않음
  if (pathname === '/') {
    return (
      <html lang="ko">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body>
        <header className="header">
          <div className="logo">
            <Link href="/" passHref>
              {/* '홈' 텍스트로 변경 */}
              <span className="home-text">홈</span>
            </Link>
          </div>
          <div className="title-container">
            {/* '나의 문장을 말하다'에 링크 추가, 가운데 배치 */}
            <Link href="/questions" passHref>
              <h1 className="title">나의 문장을 말하다</h1>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
