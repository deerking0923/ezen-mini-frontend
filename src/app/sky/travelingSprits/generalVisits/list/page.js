'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './list.css';

export default function SoulListPage() {
  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://korea-sky-planner.com/api/v1/souls?page=0')
      .then((res) => res.json())
      .then((data) => {
        console.log("API 응답 데이터:", data);
        // 응답 구조: { success: true, data: { content: [ ... ], ... } }
        setSouls(data.data?.content || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="title">영혼 목록</h1>
      <div className="buttonContainer">
        <Link href="/sky/travelingSprits/generalVisits/create">
          <button className="createButton">영혼 생성하기</button>
        </Link>
      </div>
      {souls.length === 0 ? (
        <p>등록된 영혼이 없습니다.</p>
      ) : (
        <ul className="list">
          {souls.map((soul) => (
            <li key={soul.id} className="listItem">
              <h2>
                <Link href={`/sky/travelingSprits/generalVisits/${soul.id}`}>
                  {soul.name}
                </Link>
              </h2>
              <p>시즌: {soul.seasonName}</p>
              <p>
                기간: {soul.startDate} ~ {soul.endDate}
              </p>
              <p>복각횟수: {soul.rerunCount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
