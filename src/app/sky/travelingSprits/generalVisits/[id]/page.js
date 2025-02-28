"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "./detail.module.css";

export default function SoulDetailPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();
  const [soul, setSoul] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showMoreWearingShots, setShowMoreWearingShots] = useState(false);

  // 클라이언트 사이드에서만 searchParams를 설정
  useEffect(() => {
    setIsClient(true);
    if (searchParams) {
      setCurrentPage(searchParams.get("page") || 1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch(`https://korea-sky-planner.com/api/v1/souls/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("영혼 상세 정보를 가져오는데 실패하였습니다.");
        }
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

  if (!isClient) return null; // 클라이언트가 아니면 아무 것도 렌더링하지 않음

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!soul) return <div className={styles.error}>영혼 정보가 없습니다.</div>;

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
          router.push("/sky/travelingSprits/generalVisits/list");
        } else {
          alert("삭제에 실패하였습니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("삭제 도중 오류가 발생하였습니다.");
      });
  };

  // 기타 노드 렌더링 등은 그대로 유지
  const centerNodesCount = soul.centerNodes ? soul.centerNodes.length : 0;
  const leftNodesToRender = Array.from(
    { length: centerNodesCount },
    (_, i) =>
      (soul.leftSideNodes &&
        soul.leftSideNodes.find((node) => node.nodeOrder === i + 1)) || {
        dummy: true,
      }
  );
  const rightNodesToRender = Array.from(
    { length: centerNodesCount },
    (_, i) =>
      (soul.rightSideNodes &&
        soul.rightSideNodes.find((node) => node.nodeOrder === i + 1)) || {
        dummy: true,
      }
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{soul.name}</h1>
      <div className={styles.topNavigation}>
        <button
          className={styles.listButton}
          onClick={() =>
            router.push(
              `/sky/travelingSprits/generalVisits/list?page=${currentPage}`
            )
          }
        >
          목록 가기
        </button>
      </div>

      {/* 상단 레이아웃 */}
      <div className={styles.topLayout}>
        <div className={styles.representativeImageWrapper}>
          {soul.representativeImage && (
            <img
              src={soul.representativeImage}
              alt="대표 이미지"
              className={styles.representativeImage}
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
            <div className={styles.detailItem}>
              <strong>시즌:</strong> {soul.seasonName}
            </div>
            <div className={styles.detailItem}>
              <strong>기간: </strong> {soul.startDate} ~ {soul.endDate}
            </div>
            <div className={styles.detailItem}>
              {soul.rerunCount}
              <strong>차 복각</strong>
            </div>
          </div>
          {soul.description && (
            <div className={styles.detailItem}>
              <p className={styles.descriptionText}>{soul.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 노드표 */}
      {soul.nodeTableImage && (
        <div className={styles.nodeTableSection}>
          <span className={styles.nodeTableLabel}>노드표</span>
          <div className={styles.nodeTableImageWrapper}>
            <img
              src={soul.nodeTableImage}
              alt="노드표 이미지"
              className={styles.nodeTableImage}
            />
          </div>
        </div>
      )}

      {/* PC용 가로 스크롤 착용샷 */}
      {soul.wearingShotImages && soul.wearingShotImages.length > 0 && (
        <div className={styles.desktopWearingShot}>
          <strong>착용샷</strong>
          <ul className={styles.horizontalList}>
            {soul.wearingShotImages.map((img, index) => (
              <li key={index}>
                <img
                  src={img}
                  alt={`착용샷 ${index + 1}`}
                  className={styles.smallImage}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 모바일용 세로 리스트 + 토글 버튼 착용샷 */}
      {soul.wearingShotImages && soul.wearingShotImages.length > 0 && (
        <div className={styles.mobileWearingShot}>
          <strong>착용샷</strong>
          <div className={styles.wearingShotWrapper}>
            <div
              className={`${styles.wearingShotContainer} ${
                showMoreWearingShots ? styles.showMore : ""
              }`}
            >
              <ul className={styles.verticalList}>
                {(showMoreWearingShots
                  ? soul.wearingShotImages
                  : [soul.wearingShotImages[0]]
                ).map((img, index) => (
                  <li key={index}>
                    <img
                      src={img}
                      alt={`착용샷 ${index + 1}`}
                      className={styles.smallImage}
                    />
                  </li>
                ))}
              </ul>
            </div>
            {soul.wearingShotImages.length > 1 && (
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
      {soul.locationImage && (
        <div className={styles.locationSection}>
          <span className={styles.locationLabel}>영혼 위치</span>
          <div className={styles.locationImageWrapper}>
            <img
              src={soul.locationImage}
              alt="위치 이미지"
              className={styles.locationImage}
            />
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
      {soul.materialUrl && (
        <div className={styles.sourceLink}>
          <a href={soul.materialUrl} target="_blank" rel="noopener noreferrer">
            자료 출처
          </a>
        </div>
      )}

      <div className={styles.centerNavigation}>
        <button
          className={styles.centerListButton}
          onClick={() =>
            router.push(
              `/sky/travelingSprits/generalVisits/list?page=${currentPage}`
            )
          }
        >
          목록가기
        </button>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.editButton} onClick={handleAdd}>
          추가하기
        </button>
        <button className={styles.editButton} onClick={handleEdit}>
          수정하기
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </div>
  );
}
