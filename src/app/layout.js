'use client'; // 클라이언트 컴포넌트로 설정
import './globals.css'; // 글로벌 스타일
import './layout.css'; // 레이아웃 스타일
import { useState, useEffect } from 'react'; // 로딩 상태 관리
import { usePathname } from 'next/navigation'; // 현재 경로를 가져옵니다.
import Link from 'next/link'; // Link 컴포넌트 추가

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const pathname = usePathname(); // 현재 경로를 가져옵니다.

  useEffect(() => {
    // 페이지 로딩이 끝나면 로딩 상태를 false로 변경
    setLoading(false);
  }, []);

  // 홈 페이지에서는 헤더를 적용하지 않음
  if (pathname === '/') {
    return (
      <html lang="ko">
        <body>
          {/* 로딩 상태일 때만 스피너 표시 */}
          {loading && (
            <div className="loading-container">
              <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body>
        {/* 로딩 상태일 때만 스피너 표시 */}
        {loading && (
          <div className="loading-container">
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}

        <header className="header">
          {/* 로고 (왼쪽) */}
          <div className="logo">
            <Link href="/" passHref>
              {/* 홈 아이콘 이미지로 변경 */}
              <img src="/home.png" alt="홈" className="home-icon" />
            </Link>
          </div>

          {/* 제목 (가운데) */}
          <div className="title-container">
            <Link href="/questions" passHref>
              <h1 className="title">나의 문장을 말하다</h1>
            </Link>
          </div>

          {/* 실시간 채팅방 버튼 (오른쪽) */}
          <div className="nav-links">
            <Link href="/message" passHref>
              <button className="chat-button">오늘의 토론장</button>
            </Link>
          </div>
        </header>

        {/* 페이지 내용 */}
        {children}
      </body>
    </html>
  );
}
