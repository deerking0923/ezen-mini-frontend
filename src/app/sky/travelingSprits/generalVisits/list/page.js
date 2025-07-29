// src/app/sky/travelingSprits/generalVisits/list/page.js
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./list.module.css";

function SoulListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [souls, setSouls] = useState([]);
  const [page, setPage] = useState(0); // 0-based index
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listSort, setListSort] = useState("latest");
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentPage = page + 1;

  // 모바일 여부 체크
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 클라이언트 전용 렌더링 표시
  useEffect(() => {
    setIsClient(true);
  }, []);

  // URL 쿼리로부터 초기 state 복원
  useEffect(() => {
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const initialMode = searchParams.get("mode") || "card";
    const initialQuery = searchParams.get("query") || "";
    setPage(initialPage - 1);
    setViewMode(initialMode);
    setSearchQuery(initialQuery);
    setSubmittedQuery(initialQuery);
  }, [searchParams]);

  const formatDate = (dateStr) => {
    const parts = dateStr.split("-");
    return isMobile && parts.length === 3
      ? `${parts[0].slice(-2)}.${parts[1]}.${parts[2]}`
      : dateStr;
  };

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
        url =
          listSort === "oldest"
            ? `https://korea-sky-planner.com/api/v1/souls/reverse`
            : `https://korea-sky-planner.com/api/v1/souls/all`;
      }
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      let results = [];
      if (query && query.trim() !== "") {
        results = Array.isArray(data.data) ? data.data : [];
        setTotalPages(1);
      } else if (viewMode === "card") {
        results = Array.isArray(data.data?.content) ? data.data.content : [];
        setTotalPages(data.data?.totalPages || 1);
      } else {
        results = Array.isArray(data.data) ? data.data : [];
        setTotalPages(1);
      }
      setSouls(results);
    } catch (err) {
      setError(err.message);
    } finally {
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
    router.push(
      `/sky/travelingSprits/generalVisits/list?page=1&mode=${viewMode}&query=${encodeURIComponent(
        searchQuery
      )}`
    );
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber - 1);
    router.push(
      `/sky/travelingSprits/generalVisits/list?page=${pageNumber}&mode=${viewMode}&query=${encodeURIComponent(
        submittedQuery
      )}`
    );
  };

  const handleSeasonClick = (seasonName) => {
    setPage(0);
    setSearchQuery(seasonName);
    setSubmittedQuery(seasonName);
    router.push(
      `/sky/travelingSprits/generalVisits/list?page=1&mode=${viewMode}&query=${encodeURIComponent(
        seasonName
      )}`
    );
  };

  // 전체 보기 클릭 시
  const handleAllView = () => {
    setPage(0);
    setSearchQuery("");
    setSubmittedQuery("");
    router.push(
      `/sky/travelingSprits/generalVisits/list?page=1&mode=${viewMode}`
    );
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    router.push(
      `/sky/travelingSprits/generalVisits/list?page=${currentPage}&mode=${mode}&query=${encodeURIComponent(
        submittedQuery
      )}`
    );
  };

  const getCurrentPageGroup = () => Math.floor((currentPage - 1) / 5);
  const getPaginationRange = () => {
    const pg = getCurrentPageGroup();
    const start = pg * 5 + 1;
    const end = Math.min(start + 4, totalPages);
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
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
    { name: "파랑새", color: "#1E90FF" }, // 추가
    { name: "불씨", color: "#FF4500" }, // 추가
  ];

  return (
    <div className={styles.container}>
      {/* 공지 및 시즌 검색 */}
      <div className={styles.noticePanel}>
        <h2 className={styles.noticeTitle}>유랑 대백과</h2>
        <p className={styles.noticeDescription}>
          유랑 대백과의 제작 자료는 스카이 플래너를 출처로 남기시면 사용
          가능합니다.
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
        <p className={styles.noticeSubDescription}>
          아래 시즌 이름을 클릭하면 자동 검색됩니다:
        </p>
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
        <div className={styles.filterChipsContainer}>
          <button
            className={styles.filterChip}
            onClick={() => handleSeasonClick("유랑단")}
          >
            유랑단
          </button>
          <button className={styles.filterChip} onClick={handleAllView}>
            전체 보기
          </button>
        </div>
      </div>

      {/* 검색창 */}
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

      {/* 뷰 모드 탭 */}
      <div className={styles.viewTabs}>
        <button
          className={`${styles.tabButton} ${
            viewMode === "card" ? styles.activeTab : ""
          }`}
          onClick={() => handleViewModeChange("card")}
        >
          카드 보기
        </button>
        <button
          className={`${styles.tabButton} ${
            viewMode === "list" ? styles.activeTab : ""
          }`}
          onClick={() => handleViewModeChange("list")}
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

      {/* 로딩 / 오류 / 콘텐츠 */}
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : souls.length === 0 ? (
        <p>해당 시즌에는 아직 유랑 영혼이 없습니다.</p>
      ) : viewMode === "card" ? (
        <div className={styles.cardsGrid}>
          {souls.map((soul) => {
            const repImg = soul.images?.find(
              (img) => img.imageType === "REPRESENTATIVE"
            );
            return (
              <Link
                href={`/sky/travelingSprits/generalVisits/${
                  soul.id
                }?page=${currentPage}&mode=${viewMode}&query=${encodeURIComponent(
                  submittedQuery
                )}`}
                key={soul.id}
                className={styles.soulCard}
              >
                <div className={styles.imageWrapperSquare}>
                  {repImg?.url ? (
                    <img
                      src={repImg.url}
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
                          seasonList.find((s) => s.name === soul.seasonName)
                            ?.color || "#444",
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
            );
          })}
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
            {souls.map((soul) => {
              const repImg = soul.images?.find(
                (img) => img.imageType === "REPRESENTATIVE"
              );
              return (
                <tr
                  key={soul.id}
                  className={styles.tableRow}
                  onClick={() =>
                    router.push(
                      `/sky/travelingSprits/generalVisits/${
                        soul.id
                      }?page=${currentPage}&mode=${viewMode}&query=${encodeURIComponent(
                        submittedQuery
                      )}`
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className={styles.tdOrder}>
                    {repImg?.url && (
                      <img
                        src={repImg.url}
                        alt={soul.name}
                        className={styles.tableThumbnail}
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 8,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                    {soul.orderNum < 0 ? (
                      <span className={styles.warbandOrder}>
                        {Math.abs(soul.orderNum)}
                      </span>
                    ) : (
                      soul.orderNum
                    )}
                  </td>
                  <td className={styles.tdSeason}>
                    <span
                      className={styles.seasonName}
                      style={{
                        backgroundColor:
                          seasonList.find((s) => s.name === soul.seasonName)
                            ?.color || "#444",
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
              );
            })}
          </tbody>
        </table>
      )}

      {/* 페이지네이션 */}
      {viewMode === "card" && totalPages > 1 && (
        <div className={styles.pagination}>
          {getCurrentPageGroup() > 0 && (
            <button
              className={styles.pageButton}
              onClick={() => handlePageChange(getCurrentPageGroup() * 5)}
            >
              &laquo;
            </button>
          )}
          {getPaginationRange().map((num) => (
            <button
              key={num}
              className={`${styles.pageButton} ${
                num === currentPage ? styles.activePage : ""
              }`}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </button>
          ))}
          {(getCurrentPageGroup() + 1) * 5 < totalPages && (
            <button
              className={styles.pageButton}
              onClick={() =>
                handlePageChange((getCurrentPageGroup() + 1) * 5 + 1)
              }
            >
              &raquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SoulListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SoulListContent />
    </Suspense>
  );
}
