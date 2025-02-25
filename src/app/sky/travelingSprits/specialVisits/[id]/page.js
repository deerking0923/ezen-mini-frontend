"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./detail.module.css";

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

export default function YurangDanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dan, setDan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDan() {
      try {
        const res = await fetch(`https://korea-sky-planner.com/api/v1/yurangdans/${id}`);
        if (!res.ok) throw new Error("유랑단 상세 정보를 가져오는데 실패했습니다.");
        const data = await res.json();
        setDan(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDan();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`https://korea-sky-planner.com/api/v1/yurangdans/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/sky/travelingSprits/specialVisits/list");
      } else {
        alert("삭제에 실패하였습니다.");
      }
    } catch (err) {
      alert("삭제 도중 오류가 발생하였습니다.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!dan) return <div className={styles.error}>유랑단 정보가 없습니다.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{dan.roundNumber}차 유랑단</h1>

      <div className={styles.topImageWrapper}>
        {dan.representativeImage && (
          <img
            src={dan.representativeImage}
            alt="대표 이미지"
            className={styles.representativeImage}
          />
        )}
      </div>

      <div className={styles.period}>
        <span>{dan.startDate} ~ {dan.endDate}</span>
      </div>

      <div className={styles.soulSection}>
        {dan.yurangSouls && dan.yurangSouls.length > 0 ? (
          dan.yurangSouls.map((soul, index) => {
            const season = seasonList.find(item => item.name === soul.seasonName);
            const chipStyle = season ? { backgroundColor: season.color } : { backgroundColor: "#666" };
            return (
              <div key={index} className={styles.soulItem}>
                <span className={styles.seasonName} style={chipStyle}>
                  {soul.seasonName}
                </span>
                <span className={styles.yurangName}>{soul.yurangName}</span>
                <span className={styles.rerun}>
                  {Number(soul.rerunCount) + 1}차 복각
                </span>
                {soul.url ? (
                  <a
                    href={soul.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.infoLink}
                  >
                    정보 보러가기
                  </a>
                ) : (
                  <span className={styles.infoText}>처음 온 유랑단</span>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.noSoul}>등록된 유랑 영혼이 없습니다.</div>
        )}
      </div>

      {dan.locationImage && (
        <div className={styles.locationSection}>
          <h2 className={styles.locationTitle}>유랑 위치</h2>
          <div className={styles.locationImageWrapper}>
            <img
              src={dan.locationImage}
              alt="유랑 위치"
              className={styles.locationImage}
            />
          </div>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button className={styles.deleteButton} onClick={handleDelete}>
          삭제하기
        </button>
        <button
          className={styles.listButton}
          onClick={() => router.push("/sky/travelingSprits/specialVisits/list")}
        >
          목록 가기
        </button>
      </div>
    </div>
  );
}
