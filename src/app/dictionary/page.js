"use client";

import { useState } from "react";
import './dictionary.css';

export default function DictionaryPage() {
  const [query, setQuery] = useState(""); // 검색어 상태
  const [submittedQuery, setSubmittedQuery] = useState(""); 
  const [results, setResults] = useState(null); // 검색 결과
  const [error, setError] = useState(null); // 에러 상태

  // 검색 함수
  const searchDictionary = async () => {
    try {
      setSubmittedQuery(query); 
      setError(null); // 이전 에러 초기화
      setResults(null); // 이전 결과 초기화

      // Next.js API 라우트 호출
      const response = await fetch(`/api/dictionary?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("검색 결과를 찾을 수 없습니다.");
      }

      const data = await response.json();
      if (data.channel?.item?.length > 0) {
        setResults(data.channel.item); // 검색 결과 설정
      } else {
        setResults([]); // 빈 결과로 설정
      }
    } catch (err) {
      setError(err.message); // 에러 메시지 저장
      setResults(null); // 결과 초기화
    }
  };

  return (
    <div className="container">
      <h1>표준국어대사전 검색</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button onClick={searchDictionary}>검색</button>
      </div>

      {submittedQuery && <h2 className="search-query">{submittedQuery}</h2>}

      {error && <p className="error-message">{error}</p>}
      {results !== null && (
        results.length > 0 ? (
          <ul className="results">
            {results.map((item, index) => (
              <li key={item.target_code} data-index={index + 1}>
                <h5>{item.sense.definition}</h5>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">결과를 찾을 수 없습니다!</p>
        )
      )}
      <footer>
        <p>국립국어원 표준국어대사전</p>
      </footer>
    </div>
  );
}
