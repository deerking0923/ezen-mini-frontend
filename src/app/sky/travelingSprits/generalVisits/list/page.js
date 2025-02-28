"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./list.module.css";

export default function SoulListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // URL의 page 값을 읽어 초기 페이지(1-indexed) 결정
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [souls, setSouls] = useState([]);
  // 내부 state는 0-indexed로 관리 (ex. 0 => 1페이지)
  const [page, setPage] = useState(initialPage - 1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [viewMode, setViewMode] = useState("card"); // "card" or "list"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 리스트 보기 모드에서 정렬 기준 ("latest" : 최신순, "oldest" : 오래된 순)
  const [listSort, setListSort] = useState("latest");

  const currentPage = page + 1;
  const pageBlockStart = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const pageBlockEnd = Math.min(pageBlockStart + 9, totalPages);
  const pageButtons = [];
  for (let i = pageBlockStart; i <= pageBlockEnd; i++) {
    pageButtons.push(i);
  }

  const fetchSouls = async (pageNumber, query) => {
    setLoading(true);
    let url = "";
    if (query && query.trim() !== "") {
      // 검색어가 있으면 search 엔드포인트 사용 (페이지네이션 X)
      url = `https://korea-sky-planner.com/api/v1/souls/search?query=${encodeURIComponent(
        query
      )}`;
    } else {
      if (viewMode === "card") {
        // 카드 보기: 페이지네이션 적용 (한 페이지당 12개)
        url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
      } else {
        // 리스트 보기: 전체 목록 반환, 정렬에 따라 API 선택
        if (listSort === "oldest") {
          url = `https://korea-sky-planner.com/api/v1/souls/reverse`;
        } else {
          url = `https://korea-sky-planner.com/api/v1/souls/all`;
        }
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
          // 리스트 보기: 전체 목록, 페이지네이션 없이
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

  // viewMode, page, submittedQuery, listSort 변경 시 데이터를 다시 가져옵니다.
  useEffect(() => {
    fetchSouls(page, submittedQuery);
  }, [page, submittedQuery, viewMode, listSort]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSubmittedQuery(searchQuery);
    router.push(`/sky/travelingSprits/generalVisits/list?page=1`);
  };

  const handleSeasonClick = (seasonName) => {
    setSearchQuery(seasonName);
    setSubmittedQuery(seasonName);
    setPage(0);
    router.push(`/sky/travelingSprits/generalVisits/list?page=1`);
  };

  // 페이지 버튼 클릭 시 state와 URL 업데이트 (카드 보기에서만 적용)
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber - 1);
    router.push(`/sky/travelingSprits/generalVisits/list?page=${pageNumber}`);
  };

  const seasonList = [
    { name: "감사", color: "#FFD700" },
    { name: "빛추", color: "#FF6347" },
    { name: "친밀", color: "#4CAF50" },
    { name: "리듬", color: "#3F51B5" },
    { name: "마법", color: "#9C27B0" },
    { name: "낙원", color: "#FF5722" },
    { name: "예언", color: "#9E9E9E" },
    { name: "꿈", color: "#00BCD4" },
    { name: "협력", color: "#8BC34A" },
    { name: "어린왕자", color: "#FFC107" },
    { name: "비행", color: "#03A9F4" },
    { name: "심해", color: "#2196F3" },
    { name: "공연", color: "#FF4081" },
    { name: "파편", color: "#607D8B" },
    { name: "오로라", color: "#673AB7" },
    { name: "기억", color: "#009688" },
    { name: "성장", color: "#8BC34A" },
    { name: "순간", color: "#FF9800" },
    { name: "재생", color: "#3F51B5" },
    { name: "사슴", color: "#A1887F" },
    { name: "둥지", color: "#795548" },
    { name: "듀엣", color: "#FFEB3B" },
    { name: "무민", color: "#CDDC39" },
    { name: "광채", color: "#FF1493" },
  ];

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
            (ex - 족제비, 유랑단, 수염)
          </span>
        </p>
        <p className={styles.noticeSubDescription}>
          아래 시즌 이름을 클릭하면 자동 검색됩니다:
        </p>
        <br />
        <div className={styles.seasonChipsContainer}>
          {seasonList.map((season) => (
            <button
              key={season.name}
              className={styles.seasonChip}
              style={{ backgroundColor: season.color }}
              onClick={() => handleSeasonClick(season.name)}
            >
              {season.name}
            </button>
          ))}
        </div>
      </div>
      {/* 검색 영역 */}
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
        {viewMode === "list" && (
          <div className={styles.sortButtons}>
            <button
              className={`${styles.sortButton} ${
                listSort === "latest" ? styles.activeSort : ""
              }`}
              onClick={() => setListSort("latest")}
            >
              최신순
            </button>
            <button
              className={`${styles.sortButton} ${
                listSort === "oldest" ? styles.activeSort : ""
              }`}
              onClick={() => setListSort("oldest")}
            >
              오래된 순
            </button>
          </div>
        )}
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
                href={`/sky/travelingSprits/generalVisits/${soul.id}?page=${currentPage}`}
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
                  <p className={styles.secondLine}>
                    {soul.orderNum < 0 ? (
                      <strong style={{ color: "blue" }}>
                        {`${Math.abs(soul.orderNum)}번째 유랑단`}
                      </strong>
                    ) : (
                      `${soul.orderNum}번째`
                    )}{" "}
                    | {soul.rerunCount}차 복각
                  </p>
                  <p className={styles.thirdLine}>
                    {soul.startDate} ~ {soul.endDate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {submittedQuery.trim() === "" && viewMode === "card" && (
            <div className={styles.pagination}>
              {pageButtons.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={currentPage === p ? styles.activePage : ""}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* 리스트 보기 모드: 정렬 버튼 */}
          <table className={styles.tableView}>
            <thead>
              <tr>
                <th className={styles.thOrder}>순서</th>
                <th className={styles.thSeason}>시즌</th>
                <th className={styles.thName}>이름</th>
                <th className={styles.thPeriod}>기간</th>
                <th className={styles.thRerun}>n차 복각</th>
              </tr>
            </thead>
            <tbody>
              {souls.map((soul) => (
                <tr
                  key={soul.id}
                  className={styles.tableRow}
                  onClick={() =>
                    router.push(`/sky/travelingSprits/generalVisits/${soul.id}`)
                  }
                >
                  <td className={styles.tdOrder}>
                    {soul.orderNum < 0 ? (
                      <span style={{ color: "blue" }}>
                        {`${Math.abs(soul.orderNum)}번째 유랑단`}
                      </span>
                    ) : (
                      `${soul.orderNum}번째`
                    )}
                  </td>
                  <td className={styles.tdSeason}>
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
                  </td>
                  <td className={styles.tdName}>{soul.name}</td>
                  <td className={styles.tdPeriod}>
                    {soul.startDate} ~ {soul.endDate}
                  </td>
                  <td className={styles.tdRerun}>{soul.rerunCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
