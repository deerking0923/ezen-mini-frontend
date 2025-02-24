"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./detail.module.css";

export default function SoulDetailPage() {
  const { id } = useParams();
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
        // API 응답이 ApiResponse 래퍼 형태라면 data.data를 사용합니다.
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{soul.name}</h1>

      {/* 상단 정보: 순서, 시즌 / 기간, 복각 횟수 */}
      <div className={styles.topInfoRow}>
        <p className={styles.detailItem}>
          <strong>순서:</strong> {soul.orderNum}
        </p>
        <p className={styles.detailItem}>
          <strong>시즌:</strong> {soul.seasonName}
        </p>
      </div>
      <div className={styles.topInfoRow}>
        <p className={styles.detailItem}>
          <strong>기간:</strong> {soul.startDate} ~ {soul.endDate}
        </p>
        <p className={styles.detailItem}>
          <strong>복각 횟수:</strong> {soul.rerunCount}
        </p>
      </div>

      {/* 제작자 패널 - 오른쪽에 크게 배치 */}
      {soul.creator && (
        <div className={styles.creatorPanel}>
          <strong>제작자:</strong> {soul.creator}
        </div>
      )}

      {soul.description && (
        <p className={styles.detailItem}>
          <strong>설명:</strong> {soul.description}
        </p>
      )}

      {soul.representativeImage && (
        <div className={styles.imageWrapper}>
          <img
            src={soul.representativeImage}
            alt={`${soul.name} 대표 이미지`}
            className={styles.image}
          />
        </div>
      )}
      {soul.locationImage && (
        <div className={styles.imageWrapper}>
          <img
            src={soul.locationImage}
            alt="위치 이미지"
            className={styles.image}
          />
        </div>
      )}

      {/* 제스처 GIFs - 한 줄 가로 스크롤 */}
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

      {/* 착용샷 이미지 - 한 줄 가로 스크롤 */}
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

      {soul.keywords && soul.keywords.length > 0 && (
        <p className={styles.detailItem}>
          <strong>키워드:</strong> {soul.keywords.join(", ")}
        </p>
      )}

      {/* 노드 리스트 */}
      {soul.centerNodes && soul.centerNodes.length > 0 && (
        <div className={styles.section}>
          <h2>중앙 노드</h2>
          <ul className={styles.nodeList}>
            {soul.centerNodes.map((node, index) => (
              <li key={index}>
                <p>순서: {node.nodeOrder}</p>
                <p>재화 가격: {node.currencyPrice}</p>
                {node.photo && (
                  <img
                    src={node.photo}
                    alt={`중앙 노드 ${node.nodeOrder}`}
                    className={styles.nodeImage}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {soul.leftSideNodes && soul.leftSideNodes.length > 0 && (
        <div className={styles.section}>
          <h2>왼쪽 사이드 노드</h2>
          <ul className={styles.nodeList}>
            {soul.leftSideNodes.map((node, index) => (
              <li key={index}>
                <p>순서: {node.nodeOrder}</p>
                <p>재화 가격: {node.currencyPrice}</p>
                {node.photo && (
                  <img
                    src={node.photo}
                    alt={`왼쪽 노드 ${node.nodeOrder}`}
                    className={styles.nodeImage}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {soul.rightNodes && soul.rightNodes.length > 0 && (
        <div className={styles.section}>
          <h2>오른쪽 사이드 노드</h2>
          <ul className={styles.nodeList}>
            {soul.rightNodes.map((node, index) => (
              <li key={index}>
                <p>순서: {node.nodeOrder}</p>
                <p>재화 가격: {node.currencyPrice}</p>
                {node.photo && (
                  <img
                    src={node.photo}
                    alt={`오른쪽 노드 ${node.nodeOrder}`}
                    className={styles.nodeImage}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
