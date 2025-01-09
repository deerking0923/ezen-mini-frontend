'use client';
import './globals.css'; // 위에서 만든 전역 CSS
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, []);

  // (1) 홈 페이지('/')에서는 헤더 없이 보여줌
  if (pathname === '/') {
    return (
      <html lang="ko">
        <body>
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

  // (2) 그 외 페이지에는 헤더가 나타남
  return (
    <html lang="ko">
      <body>
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
              <img src="/home.png" alt="홈" className="home-icon" />
            </Link>
          </div>

          {/* 가운데 타이틀 */}
          <div className="title-container">
            <Link href="/questions" passHref>
              <h1 className="title">나의 문장을 말하다</h1>
            </Link>
          </div>

          {/* 오른쪽 버튼 */}
          <div className="nav-links">
            <Link href="/message" passHref>
              <button className="chat-button">오늘의 토론장</button>
            </Link>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        {children}
      </body>
    </html>
  );
}
