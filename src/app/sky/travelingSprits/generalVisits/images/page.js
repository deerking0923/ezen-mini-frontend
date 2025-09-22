// src/app/sky/travelingSprits/generalVisits/images/page.js
"use client";

import React, { useState, useEffect } from "react";
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
  const [imageType, setImageType] = useState("");
  const [searchId, setSearchId] = useState("");
  const [page, setPage] = useState(0);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 전체 URL 보정
  const getFullUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  // 1) 모든 이미지 조회 (기본)
  const fetchAllImages = async (p = 0) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", p);
      params.append("size", 50); // 더 많이 보기
      
      const res = await fetch(`${BASE_URL}/api/v1/images?${params.toString()}`);
      if (!res.ok) throw new Error(`조회 실패: ${res.status}`);
      
      const json = await res.json();
      const pageData = json.data;
      setImages(pageData.content || []);
      setTotalPages(pageData.totalPages || 1);
    } catch (err) {
      setError(err.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // 2) 필터링된 이미지 조회
  const fetchFilteredImages = async (sId, type, p = 0) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", p);
      params.append("size", 50);
      
      if (sId) params.append("soulId", sId);
      if (type) params.append("imageType", type);

      const res = await fetch(`${BASE_URL}/api/v1/images?${params.toString()}`);
      if (!res.ok) throw new Error(`조회 실패: ${res.status}`);
      
      const json = await res.json();
      const pageData = json.data;
      setImages(pageData.content || []);
      setTotalPages(pageData.totalPages || 1);
    } catch (err) {
      setError(err.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // 3) ID로 특정 이미지 조회
  const fetchImageById = async (id) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/v1/images/${id}`);
      if (!res.ok) throw new Error(`조회 실패: ${res.status}`);
      
      const json = await res.json();
      const imageData = json.data;
      setImages([imageData]);
      setTotalPages(1);
    } catch (err) {
      setError(err.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 - 모든 이미지 표시
  useEffect(() => {
    fetchAllImages(0);
  }, []);

  // 필터 적용
  const handleFilter = () => {
    setPage(0);
    if (searchId) {
      fetchImageById(searchId);
    } else {
      fetchFilteredImages(soulId, imageType, 0);
    }
  };

  // 전체 보기
  const handleShowAll = () => {
    setSoulId("");
    setImageType("");
    setSearchId("");
    setPage(0);
    fetchAllImages(0);
  };

  // 페이지 변경
  const changePage = (newPage) => {
    setPage(newPage);
    if (searchId) {
      // ID 검색 중에는 페이징 안 함
      return;
    } else if (soulId || imageType) {
      fetchFilteredImages(soulId, imageType, newPage);
    } else {
      fetchAllImages(newPage);
    }
  };

  // 4) 이미지 업로드
  const handleUpload = async () => {
    if (!fileToUpload) {
      setError("파일을 선택해주세요.");
      return;
    }
    if (!soulId) {
      setError("영혼 ID를 입력해주세요.");
      return;
    }
    if (!imageType) {
      setError("이미지 타입을 선택해주세요.");
      return;
    }

    const fd = new FormData();
    fd.append("soulId", soulId);
    fd.append("imageType", imageType);
    fd.append("file", fileToUpload);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BASE_URL}/api/v1/images`, {
        method: "POST",
        body: fd,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`업로드 실패: ${res.status} - ${errorText}`);
      }
      
      setFileToUpload(null);
      setSuccess("이미지가 성공적으로 업로드되었습니다!");
      
      // 업로드 후 현재 보기 새로고침
      setTimeout(() => {
        if (searchId) {
          fetchImageById(searchId);
        } else if (soulId || imageType) {
          fetchFilteredImages(soulId, imageType, page);
        } else {
          fetchAllImages(page);
        }
        setSuccess("");
      }, 1000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5) 이미지 삭제
  const handleDelete = async (imgId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await fetch(`${BASE_URL}/api/v1/images/${imgId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`삭제 실패: ${res.status} - ${errorText}`);
      }
      
      setSuccess("이미지가 성공적으로 삭제되었습니다!");
      
      // 삭제 후 현재 보기 새로고침
      setTimeout(() => {
        if (searchId) {
          fetchImageById(searchId);
        } else if (soulId || imageType) {
          fetchFilteredImages(soulId, imageType, page);
        } else {
          fetchAllImages(page);
        }
        setSuccess("");
      }, 1000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>이미지 관리 시스템</h1>
      
      {/* 상태 메시지 */}
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* 검색 및 필터 영역 */}
      <div className={styles.controlSection}>
        <div className={styles.searchSection}>
          <h3>검색 및 필터</h3>
          <div className={styles.filterRow}>
            <label className={styles.label}>
              이미지 ID로 검색:
              <input
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className={`${styles.input} ${styles.labelInput}`}
                placeholder="이미지 ID 입력"
              />
            </label>
            <button onClick={handleFilter} className={styles.button}>
              ID 검색
            </button>
          </div>
          
          <div className={styles.filterRow}>
            <label className={styles.label}>
              영혼 ID:
              <input
                type="number"
                value={soulId}
                onChange={(e) => setSoulId(e.target.value)}
                className={`${styles.input} ${styles.labelInput}`}
                placeholder="영혼 ID"
              />
            </label>
            <label className={styles.label}>
              이미지 타입:
              <select
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                className={`${styles.select} ${styles.labelInput}`}
              >
                <option value="">전체</option>
                {IMAGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={handleFilter} className={styles.button}>
              필터 적용
            </button>
            <button onClick={handleShowAll} className={styles.buttonSecondary}>
              전체 보기
            </button>
          </div>
        </div>

        {/* 업로드 영역 */}
        <div className={styles.uploadSection}>
          <h3>새 이미지 업로드</h3>
          <div className={styles.uploadRow}>
            <label className={styles.label}>
              영혼 ID:
              <input
                type="number"
                value={soulId}
                onChange={(e) => setSoulId(e.target.value)}
                className={`${styles.input} ${styles.labelInput}`}
                placeholder="필수"
                required
              />
            </label>
            <label className={styles.label}>
              이미지 타입:
              <select
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                className={`${styles.select} ${styles.labelInput}`}
                required
              >
                <option value="">선택하세요</option>
                {IMAGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              파일:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFileToUpload(e.target.files[0])}
                className={`${styles.fileInput} ${styles.labelInput}`}
                required
              />
            </label>
            <button 
              onClick={handleUpload} 
              className={styles.buttonPrimary}
              disabled={!fileToUpload || !soulId || !imageType}
            >
              업로드
            </button>
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {loading && <div className={styles.loading}>처리 중...</div>}

      {/* 이미지 갤러리 */}
      {!loading && (
        <div className={styles.gallerySection}>
          <div className={styles.galleryHeader}>
            <h3>이미지 목록 ({images.length}개)</h3>
          </div>
          
          {images.length === 0 ? (
            <div className={styles.noImages}>표시할 이미지가 없습니다.</div>
          ) : (
            <div className={styles.gallery}>
              {images.map((img) => {
                const src = getFullUrl(img.url);
                return (
                  <div key={img.id} className={styles.imageCard}>
                    <div className={styles.imageWrapper}>
                      {src ? (
                        <img
                          src={src}
                          alt={`${img.imageType} - ${img.id}`}
                          className={styles.image}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={styles.noImage} style={{display: src ? 'none' : 'flex'}}>
                        이미지 없음
                      </div>
                    </div>
                    
                    <div className={styles.imageInfo}>
                      <div className={styles.imageId}>ID: {img.id}</div>
                      <div className={styles.imageType}>{img.imageType}</div>
                      <div className={styles.soulId}>
                        Soul ID: {img.soulId || "없음"}
                      </div>
                      <div className={styles.fileName}>{img.fileName}</div>
                      {img.fileSize && (
                        <div className={styles.fileSize}>
                          {(img.fileSize / 1024).toFixed(1)}KB
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDelete(img.id)}
                      className={styles.deleteButton}
                    >
                      삭제
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* 페이징 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page <= 0}
                onClick={() => changePage(page - 1)}
                className={styles.paginationButton}
              >
                이전
              </button>
              
              <span className={styles.pageInfo}>
                {page + 1} / {totalPages}
              </span>
              
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => changePage(page + 1)}
                className={styles.paginationButton}
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}