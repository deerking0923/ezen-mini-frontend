"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./detail.module.css";

export default function SoulDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [soul, setSoul] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!soul) return <div className={styles.error}>영혼 정보가 없습니다.</div>;

  const handleEdit = () => {
    router.push(`/sky/travelingSprits/generalVisits/edit/${id}`);
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

  // 중앙 노드의 개수를 기반으로 왼쪽과 오른쪽 노드를 렌더링
  const centerNodesCount = soul.centerNodes ? soul.centerNodes.length : 0;

  // 왼쪽, 오른쪽 노드는 중앙 노드의 개수만큼 렌더링 (dummy 노드는 투명 처리)
  const leftNodesToRender = Array.from({ length: centerNodesCount }, (_, i) =>
    (soul.leftSideNodes && soul.leftSideNodes.find((node) => node.nodeOrder === i + 1)) || { dummy: true }
  );
  const rightNodesToRender = Array.from({ length: centerNodesCount }, (_, i) =>
    (soul.rightSideNodes && soul.rightSideNodes.find((node) => node.nodeOrder === i + 1)) || { dummy: true }
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{soul.name}</h1>

      {/* 상단 레이아웃: 대표 이미지(왼), 정보(오른) */}
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
              <strong>순서:</strong> {soul.orderNum}
            </div>
            <div className={styles.detailItem}>
              <strong>시즌:</strong> {soul.seasonName}
            </div>
            <div className={styles.detailItem}>
              <strong>기간:</strong> {soul.startDate} ~ {soul.endDate}
            </div>
            <div className={styles.detailItem}>
              <strong>복각 횟수:</strong> {soul.rerunCount}
            </div>
          </div>

          {soul.creator && (
            <div className={styles.creatorPanel}>
              <strong>제작자:</strong> {soul.creator}
            </div>
          )}

          {soul.description && (
            <div className={styles.detailItem}>
              <strong>설명:</strong> {soul.description}
            </div>
          )}

          {soul.keywords && soul.keywords.length > 0 && (
            <div className={styles.detailItem}>
              <strong>키워드:</strong> {soul.keywords.join(", ")}
            </div>
          )}
        </div>
      </div>

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

      {soul.wearingShotImages && soul.wearingShotImages.length > 0 && (
        <div className={styles.section}>
          <strong>착용샷 이미지:</strong>
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

      {soul.gestureGifs && soul.gestureGifs.length > 0 && (
        <div className={styles.section}>
          <strong>제스처 GIFs:</strong>
          <ul className={styles.horizontalList}>
            {soul.gestureGifs.map((gif, index) => (
              <li key={index}>
                <img
                  src={gif}
                  alt={`제스처 GIF ${index + 1}`}
                  className={styles.smallImage}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.nodeSection}>
        <div className={styles.nodeSectionTitle}>노드 표</div>
        <div className={styles.nodeContainer}>
          {/* 왼쪽 노드 - 중앙 노드의 개수만큼 렌더링 */}
          <div className={styles.nodeColumn}>
            {leftNodesToRender.map((node, i) => (
              <div
                className={`${styles.nodeItem} ${
                  node.dummy ? styles.dummyNode : ""
                }`}
                key={`left-${i}`}
              >
                {!node.dummy && (
                  <>
                    <p>순서 {node.nodeOrder}</p>
                    {node.photo && (
                      <img
                        src={node.photo}
                        alt={`왼쪽 노드 ${node.nodeOrder}`}
                        className={styles.nodeImage}
                      />
                    )}
                    <span className={styles.nodePrice}>
                      {node.currencyPrice}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 중앙 노드 */}
          <div className={styles.nodeColumn}>
            {soul.centerNodes?.map((node, i) => (
              <div className={styles.nodeItem} key={`center-${i}`}>
                <p>순서 {node.nodeOrder}</p>
                {node.photo && (
                  <img
                    src={node.photo}
                    alt={`중앙 노드 ${node.nodeOrder}`}
                    className={styles.nodeImage}
                  />
                )}
                <span className={styles.nodePrice}>
                  {node.currencyPrice}
                </span>
              </div>
            ))}
          </div>

          {/* 오른쪽 노드 - 중앙 노드의 개수만큼 렌더링 */}
          <div className={styles.nodeColumn}>
            {rightNodesToRender.map((node, i) => (
              <div
                className={`${styles.nodeItem} ${
                  node.dummy ? styles.dummyNode : ""
                }`}
                key={`right-${i}`}
              >
                {!node.dummy && (
                  <>
                    <p>순서 {node.nodeOrder}</p>
                    {node.photo && (
                      <img
                        src={node.photo}
                        alt={`오른쪽 노드 ${node.nodeOrder}`}
                        className={styles.nodeImage}
                      />
                    )}
                    <span className={styles.nodePrice}>
                      {node.currencyPrice}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
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
