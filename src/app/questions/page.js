'use client'; // 클라이언트 컴포넌트로 설정
import { useState, useEffect } from 'react';
import './questions.css';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]); // 질문 목록 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

  // 페이지 변경 시 데이터를 다시 가져오는 함수
  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch(`http://43.202.10.10:8080/api/v1/questions?page=${currentPage}`);
      const data = await res.json();
      setQuestions(data.data.content); // 질문 데이터 설정
      setTotalPages(data.data.totalPages); // 총 페이지 수 설정
    }

    fetchQuestions();
  }, [currentPage]); // currentPage가 변경될 때마다 실행

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container">
      <h1>질문 목록</h1>

      {/* 테이블 */}
      <table className="questions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.id}</td>
              <td>{question.subject}</td>
              <td>{question.author || '미작성'}</td>
              <td>{question.viewCount || 0}</td>
              <td>{question.createDate || '미정'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          &lt; 이전
        </button>
        <span>
          {currentPage + 1} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          다음 &gt;
        </button>
      </div>

      {/* 글 작성하기 버튼 */}
      <div className="create-button-container">
        <button className="create-button" onClick={() => alert('글 작성 페이지로 이동')}>
          글 작성하기
        </button>
      </div>
    </div>
  );
}
