// src/app/sky/travelingSprits/generalVisits/[id]/page.js (또는 해당 상세 경로)
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "./detail.module.css";

export default function SoulDetailPage() {
  const [showCopied, setShowCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMoreWearingShots, setShowMoreWearingShots] = useState(false);
  const [soul, setSoul] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();

  // ✅ 영혼 뷰: page 제거, mode/query만 유지
  const viewMode = searchParams.get("mode") || "card";
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`https://korea-sky-planner.com/api/v1/souls/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("영혼 상세 정보를 가져오는데 실패하였습니다.");
        return res.json();
      })
      .then((data) => {
        setSoul(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // ✅ 목록 URL 빌더: page 미사용, 필요 시 해시로 영혼 고정
  const buildListUrl = (opts = { withHash: true }) => {
    const params = new URLSearchParams();
    if (viewMode) params.set("mode", viewMode); // 기본 card
    if (query) params.set("query", query);
    const base = `/sky/travelingSprits/generalVisits/list${
      params.toString() ? "?" + params.toString() : ""
    }`;
    return opts.withHash ? `${base}#soul-${id}` : base;
  };

  // ✅ 목록 가기: 가능하면 브라우저 히스토리로(back), 없으면 영혼 해시 fallback
  const goBackToList = () => {
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      const cameFromList =
        ref && ref.origin === window.location.origin &&
        ref.pathname.includes("/sky/travelingSprits/generalVisits/list");

      if (cameFromList && window.history.length > 1) {
        router.back(); // 해시/저장된 상태로 정확히 복귀
        return;
      }
    } catch {}
    // 히스토리가 없거나 리스트에서 오지 않은 경우: 해시로 직접 이동
    router.push(buildListUrl({ withHash: true }));
  };

  const handleEdit = () => {
    router.push(`/sky/travelingSprits/generalVisits/edit/${id}`);
  };

  const handleAdd = () => {
    router.push(`/sky/travelingSprits/generalVisits/add/${id}`);
  };

  const handleDelete = () => {
    const confirmation = prompt(
      '정말 삭제하시겠습니까? 삭제를 진행하려면 "1234"를 입력하세요.'
    );
    if (confirmation !== "1234") {
      alert("입력이 올바르지 않아 삭제가 취소되었습니다.");
      return;
    }
    fetch(`https://korea-sky-planner.com/api/v1/souls/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("삭제가 완료되었습니다.");
          // ✅ 삭제 후에는 해당 영혼 앵커가 의미 없으므로 해시 없이 목록으로
          router.push(buildListUrl({ withHash: false }));
        } else {
          alert("삭제에 실패하였습니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("삭제 도중 오류가 발생하였습니다.");
      });
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!soul) return <div className={styles.error}>영혼 정보가 없습니다.</div>;

  // 이미지 분류
  const representativeImage = soul.images?.find(
    (img) => img.imageType === "REPRESENTATIVE"
  )?.url;
  const nodeTableImage = soul.images?.find(
    (img) => img.imageType === "NODE_TABLE"
  )?.url;
  const wearingShotImages = soul.images
    ?.filter((img) => img.imageType === "WEARING_SHOT")
    .map((img) => img.url);
  const locationImage = soul.images?.find(
    (img) => img.imageType === "LOCATION"
  )?.url;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{soul.name}</h1>

      {!isMobile && (
        <div className={styles.topNavigation}>
          <button className={styles.listButton} onClick={goBackToList}>
            목록 가기
          </button>
        </div>
      )}

      {/* 상단 레이아웃 */}
      <div className={styles.topLayout}>
        <div className={styles.representativeImageWrapper}>
          {representativeImage && (
            <img
              src={representativeImage}
              alt="대표 이미지"
              className={styles.representativeImage}
              style={{ cursor: "default" }}
            />
          )}
        </div>
        <div className={styles.infoSection}>
          <div className={styles.topInfoGrid}>
            <div className={styles.detailItem}>
              {soul.orderNum < 0
                ? `${Math.abs(soul.orderNum)}번째 유랑단`
                : `${soul.orderNum}번째 영혼`}
            </div>
            <div className={styles.detailItem}>{soul.rerunCount}차 복각</div>
            <div className={styles.detailItem}>{soul.seasonName} 시즌</div>
            <div className={styles.detailItem}>
              기간: {soul.startDate} ~ {soul.endDate}
            </div>
          </div>

          {/* 같은 영혼 더 보기 */}
          <div className={styles.sameSoulContainer}>
            <button
              className={styles.sameSoulButton}
              onClick={() =>
                router.push(
                  `/sky/travelingSprits/generalVisits/list?${new URLSearchParams({
                    query: soul.name,
                    mode: viewMode || "card",
                  }).toString()}`
                )
              }
            >
              같은 영혼 더 보기
            </button>
          </div>
        </div>
      </div>

      {/* 노드표 */}
      {nodeTableImage && (
        <div className={styles.nodeTableSection}>
          <span className={styles.nodeTableLabel}>노드표</span>
          <div className={styles.nodeTableImageWrapper}>
            <img
              src={nodeTableImage}
              alt="노드표 이미지"
              className={styles.nodeTableImage}
            />
          </div>
        </div>
      )}

      {/* 착용샷 */}
      {wearingShotImages && wearingShotImages.length > 0 && (
        <div className={styles.desktopWearingShot}>
          <strong>착용샷</strong>
          <ul className={styles.horizontalList}>
            {wearingShotImages.map((url, idx) => (
              <li key={idx}>
                <img
                  src={url}
                  alt={`착용샷 ${idx + 1}`}
                  className={styles.smallImage}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 모바일용 세로 리스트 + 토글 버튼 착용샷 */}
      {wearingShotImages && wearingShotImages.length > 0 && (
        <div className={styles.mobileWearingShot}>
          <strong>착용샷</strong>
          <div className={styles.wearingShotWrapper}>
            <div
              className={`${styles.wearingShotContainer} ${
                showMoreWearingShots ? styles.showMore : ""
              }`}
            >
              <ul className={styles.verticalList}>
                {(showMoreWearingShots ? wearingShotImages : [wearingShotImages[0]]).map(
                  (url, idx) => (
                    <li key={idx}>
                      <img
                        src={url}
                        alt={`착용샷 ${idx + 1}`}
                        className={styles.smallImage}
                      />
                    </li>
                  )
                )}
              </ul>
            </div>
            {wearingShotImages.length > 1 && (
              <button
                onClick={() => setShowMoreWearingShots((prev) => !prev)}
                className={styles.toggleButton}
              >
                {showMoreWearingShots ? "접기" : "더보기"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 영혼 위치 이미지 */}
      {locationImage && (
        <div className={styles.locationSection}>
          <span className={styles.locationLabel}>영혼 위치</span>
          <div className={styles.locationImageWrapper}>
            <img src={locationImage} alt="위치 이미지" className={styles.locationImage} />
          </div>
        </div>
      )}

      {/* 키워드 및 제작자 영역 */}
      {soul.keywords && soul.keywords.length > 0 && (
        <div className={styles.keywordsSection}>
          <div className={styles.keywordsLeft}>
            <strong className={styles.keywordsLabel}>키워드:</strong>
            {soul.keywords.map((keyword, idx) => (
              <span key={idx} className={styles.keywordChip}>
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      {soul.creator && (
        <div className={styles.creatorTag} style={{ textAlign: "right" }}>
          자료 출처: {soul.creator}
        </div>
      )}

      {/* URL 복사 & 목록가기 */}
      <div className={styles.copyUrlContainer}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
          }}
        >
          URL 복사
        </button>
        {showCopied && <span className={styles.copiedToast}>복사됨!</span>}
      </div>

      <div className={styles.centerNavigation}>
        <button className={styles.centerListButton} onClick={goBackToList}>
          목록가기
        </button>
      </div>

      {/* 관리 버튼들 예시
      <div className={styles.adminButtons}>
        <button onClick={handleEdit}>수정</button>
        <button onClick={handleAdd}>추가</button>
        <button onClick={handleDelete}>삭제</button>
      </div> */}
    </div>
  );
}
