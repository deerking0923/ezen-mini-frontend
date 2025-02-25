"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./list.module.css";

export default function SoulListPage() {
  const [souls, setSouls] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [viewMode, setViewMode] = useState("card"); // "card" or "list"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 시즌 이름 목록 (클릭 시 자동 검색)
  const seasonList = [
    { name: "감사", color: "#FFD700" }, // 노란색
    { name: "빛추", color: "#FF6347" }, // 토마토
    { name: "친밀", color: "#4CAF50" }, // 초록색
    { name: "리듬", color: "#3F51B5" }, // 파란색
    { name: "마법", color: "#9C27B0" }, // 보라색
    { name: "낙원", color: "#FF5722" }, // 오렌지색
    { name: "예언", color: "#9E9E9E" }, // 회색
    { name: "꿈", color: "#00BCD4" }, // 청록색
    { name: "협력", color: "#8BC34A" }, // 연두색
    { name: "어린왕자", color: "#FFC107" }, // 노란색
    { name: "비행", color: "#03A9F4" }, // 파란색
    { name: "심해", color: "#2196F3" }, // 진한 파란색
    { name: "공연", color: "#FF4081" }, // 핑크색
    { name: "파편", color: "#607D8B" }, // 회색
    { name: "오로라", color: "#673AB7" }, // 보라색
    { name: "기억", color: "#009688" }, // 청록색
    { name: "성장", color: "#8BC34A" }, // 초록색
    { name: "순간", color: "#FF9800" }, // 오렌지색
    { name: "재생", color: "#3F51B5" }, // 파란색
    { name: "사슴", color: "#A1887F" }, // 갈색
    { name: "둥지", color: "#795548" }, // 갈색
    { name: "듀엣", color: "#FFEB3B" }, // 노란색
    { name: "무민", color: "#CDDC39" }, // 연두색
    { name: "광채", color: "#FF1493" }, // 딥핑크
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
      if (viewMode === "card") {
        // 카드 보기: 페이지네이션 적용 (한 페이지당 12개)
        url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
      } else {
        // 리스트 보기: 전체 목록 반환 (엔드포인트 가정: /api/v1/souls/all)
        url = `https://korea-sky-planner.com/api/v1/souls/all`;
      }
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      let results = [];
      if (query && query.trim() !== "") {
        results = data.data && Array.isArray(data.data) ? data.data : [];
        setTotalPages(1);
      } else {
        if (viewMode === "card") {
          results = Array.isArray(data.data?.content) ? data.data.content : [];
          setTotalPages(data.data?.totalPages || 1);
        } else {
          // 리스트 view: 전체 목록 (페이지네이션 없음)
          results = Array.isArray(data.data) ? data.data : [];
          setTotalPages(1);
        }
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
    // 리스팅 방식(viewMode)이 바뀌면 페이지를 초기화합니다.
    setPage(0);
    fetchSouls(0, submittedQuery);
  }, [submittedQuery, viewMode]);

  useEffect(() => {
    if (viewMode === "card") {
      fetchSouls(page, submittedQuery);
    }
  }, [page, submittedQuery, viewMode]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSubmittedQuery(searchQuery);
  };

  const handleSeasonClick = (seasonName) => {
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
      {/* 공지 영역 */}
      <div className={styles.noticePanel}>
        <h2 className={styles.noticeTitle}>역대 유랑</h2>
        <p className={styles.noticeDescription}>
          본 게시판은 지금까지 온 유랑들의 정보를 담고 있는 게시판입니다.
          <br />
          찾고 있는 유랑이 기억나지 않을 때 검색창에 키워드를 입력해
          검색해주세요.
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
              key={season.name} // 고유한 key 값은 name 사용
              className={styles.seasonChip}
              style={{ backgroundColor: season.color }} // 동적으로 배경색을 적용
              onClick={() => handleSeasonClick(season.name)}
            >
              {season.name}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 버튼 */}
      <div className={styles.viewTabs}>
        <button
          className={`${styles.tabButton} ${
            viewMode === "card" ? styles.activeTab : ""
          }`}
          onClick={() => setViewMode("card")}
        >
          사진 보기
        </button>
        <button
          className={`${styles.tabButton} ${
            viewMode === "list" ? styles.activeTab : ""
          }`}
          onClick={() => setViewMode("list")}
        >
          리스트 보기
        </button>
      </div>

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
      ) : viewMode === "card" ? (
        <>
          <div className={styles.cardsGrid}>
            {souls.map((soul) => (
              <Link
                href={`/sky/travelingSprits/generalVisits/${soul.id}`}
                key={soul.id}
                className={styles.soulCard}
              >
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
                  {/* 첫 번째 줄: 시즌 이름 패널 + 영혼 이름 */}
                  <p className={styles.firstLine}>
                    <span
                      className={styles.seasonName}
                      style={{
                        backgroundColor:
                          seasonList.find(
                            (season) => season.name === soul.seasonName
                          )?.color || "#444",
                      }}
                    >
                      {soul.seasonName}
                    </span>
                    <span className={styles.soulName}>{soul.name}</span>
                  </p>
                  {/* 두 번째 줄: 순서와 복각 횟수 */}
                  <p className={styles.secondLine}>
                    {soul.orderNum}번째 | {soul.rerunCount}번 복각
                  </p>
                  {/* 세 번째 줄: 날짜만 표시 (기간 레이블 없이, 작은 글씨) */}
                  <p className={styles.thirdLine}>
                    {soul.startDate} ~ {soul.endDate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {/* 카드 보기는 페이지네이션 있음 */}
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
        </>
      ) : (
        // 리스트 보기: 전체 목록, 페이지네이션 없이 테이블 형식 표시
        <table className={styles.tableView}>
          <thead>
            <tr>
              <th className={styles.thOrder}>순서</th>
              <th className={styles.thSeason}>시즌</th>
              <th className={styles.thName}>이름</th>
              <th className={styles.thPeriod}>기간</th>
              <th className={styles.thRerun}>복각 횟수</th>
            </tr>
          </thead>
          <tbody>
            {souls.map((soul) => (
              <tr key={soul.id} className={styles.tableRow}>
                <td className={styles.tdOrder}>{soul.orderNum}</td>
                <td className={styles.tdSeason}>
                  <span
                    className={styles.seasonName}
                    style={{
                      backgroundColor:
                        seasonList.find(
                          (season) => season.name === soul.seasonName
                        )?.color || "#444", // 색상 적용
                    }}
                  >
                    {soul.seasonName}
                  </span>
                </td>
                <td className={styles.tdName}>
                  <Link href={`/sky/travelingSprits/generalVisits/${soul.id}`}>
                    {soul.name}
                  </Link>
                </td>
                <td className={styles.tdPeriod}>
                  {soul.startDate} ~ {soul.endDate}
                </td>
                <td className={styles.tdRerun}>{soul.rerunCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
