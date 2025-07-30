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

  // ====== 상태 ======
  const [souls, setSouls] = useState([]);        // 화면에 그릴 아이템(여러 페이지 병합)
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 기본 카드 보기
  const [loading, setLoading] = useState(true);     // 초기/교체 로딩
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [isFetchingPrev, setIsFetchingPrev] = useState(false);
  const [error, setError] = useState(null);
  const [listSort, setListSort] = useState("latest");
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ====== refs ======
  const bottomSentinelRef = useRef(null);
  const soulsLenRef = useRef(0);
  const didBootstrapRef = useRef(false);   // 한 번만 부트스트랩
  const skipNextEffectRef = useRef(false); // 부트스트랩 직후 1회 fetch 스킵
  const minLoadedPageRef = useRef(null);   // 현재 로드된 최소/최대 페이지(0-based)
  const maxLoadedPageRef = useRef(null);
  const pageSizeRef = useRef(null);        // 페이지당 아이템 수(추정)
  const targetSoulIdRef = useRef(null);    // 복귀 시 스크롤 타깃 영혼 id
  const targetPageRef = useRef(null);      // 복귀 시 우선할 페이지(0-based)

  // ====== 반응형 처리 ======
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ====== 클라이언트 표식 ======
  useEffect(() => { setIsClient(true); }, []);

  // ====== URL → state 복원 (page는 무시: 영혼 뷰로 전환) ======
  useEffect(() => {
    const initialMode = searchParams.get("mode") || "card";
    const initialQuery = searchParams.get("query") || "";
    setViewMode(initialMode);
    setSearchQuery(initialQuery);
    setSubmittedQuery(initialQuery);
  }, [searchParams]);

  // 길이 ref
  useEffect(() => { soulsLenRef.current = souls.length; }, [souls]);

  // ====== 브라우저 기본 스크롤 복원 끔(수동 제어) ======
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

  // BFCache 복원/뒤로가기: DOM 캐시된 경우에도 해시/클릭 영혼으로 스크롤
  useEffect(() => {
    const onPageShow = () => {
      const hashId = getHashSoulId();
      if (hashId) {
        requestAnimationFrame(() => scrollToSoulId(hashId));
        return;
      }
      try {
        const raw = sessionStorage.getItem(STORE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (saved?.clickedSoulId) {
          requestAnimationFrame(() => scrollToSoulId(saved.clickedSoulId));
        }
      } catch {}
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // ====== 상태 저장(클릭 카드/페이지) ======
  const saveListState = (clickedSoulId = null, clickedPage = null) => {
    try {
      sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          viewMode,
          query: submittedQuery,
          clickedSoulId,      // ✅ 어떤 카드를 눌렀는지
          clickedPage,        // ✅ 그 카드가 속한 페이지(0-based)
          ts: Date.now(),
        })
      );
    } catch {}
  };

  const formatDate = (dateStr) => {
    const parts = dateStr.split("-");
    return isMobile && parts.length === 3
      ? `${parts[0].slice(-2)}.${parts[1]}.${parts[2]}`
      : dateStr;
  };

  // ====== 해시 유틸 ======
  const getHashSoulId = () => {
    if (typeof window === "undefined") return null;
    const h = window.location.hash || "";
    const m = h.match(/^#soul-(\d+)$/);
    return m ? m[1] : null;
  };

  // ====== 스크롤 유틸 ======
  const scrollToBoundary = (targetPage) => {
    if (typeof window === "undefined") return;
    if (targetPage == null) return;
    let tries = 0;
    const seek = () => {
      const el = document.querySelector(`[data-page-boundary="${targetPage}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        window.scrollTo({ top, behavior: "auto" });
      } else if (tries < 40) {
        tries += 1;
        requestAnimationFrame(seek);
      }
    };
    requestAnimationFrame(seek);
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

  // ====== API: 단일 페이지 로드 + __page 주입 ======
  const annotate = (arr, pageNumber) =>
    (Array.isArray(arr) ? arr : []).map((it) => ({ ...it, __page: pageNumber }));

  const fetchPageContent = async (pageNumber) => {
    const url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const content = Array.isArray(data.data?.content) ? data.data.content : [];
    const pages = data.data?.totalPages || 1;

    // pageSize 추정(최초 1회)
    if (pageSizeRef.current == null) {
      pageSizeRef.current = content.length || null;
    }

    return { content: annotate(content, pageNumber), pages };
  };

  // ====== 해시 기반 페이지 해석: /souls/all 로 인덱스 찾기 → 페이지 계산 ======
  const resolvePageForSoulId = async (soulId) => {
    try {
      // 1) 페이지 크기 확보(미탑재시 page=0 한 번)
      if (pageSizeRef.current == null) {
        const { pages } = await fetchPageContent(0);
        setTotalPages(pages);
      }

      // 2) 전체 목록에서 인덱스 찾기
      const resAll = await fetch(`https://korea-sky-planner.com/api/v1/souls/all`);
      if (!resAll.ok) throw new Error(`HTTP ${resAll.status}`);
      const dataAll = await resAll.json();
      const allArr = Array.isArray(dataAll.data) ? dataAll.data : [];

      const idx = allArr.findIndex((it) => String(it.id) === String(soulId));
      if (idx < 0 || !pageSizeRef.current) return null;

      const pg = Math.floor(idx / pageSizeRef.current);
      return pg;
    } catch (e) {
      console.warn("resolvePageForSoulId failed:", e);
      return null;
    }
  };

  // ====== 중심 페이지 한 페이지만 로드(복귀시 클릭/해시 우선) ======
  const bootstrapCentered = async (centerPage) => {
    try {
      setLoading(true);
      setError(null);
      const { content, pages } = await fetchPageContent(centerPage);
      setSouls(content);
      setTotalPages(pages);
      minLoadedPageRef.current = centerPage;
      maxLoadedPageRef.current = centerPage;

      // URL 동기화(해시/모드/쿼리만 유지 — page 파라미터는 쓰지 않음)
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const params = new URLSearchParams();
      params.set("mode", viewMode);
      if (submittedQuery) params.set("query", submittedQuery);
      const newUrl = `/sky/travelingSprits/generalVisits/list${params.toString() ? "?" + params.toString() : ""}${hash}`;
      const currentUrl = window.location.pathname + window.location.search + (window.location.hash || "");
      if (currentUrl !== newUrl) window.history.replaceState(null, "", newUrl);
    } catch (err) {
      setError(err.message || "데이터 초기 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      // 해시 우선 -> 클릭했던 카드 -> 페이지 경계 순서로 스크롤
      const hashId = getHashSoulId();
      if (hashId) {
        scrollToSoulId(hashId);
      } else if (targetSoulIdRef.current) {
        scrollToSoulId(targetSoulIdRef.current);
      } else {
        scrollToBoundary(minLoadedPageRef.current);
      }
    }
  };

  // ====== 공통 fetch(검색/리스트/카드 append 등) ======
  const fetchSoulsAny = async (pageNumber, query, { append = false } = {}) => {
    let url = "";
    const isCard = viewMode === "card";
    const trimmed = (query || "").trim();

    if (trimmed !== "") {
      url = `https://korea-sky-planner.com/api/v1/souls/search?query=${encodeURIComponent(
        trimmed
      )}`;
    } else if (isCard) {
      url = `https://korea-sky-planner.com/api/v1/souls?page=${pageNumber}`;
    } else {
      url =
        listSort === "oldest"
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
        setSouls(results);
      } else if (isCard) {
        const contentRaw = Array.isArray(data.data?.content) ? data.data.content : [];
        const content = annotate(contentRaw, pageNumber);
        const pages = data.data?.totalPages || 1;
        setTotalPages(pages);

        // pageSize 갱신(안전)
        if (pageSizeRef.current == null && content.length > 0) {
          pageSizeRef.current = content.length;
        }

        if (append) setSouls((prev) => [...prev, ...content]);
        else setSouls(content);
      } else {
        const results = Array.isArray(data.data) ? data.data : [];
        setTotalPages(1);
        setSouls(results);
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

  // ====== 초기 로드 트리거 ======
  useEffect(() => {
    if (!isClient) return;

    // 세션에서 클릭 정보 복원
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const currentQuery = searchParams.get("query") || "";
        if (saved?.viewMode === "card" && (saved?.query || "") === currentQuery) {
          targetSoulIdRef.current = saved.clickedSoulId || null;
          if (typeof saved.clickedPage === "number") {
            targetPageRef.current = saved.clickedPage;
          }
        }
      }
    } catch {}

    const needBootstrap =
      viewMode === "card" &&
      submittedQuery.trim() === "" &&
      soulsLenRef.current === 0 &&
      !didBootstrapRef.current;

    if (!needBootstrap) {
      // 일반 경로
      if (viewMode === "card") {
        // 카드 뷰에서 기본은 0페이지부터 append 로드
        const basePage = maxLoadedPageRef.current ?? 0;
        fetchSoulsAny(basePage, submittedQuery, { append: soulsLenRef.current > 0 });
      } else {
        fetchSoulsAny(0, submittedQuery, { append: false });
      }
      return;
    }

    // ====== 부트스트랩 ======
    didBootstrapRef.current = true;

    (async () => {
      // 1) 해시가 있는가?
      const hashSoulId = getHashSoulId();

      // 2) 세션에 클릭 페이지가 있고, 그 영혼과 일치하는가?
      if (
        hashSoulId &&
        targetSoulIdRef.current &&
        String(hashSoulId) === String(targetSoulIdRef.current) &&
        typeof targetPageRef.current === "number"
      ) {
        const center = targetPageRef.current;
        minLoadedPageRef.current = center;
        maxLoadedPageRef.current = center;
        await bootstrapCentered(center);
        return;
      }

      // 3) 해시만 있고 클릭 페이지 정보가 없다면 -> /souls/all 로 페이지 계산
      if (hashSoulId) {
        const resolved = await resolvePageForSoulId(hashSoulId);
        const center = typeof resolved === "number" ? resolved : 0;
        minLoadedPageRef.current = center;
        maxLoadedPageRef.current = center;
        await bootstrapCentered(center);
        return;
      }

      // 4) 해시가 없으면 0페이지부터
      const center = 0;
      minLoadedPageRef.current = center;
      maxLoadedPageRef.current = center;
      await bootstrapCentered(center);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQuery, viewMode, listSort, isClient]);

  // ====== URL 동기화(페이지 파라미터 제거 유지) ======
  useEffect(() => {
    if (!isClient) return;
    // 카드 뷰의 경우 page를 URL에 반영하지 않음. (영혼 뷰)
    if (viewMode === "card") {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const params = new URLSearchParams();
      params.set("mode", viewMode);
      if (submittedQuery) params.set("query", submittedQuery);
      const newUrl = `/sky/travelingSprits/generalVisits/list${params.toString() ? "?" + params.toString() : ""}${hash}`;
      const currentUrl = window.location.pathname + window.location.search + (window.location.hash || "");
      if (currentUrl !== newUrl) window.history.replaceState(null, "", newUrl);
    }
  }, [isClient, viewMode, submittedQuery]);

  // ====== 아래쪽 무한 스크롤(append) ======
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
              setSouls((prev) => [...prev, ...content]);
              maxLoadedPageRef.current = nextPage;
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

  // ====== 위쪽 무한 스크롤(prepend) ======
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
            setSouls((prev) => [...content, ...prev]); // 앞에 붙임
            minLoadedPageRef.current = prevPage;

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

  // ====== 검색/필터/모드 핸들러 ======
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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

    const params = new URLSearchParams();
    params.set("mode", viewMode);
    if (searchQuery) params.set("query", searchQuery);
    router.push(`/sky/travelingSprits/generalVisits/list${params.toString() ? "?" + params.toString() : ""}`);
  };

  const handleSeasonClick = (seasonName) => {
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

    const params = new URLSearchParams();
    params.set("mode", viewMode);
    params.set("query", seasonName);
    router.push(`/sky/travelingSprits/generalVisits/list?${params.toString()}`);
  };

  const handleAllView = () => {
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
    router.push(`/sky/travelingSprits/generalVisits/list?${params.toString()}`);
  };

  const handleViewModeChange = (mode) => {
    setSouls([]);
    setViewMode(mode);
    minLoadedPageRef.current = null;
    maxLoadedPageRef.current = null;
    targetSoulIdRef.current = null;
    targetPageRef.current = null;

    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const params = new URLSearchParams();
    params.set("mode", mode);
    if (submittedQuery) params.set("query", submittedQuery);
    router.push(`/sky/travelingSprits/generalVisits/list?${params.toString()}`);
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

              return (
                <Link
                  key={soul.id}
                  id={`soul-${soul.id}`}                               // ✅ 해시 앵커
                  data-page-boundary={isBoundary ? soul.__page : undefined}
                  data-soul-id={soul.id}
                  href={`/sky/travelingSprits/generalVisits/${soul.id}${
                    submittedQuery || viewMode !== "card"
                      ? `?${new URLSearchParams({
                          ...(viewMode ? { mode: viewMode } : {}),
                          ...(submittedQuery ? { query: submittedQuery } : {}),
                        }).toString()}`
                      : ""
                  }`}
                  className={styles.soulCard}
                  onClick={() => {
                    // ✅ 리스트 히스토리 URL을 "그 영혼 해시"로 교체 (page 파라미터 없음)
                    const clickedPage = typeof soul.__page === "number" ? soul.__page : null;
                    const params = new URLSearchParams();
                    params.set("mode", viewMode);
                    if (submittedQuery) params.set("query", submittedQuery);
                    const listUrl = `/sky/travelingSprits/generalVisits/list${params.toString() ? "?" + params.toString() : ""}#soul-${soul.id}`;
                    window.history.replaceState(null, "", listUrl);

                    // 세션에 클릭 정보 저장(빠른 복원용)
                    saveListState(soul.id, clickedPage);
                  }}
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
          {submittedQuery.trim() === "" && (maxLoadedPageRef.current ?? 0) + 1 < totalPages && (
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
              return (
                <tr
                  key={soul.id}
                  className={styles.tableRow}
                  onClick={() => {
                    // 리스트에서도 클릭 정보만 저장, 상세로 이동(page X)
                    saveListState(soul.id, typeof soul.__page === "number" ? soul.__page : null);
                    const params = new URLSearchParams();
                    if (viewMode) params.set("mode", viewMode);
                    if (submittedQuery) params.set("query", submittedQuery);
                    router.push(
                      `/sky/travelingSprits/generalVisits/${soul.id}${params.toString() ? "?" + params.toString() : ""}`
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
