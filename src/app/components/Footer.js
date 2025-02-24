'use client';
import React from 'react';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© 2025 한국 하늘 계획표 &lt;만든이 진사슴&gt;</span>
        <nav className="footer-nav">
          <Link href="/sky/credit">크레딧</Link>
        </nav>
      </div>
    </footer>
  );
}
