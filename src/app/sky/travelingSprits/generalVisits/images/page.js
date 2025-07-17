// src/app/sky/travelingSprits/generalVisits/images/page.js
"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

const IMAGE_TYPES = [
  "REPRESENTATIVE",
  "LOCATION",
  "WEARING_SHOT",
  "NODE_TABLE",
];

const BASE_URL = "https://korea-sky-planner.com";

export default function ImageManagerPage() {
  const [soulId, setSoulId] = useState("");
  const [imageType, setImageType] = useState(IMAGE_TYPES[0]);
  const [page, setPage] = useState(0);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 전체 URL 보정
  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  // 1) 이미지 목록 조회
  const fetchImages = async (sId, type, p) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", p);
      params.append("size", 20);
      if (sId) params.append("soulId", sId);
      if (type) params.append("imageType", type);

      const res = await fetch(
        `${BASE_URL}/api/v1/images?${params.toString()}`
      );
      if (!res.ok) throw new Error("조회 실패");
      const json = await res.json();
      const pageData = json.data; // Page<ImageResponse>
      setImages(pageData.content);
      setTotalPages(pageData.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 필터(조회) 버튼
  const handleFilter = () => {
    setPage(0);
    fetchImages(soulId, imageType, 0);
  };

  // 페이지 변경
  const changePage = (newPage) => {
    setPage(newPage);
    fetchImages(soulId, imageType, newPage);
  };

  // 2) 이미지 업로드
  const handleUpload = async () => {
    if (!fileToUpload || !soulId) {
      return alert("영혼 ID와 파일을 모두 선택해주세요.");
    }
    const fd = new FormData();
    fd.append("soulId", soulId);
    fd.append("imageType", imageType);
    fd.append("file", fileToUpload);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/images`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("업로드 실패");
      setFileToUpload(null);
      fetchImages(soulId, imageType, page);
    } catch {
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  // 3) 이미지 삭제
  const handleDelete = async (imgId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`${BASE_URL}/api/v1/images/${imgId}`, {
      method: "DELETE",
    });
    fetchImages(soulId, imageType, page);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>이미지 관리</h2>

      {/* 조회 / 업로드 컨트롤 */}
      <div className={styles.controls}>
        <div className={styles.filter}>
          <label>
            영혼 ID:
            <input
              type="number"
              value={soulId}
              onChange={(e) => setSoulId(e.target.value)}
              className={styles.input}
            />
          </label>
          <label>
            타입:
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className={styles.select}
            >
              {IMAGE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleFilter} className={styles.button}>
            조회
          </button>
        </div>

        <div className={styles.upload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFileToUpload(e.target.files[0])}
            className={styles.input}
          />
          <button onClick={handleUpload} className={styles.button}>
            업로드
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {loading ? (
        <p>로딩 중…</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <ul className={styles.gallery}>
            {images.map((img) => {
              const src = getFullUrl(img.url);
              return (
                <li key={img.id} className={styles.galleryItem}>
                  {src ? (
                    <img
                      src={src}
                      alt={img.imageType}
                      className={styles.galleryImage}
                    />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                  <div className={styles.imageInfo}>
                    <span className={styles.imageType}>{img.imageType}</span>
                    <span className={styles.soulId}>
                      Soul ID: {img.soulId ?? "-"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className={styles.deleteBtn}
                  >
                    삭제
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.pager}>
            <button
              disabled={page <= 0}
              onClick={() => changePage(page - 1)}
              className={styles.button}
            >
              이전
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => changePage(page + 1)}
              className={styles.button}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
