"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./list.module.css"; // CSS Modules 사용하는 경우 (권장)
// 만약 전역 list.css로 사용하실 거라면 import "./list.css"; 로 변경하세요.

export default function SoulListPage() {
  const [souls, setSouls] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 시즌 이름 목록 (클릭 시 자동 검색)
  const seasonList = [
    "감사","빛추","친밀","리듬","마법","낙원","예언","꿈","협력","어린왕자",
    "비행","심해","공연","파편","오로라","기억","성장","순간","부흥","사슴",
    "둥지","듀엣","무민","광휘"
  ];

  const fetchSouls = async (pageNumber, query) => {
    setLoading(true);
    let url = "";
    if (query && query.trim() !== "") {
      // 검색어가 있으면 search 엔드포인트 사용
      url = `https://korea-sky-planner.com/api/v1/souls/search?query=${encodeURIComponent(
        query
      )}`;
    } else {
      // 검색어가 없으면 페이지네이션 목록 조회
      url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      let results = [];
      if (query && query.trim() !== "") {
        // 검색 결과
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

  const handleSeasonClick = (seasonName) => {
    // 시즌 이름을 검색 쿼리로 사용
    setSearchQuery(seasonName);
    setSubmittedQuery(seasonName);
    setPage(0);
  };

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className={styles.container}>
      {/* 상단 공지 패널 */}
      <div className={styles.noticePanel}>
        <h2 className={styles.noticeTitle}>역대 유랑</h2>
        <p className={styles.noticeDescription}>
          본 게시판은 지금까지 온 유랑들의 정보를 담고 있는 게시판입니다.
          <br />
          찾고 있는 유랑이 기억나지 않을 때 검색창에 키워드를 입력해 검색해주세요.
          <br />
          시즌 이름이나 대표 이름으로 검색이 가능합니다.
          <br />
          <span className={styles.noticeExample}>
            (ex - 족제비, 불템, 마법)
          </span>
        </p>
        <p className={styles.noticeSubDescription}>
          아래 시즌 이름을 클릭하면 자동 검색됩니다:
        </p>
        <div className={styles.seasonChipsContainer}>
          {seasonList.map((season) => (
            <button
              key={season}
              className={styles.seasonChip}
              onClick={() => handleSeasonClick(season)}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      <h1 className={styles.title}>영혼 목록</h1>

      <div className={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="키워드, 시즌, 영혼 이름 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>
      </div>

      <div className={styles.buttonContainer}>
        <Link href="/sky/travelingSprits/generalVisits/create">
          <button className={styles.createButton}>영혼 생성하기</button>
        </Link>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : souls.length === 0 ? (
        <p>등록된 영혼이 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {souls.map((soul) => (
            <li key={soul.id} className={styles.soulCard}>
              {/* 대표이미지 정사각형 표시 */}
              <div className={styles.imageWrapperSquare}>
                {soul.representativeImage ? (
                  <img
                    src={soul.representativeImage}
                    alt={soul.name}
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.soulName}>
                  <Link href={`/sky/travelingSprits/generalVisits/${soul.id}`}>
                    {soul.name}
                  </Link>
                </h2>
                <p className={styles.seasonName}>
                  시즌: <span>{soul.seasonName}</span>
                </p>
                {/* 복각횟수: 빨간색 */}
                <p className={styles.rerunCount}>
                  복각: <span className={styles.redCount}>{soul.rerunCount}</span>
                </p>
                {/* 순서, 기간 */}
                <p className={styles.orderNum}>순서: {soul.orderNum}</p>
                <p className={styles.period}>
                  기간: {soul.startDate} ~ {soul.endDate}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 페이지네이션 (검색어 없을 때만) */}
      {(!submittedQuery || submittedQuery.trim() === "") && (
        <div className={styles.pagination}>
          <button onClick={() => goToPage(page - 1)} disabled={page === 0}>
            이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
