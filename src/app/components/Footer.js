'use client';
import React from 'react';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© 2025 한국 하늘 계획표</span>
        <nav className="footer-nav">
          자료 출처
          <Link href="https://cafe.naver.com/blacknbiqa/478984">햇비님의 광채 시즌 가이드 보러가기</Link>
          <Link href="https://sky-children-of-the-light.fandom.com/wiki/Sky:_Children_of_the_Light_Wiki">아이콘은 스카이 위키에서!</Link>
          {/*<Link href="/">Privacy Policy</Link> */}
        </nav>
      </div>
    </footer>
  );
}
