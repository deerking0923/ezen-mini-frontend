'use client';
import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from './components/Footer';

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=800" />
        <title>스카이 플래너</title>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FTLELSQ2LC"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FTLELSQ2LC', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
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
          {/* 크레딧 버튼을 왼쪽에 배치 */}
          <div className="title-container">
            <Link href="/" passHref>
              <h1 className="header-title">스카이 플래너</h1>
            </Link>
          </div>
          <div className="nav-links">
            <Link href="/sky/height" passHref>
              <button className="nav-button">키 재기</button>
            </Link>
            <Link href="/sky/candlecalculator" passHref>
              <button className="nav-button">양초 계산하기</button>
            </Link>
            <Link href="/sky/credit" passHref>
              <button className="credit-button">크레딧</button>
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
