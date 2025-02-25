"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./list.module.css";

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

export default function YurangDanListPage() {
  const [yurangDans, setYurangDans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://korea-sky-planner.com/api/v1/yurangdans");
        if (!res.ok) throw new Error("유랑단 목록을 가져오는데 실패하였습니다.");
        const data = await res.json();
        const list = data.data || data;
        setYurangDans(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = yurangDans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(yurangDans.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleDetail = (id) => router.push(`/sky/travelingSprits/specialVisits/${id}`);
  const handleNotice = () => router.push("/sky/travelingSprits/generalVisits/list");

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      {/* 공지 영역 */}
      <div className={styles.noticePanel}>
        <h2 className={styles.noticeTitle}>역대 유랑단</h2>
        <p className={styles.noticeDescription}>
          지금까지 온 유랑단의 정보를 담은 페이지입니다.
        </p>
        <button className={styles.noticeButton} onClick={handleNotice}>
          역대 유랑
        </button>
      </div>

      {/* 카드 그리드: 4열 */}
      <div className={styles.cardsGrid}>
        {currentItems.map((dan) => (
          <div
            key={dan.id}
            className={styles.yurangCard}
            onClick={() => handleDetail(dan.id)}
          >
            <div className={styles.imageWrapperSquare}>
              {dan.representativeImage ? (
                <img
                  src={dan.representativeImage}
                  alt={`${dan.roundNumber}차 유랑단`}
                  className={styles.cardImage}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>
            <div className={styles.cardContent}>
              {/* 카드 헤더: 몇차 유랑단과 기간 */}
              <div className={styles.cardHeader}>
                <p className={styles.cardTitle}>{dan.roundNumber}차 유랑단</p>
                <p className={styles.cardPeriod}>
                  {dan.startDate} ~ {dan.endDate}
                </p>
              </div>
              {/* 유랑 영혼 목록 */}
              {dan.yurangSouls && dan.yurangSouls.length > 0 ? (
                dan.yurangSouls.map((soul, idx) => {
                  const season = seasonList.find(item => item.name === soul.seasonName);
                  const chipStyle = season ? { backgroundColor: season.color } : { backgroundColor: "#666" };
                  return (
                    <div key={idx} className={styles.soulLine}>
                      <span className={styles.seasonName} style={chipStyle}>
                        {soul.seasonName}
                      </span>
                      <span className={styles.yurangName}>{soul.yurangName}</span>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noSoul}>등록된 유랑 영혼 없음</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {/* <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          다음
        </button>
      </div> */}
    </div>
  );
}
