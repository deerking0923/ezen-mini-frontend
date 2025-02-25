"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./create.module.css";

export default function YurangDanCreatePage() {
  const router = useRouter();

  // 유랑단 관련 폼 데이터 (필요한 필드)
  const [formData, setFormData] = useState({
    roundNumber: 0,
    startDate: "",
    endDate: "",
    sourceUrl: "",
    keywords: "",
  });

  // 파일 상태
  const [repImage, setRepImage] = useState(null);
  const [locImage, setLocImage] = useState(null);

  // 유랑 영혼 배열 상태
  const [yurangSouls, setYurangSouls] = useState([]);

  // 텍스트 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 입력 핸들러
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file);
  };

  // 유랑 영혼 추가 버튼 핸들러
  const addYurangSoul = () => {
    setYurangSouls((prev) => [
      ...prev,
      { seasonName: "", yurangName: "", url: "", rerunCount: 0 },
    ]);
  };

  // 각 유랑 영혼 업데이트 핸들러
  const updateYurangSoul = (index, key, value) => {
    setYurangSouls((prev) => {
      const newSouls = [...prev];
      newSouls[index] = { ...newSouls[index], [key]: value };
      return newSouls;
    });
  };

  // 파일 업로드 함수
  const uploadFile = async (file) => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("https://korea-sky-planner.com/api/v1/upload", {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    return json.url;
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const repImageUrl = repImage ? await uploadFile(repImage) : "";
    const locImageUrl = locImage ? await uploadFile(locImage) : "";

    const payload = {
      roundNumber: Number(formData.roundNumber),
      representativeImage: repImageUrl,
      locationImage: locImageUrl,
      startDate: formData.startDate,
      endDate: formData.endDate,
      sourceUrl: formData.sourceUrl,
      keywords: formData.keywords
        ? formData.keywords.split(",").map((s) => s.trim())
        : [],
      yurangSouls: yurangSouls.map((soul) => ({
        seasonName: soul.seasonName,
        yurangName: soul.yurangName,
        url: soul.url, // URL 필수 아님 (빈 문자열 허용)
        rerunCount: Number(soul.rerunCount),
      })),
    };

    console.log("Payload to send:", payload);

    const res = await fetch("https://korea-sky-planner.com/api/v1/yurangdans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/sky/travelingSprits/specialVisits/list");
    } else {
      console.error("Creation failed");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>유랑단 생성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          몇차:
          <input
            type="number"
            name="roundNumber"
            value={formData.roundNumber}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          시작 날짜:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          끝난 날짜:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          출처 URL:
          <input
            type="url"
            name="sourceUrl"
            value={formData.sourceUrl || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          키워드 (쉼표로 구분):
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          대표 이미지:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setRepImage)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          위치 이미지:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLocImage)}
            className={styles.input}
          />
        </label>

        {/* 유랑 영혼 추가 영역 */}
        <div className={styles.soulSection}>
          <h2>유랑 영혼</h2>
          {yurangSouls.map((soul, index) => (
            <div key={index} className={styles.soulGroup}>
              <label className={styles.label}>
                시즌 이름:
                <input
                  type="text"
                  value={soul.seasonName}
                  onChange={(e) =>
                    updateYurangSoul(index, "seasonName", e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.label}>
                유랑 이름:
                <input
                  type="text"
                  value={soul.yurangName}
                  onChange={(e) =>
                    updateYurangSoul(index, "yurangName", e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.label}>
                URL:
                <input
                  type="url"
                  value={soul.url || ""}
                  onChange={(e) =>
                    updateYurangSoul(index, "url", e.target.value)
                  }
                  className={styles.input}
                  // URL 필수 아님
                />
              </label>
              <label className={styles.label}>
                복각 횟수:
                <input
                  type="number"
                  value={soul.rerunCount}
                  onChange={(e) =>
                    updateYurangSoul(index, "rerunCount", e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={addYurangSoul}
            className={styles.addSoulButton}
          >
            + 영혼 추가
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          생성하기
        </button>
      </form>
    </div>
  );
}
