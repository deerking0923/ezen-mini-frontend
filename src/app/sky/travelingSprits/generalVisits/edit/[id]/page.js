"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./edit.module.css";


export default function SoulEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    seasonName: "",
    name: "",
    orderNum: 0,
    startDate: "",
    endDate: "",
    rerunCount: 0,
    keywords: "",
    creator: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSoul() {
      const res = await fetch(`https://korea-sky-planner.com/api/v1/souls/${id}`);
      const data = await res.json();
      const soul = data.data;
      setFormData({
        seasonName: soul.seasonName || "",
        name: soul.name || "",
        orderNum: soul.orderNum || 0,
        startDate: soul.startDate || "",
        endDate: soul.endDate || "",
        rerunCount: soul.rerunCount || 0,
        keywords: soul.keywords?.join(", ") || "",
        creator: soul.creator || "",
      });
    }
    fetchSoul();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        rerunCount: Number(formData.rerunCount),
        orderNum: Number(formData.orderNum),
        keywords: formData.keywords
          ? formData.keywords.split(",").map((s) => s.trim())
          : [],
      };
      const res = await fetch(
        `https://korea-sky-planner.com/api/v1/souls/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const text = await res.text();
      if (!res.ok) throw new Error(`수정 실패: ${text}`);
      setSuccess("영혼 정보가 수정되었습니다!");
      router.push("/sky/travelingSprits/generalVisits/list");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>영혼 수정</h1>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          { name: "seasonName", label: "시즌 이름" },
          { name: "name", label: "영혼 이름" },
          { name: "orderNum", label: "순서", type: "number" },
          { name: "startDate", label: "시작 날짜", type: "date" },
          { name: "endDate", label: "마감 날짜", type: "date" },
          { name: "rerunCount", label: "복각 횟수", type: "number" },
          { name: "keywords", label: "키워드 (쉼표로 구분)" },
          { name: "creator", label: "제작자" },
        ].map(({ name, label, type = "text" }) => (
          <label key={name} className={styles.label}>
            {label}:
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
        ))}
        <button type="submit" className={styles.button}>
          수정하기
        </button>
      </form>
    </div>
  );
}
