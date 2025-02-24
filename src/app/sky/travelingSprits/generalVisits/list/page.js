'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './list.css';

export default function SoulListPage() {
  const [souls, setSouls] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSouls = async (pageNumber, query) => {
    setLoading(true);
    let url = "";
    if (query && query.trim() !== "") {
      // 검색어가 있으면 search 엔드포인트 사용
      url = `https://korea-sky-planner.com/api/v1/souls/search?query=${encodeURIComponent(query)}`;
    } else {
      // 검색어가 없으면 페이지네이션 목록 조회
      url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      let results = [];
      if (query && query.trim() !== "") {
        // 검색 결과일 경우, data.data가 배열이면 그대로 사용
        if (data.data && Array.isArray(data.data)) {
          results = data.data;
        } else {
          results = [];
        }
        setTotalPages(1);
      } else {
        results = Array.isArray(data.data?.content) ? data.data.content : [];
        setTotalPages(data.data?.totalPages || 1);
      }
      setSouls(results);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSouls(page, submittedQuery);
  }, [page, submittedQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSubmittedQuery(searchQuery);
  };

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container">
      <h1 className="title">영혼 목록</h1>

      <div className="searchContainer">
        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            type="text"
            placeholder="키워드, 시즌, 영혼 이름 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            className="searchInput"
          />
          <button type="submit" className="searchButton">
            검색
          </button>
        </form>
      </div>

      <div className="buttonContainer">
        <Link href="/sky/travelingSprits/generalVisits/create">
          <button className="createButton">영혼 생성하기</button>
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : souls.length === 0 ? (
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

      {(!submittedQuery || submittedQuery.trim() === "") && (
        <div className="pagination">
          <button onClick={() => goToPage(page - 1)} disabled={page === 0}>
            이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages - 1}>
            다음
          </button>
        </div>
      )}
    </div>
  );
}
