"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./create.css";

export default function SoulCreatePage() {
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
  const router = useRouter();

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

      console.log("✅ 전송 payload:", payload);
      const res = await fetch("https://korea-sky-planner.com/api/v1/souls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("영혼 생성 실패");

      setSuccess("영혼이 성공적으로 생성되었습니다!");
      router.push("/sky/travelingSprits/generalVisits/list");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">영혼 노드 생성</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label className="label">
          시즌 이름:
          <input
            type="text"
            name="seasonName"
            value={formData.seasonName}
            onChange={handleChange}
            className="input"
            required
          />
        </label>

        <label className="label">
          순서:
          <input
            type="number"
            name="orderNum"
            value={formData.orderNum}
            onChange={handleChange}
            className="input"
            required
          />
        </label>

        <label className="label">
          영혼 이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
          />
        </label>

        <label className="label">
          시작 날짜:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="input"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
          />
        </label>

        <label className="label">
          마감 날짜:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="input"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
          />
        </label>

        <label className="label">
          복각 횟수:
          <input
            type="number"
            name="rerunCount"
            value={formData.rerunCount}
            onChange={handleChange}
            className="input"
          />
        </label>

        <label className="label">
          키워드 (쉼표로 구분):
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="input"
          />
        </label>

        <label className="label">
          제작자:
          <input
            type="text"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            className="input"
          />
        </label>

        <button type="submit" className="button">
          생성하기
        </button>
      </form>
    </div>
  );
}
