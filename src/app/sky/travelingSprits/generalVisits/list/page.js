"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./list.module.css";

// 이 컴포넌트는 useSearchParams를 사용합니다
function SoulListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [souls, setSouls] = useState([]);
  const [page, setPage] = useState(0); // Page state (0-based index)
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listSort, setListSort] = useState("latest");

  const [isClient, setIsClient] = useState(false); // To check if the code is running client-side

  const currentPage = page + 1; // 1-based page number for display

  // 상단에 추가
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDate = (dateStr) => {
    const parts = dateStr.split("-");
    return isMobile && parts.length === 3
      ? `${parts[0].slice(-2)}.${parts[1]}.${parts[2]}`
      : dateStr;
  };
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    setPage(initialPage - 1); // Adjust for 0-based index
  }, [searchParams]);

  const fetchSouls = async (pageNumber, query) => {
    setLoading(true);
    let url = "";
    if (query && query.trim() !== "") {
      url = `https://korea-sky-planner.com/api/v1/souls/search?query=${encodeURIComponent(
        query
      )}`;
    } else {
      if (viewMode === "card") {
        url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
      } else {
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
          results = Array.isArray(data.data) ? data.data : [];
          setTotalPages(1);
        }
      }
      setSouls(results);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchSouls(page, submittedQuery);
    }
  }, [page, submittedQuery, viewMode, listSort, isClient]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSubmittedQuery(searchQuery);
    router.push(`/sky/travelingSprits/generalVisits/list?page=1`);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber - 1);
    router.push(`/sky/travelingSprits/generalVisits/list?page=${pageNumber}`);
  };

  const handleSeasonClick = (seasonName) => {
    setSearchQuery(seasonName);
    setSubmittedQuery(seasonName);
    setPage(0);
    router.push(`/sky/travelingSprits/generalVisits/list?page=1`);
  };

  // 현재 페이지 그룹 계산 (1-10, 11-20 등)
  const getCurrentPageGroup = () => {
    return Math.floor((currentPage - 1) / 5);
  };

  // 페이지네이션 범위 계산
  // 페이지네이션 범위 계산
  const getPaginationRange = () => {
    const pageGroup = getCurrentPageGroup();
    const start = pageGroup * 5 + 1; // 5개씩 그룹화
    const end = Math.min(start + 4, totalPages); // 5개의 페이지 번호를 표시

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
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
          <br />
          본 게시판은 지금까지 온 유랑들의 정보를 담고 있는 게시판입니다.
          <br />
          <br />
          찾고 있는 유랑이 기억나지 않을 때 검색창에 키워드를 입력해
          검색해주세요.
          <br />
          <br />
          <span className={styles.noticeExample}>
            (ex - 족제비, 유랑단, 수염)
          </span>
        </p>
        <br />
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

      {/* 로딩 및 오류 처리 */}
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : souls.length === 0 ? (
        <p>등록된 영혼이 없습니다.</p>
      ) : viewMode === "card" ? (
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
                      {isMobile
                        ? `#${Math.abs(soul.orderNum)}`
                        : `${Math.abs(soul.orderNum)}번째 유랑단`}
                    </strong>
                  ) : (
                    `${soul.orderNum}번째`
                  )}{" "}
                  | {soul.rerunCount}차 복각
                </p>
                <p className={styles.thirdLine}>
                  {formatDate(soul.startDate)} ~ {formatDate(soul.endDate)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <table className={styles.tableView}>
          <thead>
            <tr>
              <th className={styles.thOrder}>순서</th>
              <th className={styles.thSeason}>시즌</th>
              <th className={styles.thName}>이름</th>
              <th className={styles.thPeriod}>기간</th>
              <th className={styles.thRerun}>n차</th>
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
                style={{ cursor: "pointer" }}
              >
                <td
                  className={`${styles.tdOrder} ${
                    soul.orderNum < 0 ? "negative" : ""
                  }`}
                >
                  {soul.orderNum < 0 ? (
                    <span>{Math.abs(soul.orderNum)}</span>
                  ) : (
                    soul.orderNum
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
      )}

      {/* 페이지네이션 */}
      {viewMode === "card" && totalPages > 1 && (
        <div className={styles.pagination}>
          {/* 이전 페이지 그룹으로 이동 */}
          {getCurrentPageGroup() > 0 && (
            <button
              className={styles.pageButton}
              onClick={() =>
                handlePageChange((getCurrentPageGroup() - 1) * 5 + 1)
              } // 5개씩 그룹을 이동
            >
              &laquo;
            </button>
          )}

          {/* 페이지 번호 */}
          {getPaginationRange().map((pageNum) => (
            <button
              key={pageNum}
              className={`${styles.pageButton} ${
                pageNum === currentPage ? styles.activePage : ""
              }`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          {/* 다음 페이지 그룹으로 이동 */}
          {(getCurrentPageGroup() + 1) * 5 < totalPages && (
            <button
              className={styles.pageButton}
              onClick={() =>
                handlePageChange((getCurrentPageGroup() + 1) * 5 + 1)
              } // 5개씩 그룹을 이동
            >
              &raquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// 메인 컴포넌트는 useSearchParams를 직접 사용하지 않고 SoulListContent를 Suspense로 감쌉니다
export default function SoulListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SoulListContent />
    </Suspense>
  );
}
