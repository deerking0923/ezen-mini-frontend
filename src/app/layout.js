'use client';
import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Footer from './components/Footer';
import GoogleAnalytics from './GoogleAnalytics';
import { QuizProvider } from './sky/context/QuizContext';
export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [showHamburger, setShowHamburger] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoading(false);
  }, []);

  return (
    <html lang="ko">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>스카이 플래너</title>
      </Head>
      <GoogleAnalytics />
      <body>
      <QuizProvider>
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
          {/* 제목: 링크 포함 */}
          <div className="title-container">
            <Link href="/">
              <h1 className="header-title">스카이 플래너</h1>
            </Link>
          </div>
          {/* PC용 내비게이션: 모바일에서는 숨김 */}
          <div className="nav-links">
            {/* <Link href="/sky/height">
              <button className="nav-button">키 재기</button>
            </Link>
            <Link href="/sky/candlecalculator">
              <button className="nav-button">양초 계산하기</button>
            </Link> */}
            <Link href="/sky/credit">
              <button className="credit-button">크레딧</button>
            </Link>
          </div>
          {/* 모바일 전용: mounted 후 렌더링 */}
          {mounted && (
            <>
              <div
                className="hamburger"
                onClick={() => setShowHamburger(!showHamburger)}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </div>
              <div className={`mobile-nav ${showHamburger ? "show" : ""}`}>
                <Link href="/sky/height">
                  <button className="nav-button">키 재기</button>
                </Link>
                <Link href="/sky/travelingSprits/generalVisits/list">
                  <button className="nav-button">유랑 대백과</button>
                </Link>
                <Link href="/sky/mbti">
                  <button className="nav-button">성향 테스트</button>
                </Link>
                <Link href="/sky/candlecalculator">
                  <button className="nav-button">양초 계산기</button>
                </Link>
                <Link href="/sky/credit">
                  <button className="credit-button">크레딧</button>
                </Link>
              </div>
            </>
          )}
        </header>
        <main>{children}</main>
        <Footer />
        </QuizProvider>
      </body>
    </html>
  );
}
