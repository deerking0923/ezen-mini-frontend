'use client'; // 👈 1. 클라이언트 컴포넌트로 변경

import Script from 'next/script';
import { usePathname } from 'next/navigation'; // 👈 2. usePathname 임포트
import { useEffect } from 'react'; // 👈 3. useEffect 임포트

export default function GoogleAnalytics() {
  const pathname = usePathname(); // 👈 4. 현재 경로를 가져옵니다.

  // 5. 경로(pathname)가 바뀔 때마다 실행되는 효과 훅
  useEffect(() => {
    // gtag 함수가 로드되었는지 확인
    if (window.gtag) {
      window.gtag('config', 'G-FTLELSQ2LC', {
        page_path: pathname,
      });
    }
  }, [pathname]); // pathname이 변경될 때마다 이 코드를 다시 실행

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-FTLELSQ2LC"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FTLELSQ2LC', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}