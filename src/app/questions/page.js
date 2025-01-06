'use client'; // 클라이언트 컴포넌트 설정
import { useRouter } from 'next/navigation'; // Next.js 라우터 가져오기
import { useState, useEffect } from 'react';
import './questions.css';

export default function QuestionsPage() {
  const router = useRouter(); // 라우터 초기화
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch(`http://43.202.10.10:8080/api/v1/questions?page=${currentPage}`);
      const data = await res.json();
      setQuestions(data.data.content);
      setTotalPages(data.data.totalPages);
    }

    fetchQuestions();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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
        <button
          className="create-button"
          onClick={() => router.push('/questions/create')} // 글 작성 페이지로 이동
        >
          글 작성하기
        </button>
      </div>
    </div>
  );
}
