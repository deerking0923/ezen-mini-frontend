// src/app/sky/travelingSprits/generalVisits/list/page.js
"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./list.module.css";

const STORE_KEY = "soulListState_v1";

function SoulListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===== 상태 =====
  const [souls, setSouls] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 기본 카드 보기
  const [loading, setLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [isFetchingPrev, setIsFetchingPrev] = useState(false);
  const [error, setError] = useState(null);
  const [listSort, setListSort] = useState("latest");
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ===== refs =====
  const bottomSentinelRef = useRef(null);
  const soulsLenRef = useRef(0);
  const didBootstrapRef = useRef(false);
  const minLoadedPageRef = useRef(null); // 현재 로드된 최소/최대 페이지(0-based)
  const maxLoadedPageRef = useRef(null);
  const pageSizeRef = useRef(null);      // 페이지당 아이템 수
  const targetSoulIdRef = useRef(null);  // 복귀 시 스크롤 타깃
  const targetPageRef = useRef(null);    // 복귀 시 우선 페이지(0-based)

  // ===== 유틸: 중복 제거 =====
  const mergeUniqueById = (prev, next) => {
    const seen = new Set(prev.map((x) => x.id));
    const dedupedNext = [];
    for (const item of next) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        dedupedNext.push(item);
      }
    }
    return [...prev, ...dedupedNext];
  };

  const uniqueById = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  // ===== 반응형 =====
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ===== 클라이언트 플래그 =====
  useEffect(() => { setIsClient(true); }, []);

  // ===== URL → state (page는 사용 안 함: 영혼 뷰) =====
  useEffect(() => {
    const initialMode = searchParams.get("mode") || "card";
    const initialQuery = searchParams.get("query") || "";
    setViewMode(initialMode);
    setSearchQuery(initialQuery);
    setSubmittedQuery(initialQuery);
  }, [searchParams]);

  // 길이 ref
  useEffect(() => { soulsLenRef.current = souls.length; }, [souls]);

  // 브라우저 자동 스크롤 복원 끔(우리가 제어)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = prev || "auto";
      }
    };
  }, []);

  // ===== 유틸 =====
  const formatDate = (dateStr) => {
    const parts = dateStr.split("-");
    return isMobile && parts.length === 3
      ? `${parts[0].slice(-2)}.${parts[1]}.${parts[2]}`
      : dateStr;
  };

  const getHashSoulId = () => {
    if (typeof window === "undefined") return null;
    const h = window.location.hash || "";
    const m = h.match(/^#soul-(\d+)$/);
    return m ? m[1] : null;
  };

  const scrollToSoulId = (soulId) => {
    if (!soulId) return;
    let tries = 0;
    const seek = () => {
      const byId = document.getElementById(`soul-${soulId}`);
      const byAttr = document.querySelector(`[data-soul-id="${soulId}"]`);
      const el = byId || byAttr;
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        window.scrollTo({ top, behavior: "auto" });
      } else if (tries < 60) {
        tries += 1;
        requestAnimationFrame(seek);
      }
    };
    requestAnimationFrame(seek);
  };

  // ===== API =====
  const annotate = (arr, pageNumber) =>
    (Array.isArray(arr) ? arr : []).map((it) => ({ ...it, __page: pageNumber }));

  const fetchPageContent = async (pageNumber) => {
    const url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const content = Array.isArray(data.data?.content) ? data.data.content : [];
    const pages = data.data?.totalPages || 1;

    if (pageSizeRef.current == null) {
      pageSizeRef.current = content.length || null;
    }

    return { content: annotate(content, pageNumber), pages };
  };

  const resolvePageForSoulId = async (soulId) => {
    try {
      if (pageSizeRef.current == null) {
        const { pages } = await fetchPageContent(0);
        setTotalPages(pages);
      }
      const resAll = await fetch(`https://korea-sky-planner.com/api/v1/souls/all`);
      if (!resAll.ok) throw new Error(`HTTP ${resAll.status}`);
      const dataAll = await resAll.json();
      const allArr = Array.isArray(dataAll.data) ? dataAll.data : [];
      const idx = allArr.findIndex((it) => String(it.id) === String(soulId));
      if (idx < 0 || !pageSizeRef.current) return null;
      return Math.floor(idx / pageSizeRef.current);
    } catch (e) {
      console.warn("resolvePageForSoulId failed:", e);
      return null;
    }
  };

  const bootstrapCentered = async (centerPage) => {
    try {
      setLoading(true);
      setError(null);
      const { content, pages } = await fetchPageContent(centerPage);
      setSouls(uniqueById(content));
      setTotalPages(pages);
      // 교체 로드 시 현재 페이지 범위 업데이트
      minLoadedPageRef.current = centerPage;
      maxLoadedPageRef.current = centerPage;

      // URL 동기화: page는 기록하지 않음(영혼 뷰), 해시 유지
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const params = new URLSearchParams();
      params.set("mode", viewMode);
      if (submittedQuery) params.set("query", submittedQuery);
      const newUrl = `/sky/travelingSprits/generalVisits/list${params.toString() ? "?" + params.toString() : ""}${hash}`;
      const cur = window.location.pathname + window.location.search + (window.location.hash || "");
      if (cur !== newUrl) window.history.replaceState(null, "", newUrl);
    } catch (err) {
      setError(err.message || "데이터 초기 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      const hashId = getHashSoulId();
      if (hashId) scrollToSoulId(hashId);
    }
  };

  // ===== 범용 로더 =====
  const fetchSoulsAny = async (pageNumber, query, { append = false } = {}) => {
    let url = "";
    const isCard = viewMode === "card";
    const trimmed = (query || "").trim();

    if (trimmed !== "") {
      url = `https://korea-sky-planner.com/api/v1/souls/search?query=${encodeURIComponent(trimmed)}`;
    } else if (isCard) {
      url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
    } else {
      url = listSort === "oldest"
        ? `https://korea-sky-planner.com/api/v1/souls/reverse`
        : `https://korea-sky-planner.com/api/v1/souls/all`;
    }

    const isInitialAppend = append && soulsLenRef.current === 0;
    if (append) {
      if (isInitialAppend) setLoading(true);
      setIsFetchingNext(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (trimmed !== "") {
        const results = Array.isArray(data.data) ? data.data : [];
        setTotalPages(1);
        setSouls(uniqueById(results));
        // 검색 모드는 페이징 안 함
        minLoadedPageRef.current = null;
        maxLoadedPageRef.current = null;
      } else if (isCard) {
        const raw = Array.isArray(data.data?.content) ? data.data.content : [];
        const content = annotate(raw, pageNumber);
        const pages = data.data?.totalPages || 1;
        setTotalPages(pages);

        if (append) {
          setSouls((prev) => mergeUniqueById(prev, content));
          // append 시 페이지 범위 갱신
          if (minLoadedPageRef.current == null) minLoadedPageRef.current = pageNumber;
          if (maxLoadedPageRef.current == null || pageNumber > maxLoadedPageRef.current) {
            maxLoadedPageRef.current = pageNumber;
          }
        } else {
          setSouls(uniqueById(content));
          // 교체 시 현재 페이지 범위를 명시적으로 설정
          minLoadedPageRef.current = pageNumber;
          maxLoadedPageRef.current = pageNumber;
        }
      } else {
        const results = Array.isArray(data.data) ? data.data : [];
        setTotalPages(1);
        setSouls(uniqueById(results));
        minLoadedPageRef.current = null;
        maxLoadedPageRef.current = null;
      }
    } catch (err) {
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      if (append) {
        setIsFetchingNext(false);
        if (isInitialAppend) setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // ===== 현재 URL과 같으면 push 대신 강제 재로딩 =====
  const pushOrRefresh = (targetUrl, { pageNumber = 0, query = submittedQuery } = {}) => {
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl === targetUrl) {
      // 동일 URL → 상태 초기화 후 직접 페치
      setSouls([]);
      minLoadedPageRef.current = null;
      maxLoadedPageRef.current = null;
      targetSoulIdRef.current = null;
      targetPageRef.current = null;
      setLoading(true);
      fetchSoulsAny(pageNumber, query, { append: false });
    } else {
      router.push(targetUrl);
    }
  };

  // ===== 초기 로드 =====
  useEffect(() => {
    if (!isClient) return;

    // 세션 복원(클릭했던 카드/페이지)
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const currentQuery = searchParams.get("query") || "";
        if (saved?.viewMode === "card" && (saved?.query || "") === currentQuery) {
          targetSoulIdRef.current = saved.clickedSoulId || null;
          if (typeof saved.clickedPage === "number") targetPageRef.current = saved.clickedPage;
        }
      }
    } catch {}

    const needBootstrap =
      viewMode === "card" &&
      submittedQuery.trim() === "" &&
      soulsLenRef.current === 0 &&
      !didBootstrapRef.current;

    if (!needBootstrap) {
      // 기본 경로: 카드뷰면 0부터 append/교체 시작, 리스트뷰면 한 번에
      if (viewMode === "card") {
        const base = maxLoadedPageRef.current ?? 0;
        fetchSoulsAny(base, submittedQuery, { append: soulsLenRef.current > 0 });
      } else {
        fetchSoulsAny(0, submittedQuery, { append: false });
      }
      return;
    }

    // 부트스트랩: 해시/세션 우선
    didBootstrapRef.current = true;

    (async () => {
      const hashSoulId = getHashSoulId();

      if (
        hashSoulId &&
        targetSoulIdRef.current &&
        String(hashSoulId) === String(targetSoulIdRef.current) &&
        typeof targetPageRef.current === "number"
      ) {
        const center = targetPageRef.current;
        await bootstrapCentered(center);
        return;
      }

      if (hashSoulId) {
        const resolved = await resolvePageForSoulId(hashSoulId);
        const center = typeof resolved === "number" ? resolved : 0;
        await bootstrapCentered(center);
        return;
      }

      await bootstrapCentered(0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQuery, viewMode, listSort, isClient]);

  // ===== 아래쪽 무한 스크롤(append) =====
  useEffect(() => {
    if (!isClient) return;
    if (viewMode !== "card") return;
    if (!bottomSentinelRef.current) return;

    const hasMore =
      submittedQuery.trim() === "" &&
      maxLoadedPageRef.current != null &&
      maxLoadedPageRef.current + 1 < totalPages &&
      !error;

    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !loading &&
          !isFetchingNext &&
          submittedQuery.trim() === "" &&
          maxLoadedPageRef.current != null &&
          maxLoadedPageRef.current + 1 < totalPages
        ) {
          const nextPage = maxLoadedPageRef.current + 1;
          setIsFetchingNext(true);
          (async () => {
            try {
              const { content } = await fetchPageContent(nextPage);
              setSouls((prev) => mergeUniqueById(prev, content));
              // append 후 반드시 max 갱신
              if (maxLoadedPageRef.current == null || nextPage > maxLoadedPageRef.current) {
                maxLoadedPageRef.current = nextPage;
              }
              if (minLoadedPageRef.current == null) {
                minLoadedPageRef.current = nextPage;
              }
            } catch (err) {
              setError(err.message || "다음 페이지 로드 실패");
            } finally {
              setIsFetchingNext(false);
            }
          })();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(bottomSentinelRef.current);
    return () => observer.disconnect();
  }, [isClient, viewMode, loading, isFetchingNext, submittedQuery, totalPages, error]);

  // ===== 위쪽 무한 스크롤(prepend, 선택) =====
  useEffect(() => {
    if (!isClient) return;
    if (viewMode !== "card") return;
    if (submittedQuery.trim() !== "") return;

    const onScroll = () => {
      if (isFetchingPrev || loading) return;
      const minLoaded = minLoadedPageRef.current;
      if (minLoaded == null || minLoaded <= 0) return;

      if (window.scrollY < 200) {
        setIsFetchingPrev(true);
        const prevPage = minLoaded - 1;
        (async () => {
          try {
            const before = document.documentElement.scrollHeight;
            const { content } = await fetchPageContent(prevPage);
            setSouls((prev) => uniqueById([...content, ...prev])); // 앞에 붙이되 중복 제거
            minLoadedPageRef.current = prevPage; // prepend 후 min 갱신
            // prepend 점프 보정
            requestAnimationFrame(() => {
              const after = document.documentElement.scrollHeight;
              const delta = after - before;
              window.scrollTo(0, window.scrollY + delta);
            });
          } catch (err) {
            setError(err.message || "이전 페이지 로드 실패");
          } finally {
            setIsFetchingPrev(false);
          }
        })();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isClient, viewMode, submittedQuery, loading, isFetchingPrev]);

  // ===== 상세 이동 전 상태 저장 =====
  const saveOnClick = (clickedSoul) => {
    try {
      sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          viewMode,
          query: submittedQuery,
          clickedSoulId: clickedSoul?.id ?? null,
          clickedPage:
            typeof clickedSoul?.__page === "number" ? clickedSoul.__page : null,
          scrollY: window.scrollY,
          ts: Date.now(),
        })
      );
    } catch {}
    // 리스트 히스토리를 해시로 바꿔 둬서 뒤로가기 시 정확히 복귀
    const params = new URLSearchParams();
    params.set("mode", viewMode);
    if (submittedQuery) params.set("query", submittedQuery);
    const listUrl = `/sky/travelingSprits/generalVisits/list${
      params.toString() ? "?" + params.toString() : ""
    }#soul-${clickedSoul?.id}`;
    window.history.replaceState(null, "", listUrl);
  };

  // ===== 검색/필터/모드 =====
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 다음 상태 계산
    const params = new URLSearchParams();
    params.set("mode", viewMode);
    if (searchQuery) params.set("query", searchQuery);
    const targetUrl = `/sky/travelingSprits/generalVisits/list${params.toString() ? "?" + params.toString() : ""}`;

    // 상태 초기화
    setSouls([]);
    setSubmittedQuery(searchQuery);
    minLoadedPageRef.current = null;
    maxLoadedPageRef.current = null;
    targetSoulIdRef.current = null;
    targetPageRef.current = null;

    // 해시 제거
    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // 동일 URL이면 직접 재로딩, 아니면 push
    pushOrRefresh(targetUrl, { pageNumber: 0, query: searchQuery });
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const handleSeasonClick = (seasonName) => {
    const params = new URLSearchParams();
    params.set("mode", viewMode);
    params.set("query", seasonName);
    const targetUrl = `/sky/travelingSprits/generalVisits/list?${params.toString()}`;

    setSouls([]);
    setSearchQuery(seasonName);
    setSubmittedQuery(seasonName);
    minLoadedPageRef.current = null;
    maxLoadedPageRef.current = null;
    targetSoulIdRef.current = null;
    targetPageRef.current = null;

    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    pushOrRefresh(targetUrl, { pageNumber: 0, query: seasonName });
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const handleAllView = () => {
    // 전체 보기: 쿼리 제거 + 상태 초기화
    setSouls([]);
    setSearchQuery("");
    setSubmittedQuery("");
    minLoadedPageRef.current = null;
    maxLoadedPageRef.current = null;
    targetSoulIdRef.current = null;
    targetPageRef.current = null;

    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const params = new URLSearchParams();
    params.set("mode", viewMode);
    const targetUrl = `/sky/travelingSprits/generalVisits/list?${params.toString()}`;

    // 동일 URL(이미 전체 보기 화면)에서도 반드시 재로드
    pushOrRefresh(targetUrl, { pageNumber: 0, query: "" });
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const handleViewModeChange = (mode) => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (submittedQuery) params.set("query", submittedQuery);
    const targetUrl = `/sky/travelingSprits/generalVisits/list?${params.toString()}`;

    setSouls([]);
    setViewMode(mode);
    minLoadedPageRef.current = null;
    maxLoadedPageRef.current = null;
    targetSoulIdRef.current = null;
    targetPageRef.current = null;

    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    pushOrRefresh(targetUrl, { pageNumber: 0, query: submittedQuery });
    requestAnimationFrame(() => window.scrollTo(0, 0));
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
    { name: "파랑새", color: "#1E90FF" },
    { name: "불씨", color: "#FF4500" },
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
          className={`${styles.tabButton} ${viewMode === "card" ? styles.activeTab : ""}`}
          onClick={() => handleViewModeChange("card")}
        >
          카드 보기
        </button>
        <button
          className={`${styles.tabButton} ${viewMode === "list" ? styles.activeTab : ""}`}
          onClick={() => handleViewModeChange("list")}
        >
          리스트 보기
        </button>
        {viewMode === "list" && (
          <div className={styles.sortButtons}>
            <button
              className={`${styles.sortButton} ${listSort === "latest" ? styles.activeSort : ""}`}
              onClick={() => setListSort("latest")}
            >
              최신순
            </button>
            <button
              className={`${styles.sortButton} ${listSort === "oldest" ? styles.activeSort : ""}`}
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
        <>
          <div className={styles.cardsGrid}>
            {souls.map((soul, idx) => {
              const repImg = soul.images?.find((img) => img.imageType === "REPRESENTATIVE");
              const isBoundary =
                typeof soul.__page === "number" &&
                (idx === 0 || souls[idx - 1].__page !== soul.__page);

              const params = new URLSearchParams();
              params.set("mode", viewMode);
              if (submittedQuery) params.set("query", submittedQuery);

              return (
                <Link
                  key={`${soul.id}-${soul.__page ?? "p"}`}  // key 안정화
                  id={`soul-${soul.id}`}                     // 해시 앵커
                  data-page-boundary={isBoundary ? soul.__page : undefined}
                  data-soul-id={soul.id}
                  href={`/sky/travelingSprits/generalVisits/${soul.id}${
                    params.toString() ? "?" + params.toString() : ""
                  }`}
                  className={styles.soulCard}
                  onClick={() => saveOnClick(soul)}
                >
                  <div className={styles.imageWrapperSquare}>
                    {repImg?.url ? (
                      <img src={repImg.url} alt={soul.name} className={styles.cardImage} />
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
                            seasonList.find((s) => s.name === soul.seasonName)?.color || "#444",
                        }}
                      >
                        {soul.seasonName}
                      </span>
                      <span className={styles.soulName}>{soul.name}</span>
                    </p>
                    <p className={styles.secondLine}>
                      {soul.orderNum < 0 ? (
                        <strong style={{ color: "blue" }}>
                          {isMobile ? `#${Math.abs(soul.orderNum)}` : `${Math.abs(soul.orderNum)}번째 유랑단`}
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

          {/* 무한 스크롤 로더/센티넬 */}
          {isFetchingPrev && (
            <div style={{ textAlign: "center", padding: "0.5rem" }}>
              이전 페이지 불러오는 중…
            </div>
          )}
          {submittedQuery.trim() === "" &&
            maxLoadedPageRef.current != null &&
            maxLoadedPageRef.current + 1 < totalPages && (
              <>
                {isFetchingNext && <div className={styles.loading}>Loading...</div>}
                <div ref={bottomSentinelRef} style={{ height: 1 }} />
              </>
            )}
          {submittedQuery.trim() === "" &&
            maxLoadedPageRef.current != null &&
            maxLoadedPageRef.current + 1 >= totalPages && (
              <div style={{ textAlign: "center", padding: "1rem", opacity: 0.6 }}>
                더 이상 불러올 항목이 없습니다.
              </div>
            )}
        </>
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
              const repImg = soul.images?.find((img) => img.imageType === "REPRESENTATIVE");

              const params = new URLSearchParams();
              params.set("mode", viewMode);
              if (submittedQuery) params.set("query", submittedQuery);

              return (
                <tr
                  key={`${soul.id}-${soul.__page ?? "p"}`}
                  className={styles.tableRow}
                  onClick={() => {
                    saveOnClick(soul);
                    router.push(
                      `/sky/travelingSprits/generalVisits/${soul.id}${
                        params.toString() ? "?" + params.toString() : ""
                      }`
                    );
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td className={styles.tdOrder}>
                    {repImg?.url && (
                      <img
                        src={repImg.url}
                        alt={soul.name}
                        className={styles.tableThumbnail}
                        style={{ width: 30, height: 30, marginRight: 8, verticalAlign: "middle" }}
                      />
                    )}
                    {soul.orderNum < 0 ? (
                      <span className={styles.warbandOrder}>{Math.abs(soul.orderNum)}</span>
                    ) : (
                      soul.orderNum
                    )}
                  </td>
                  <td className={styles.tdSeason}>
                    <span
                      className={styles.seasonName}
                      style={{
                        backgroundColor:
                          seasonList.find((s) => s.name === soul.seasonName)?.color || "#444",
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
