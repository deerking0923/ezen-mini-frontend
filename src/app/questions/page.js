'use client'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './questions.css';

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true); // 로딩 시작
      try {
        const res = await fetch(`http://43.202.10.10:8080/api/v1/questions?page=${currentPage}`);
        const data = await res.json();
        setQuestions(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error("질문을 가져오는 데 실패했습니다.", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
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

      {/* 로딩 상태 표시 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : (
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
                <td
                  className="clickable-title"
                  onClick={() => router.push(`/questions/${question.id}`)}
                >
                  {question.subject}
                </td>
                <td>{question.author || '미작성'}</td>
                <td>{question.viewCount || 0}</td>
                <td>{question.createDate || '미정'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

      <div className="create-button-container">
        <button
          className="create-button"
          onClick={() => router.push('/questions/create')}
        >
          글 작성하기
        </button>
      </div>
    </div>
  );
}
