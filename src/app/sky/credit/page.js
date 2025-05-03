"use client";
import React from "react";
import Link from "next/link";
import styles from "./Credit.module.css";

export default function Credit() {
  return (
    <div className={styles.creditPage}>
      <h1>크레딧</h1>
      <div className={styles.creditContent}>
        <p>제작자 - 진사슴</p>
          <div className={styles.links}>
          <ul>
            <li>유랑 대백과 자료 제작 - 무륵, 망고, 엔</li>
            <li>스카이 성향 테스트 그림 - 무륵</li>
            <li>
              <Link href="https://cafe.naver.com/blacknbiqa/482371">
                사이트 가이드 보러가기
              </Link>
            </li>
            <li>
              <Link href="https://cafe.naver.com/blacknbiqa/486836">
                햇비님의 파랑새 시즌 가이드 보러가기
              </Link>
            </li>
            <li>
              <Link href="https://sky-children-of-the-light.fandom.com/wiki/Sky:_Children_of_the_Light_Wiki">
                스카이 위키로 아이콘 보러가기
              </Link>
            </li>
            <li>
              <Link href="https://cafe.naver.com/blacknbiqa/356014">
                미욘새님의 키재는 방법
              </Link>
            </li>
            <li>
              <Link href="https://cafe.naver.com/blacknbiqa/72508">
                큐큘님의 카페 기준 키재기
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
