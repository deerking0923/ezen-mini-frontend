// Credit.tsx
"use client";
import React from "react";
import Link from "next/link";
import styles from "./Credit.module.css";

export default function Credit() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.creditPage}>
        <h1>크레딧</h1>
        <div className={styles.creditContent}>
          <p>만든이 – 진사슴</p>
          <ul className={styles.links}>
            <li>유랑 대백과 자료 제작 – 무륵, 망고, 엔, 진사슴</li>
            <li>스카이 성향 테스트 그림 – 무륵</li>
            <li>양초계산기 아이콘 – 햇비</li>
            <li>
              <Link href="https://cafe.naver.com/blacknbiqa/483061">
                사이트 가이드 보러가기
              </Link>
            </li>
            <li>
              <Link href="https://sky-children-of-the-light.fandom.com/wiki/Sky:_Children_of_the_Light_Wiki">
                스카이 위키로 아이콘 보러가기
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
