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
      {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <title>스카이 한국 팬사이트</title>
        {/* Google Analytics 추적 코드 */}
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
          <div className="title-container">
            <Link href="/" passHref>
              <h1 className="header-title">스카이 한국 팬사이트</h1>
            </Link>
          </div>
          <div className="nav-links">
            <Link href="/sky/height" passHref>
              <button className="nav-button">키 재기</button>
            </Link>
            <Link href="/sky/height" passHref>
              <button className="nav-button">양초 계산하기</button>
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
