'use client'; // 클라이언트 컴포넌트로 설정
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import './detail.css';

export default function QuestionDetailPage({ params }) {
  const router = useRouter();
  const [question, setQuestion] = useState(null); // 질문 데이터 상태
  const [answers, setAnswers] = useState([]); // 답변 데이터 상태
  const [newAnswer, setNewAnswer] = useState(''); // 새 답변 상태
  const [id, setId] = useState(null); // id 상태 추가

  // params를 비동기적으로 처리
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id); // id를 상태에 저장
    }
    resolveParams();
  }, [params]);

  // 질문 데이터와 답변 가져오기
  useEffect(() => {
    if (id) {
      async function fetchQuestion() {
        try {
          const res = await fetch(`http://43.202.10.10:8080/api/v1/questions/${id}`);
          if (!res.ok) throw new Error('데이터를 가져오는 데 실패했습니다.');
          const data = await res.json();
          setQuestion(data.data);
          setAnswers(data.data.answers || []);
        } catch (error) {
          console.error(error);
        }
      }
      fetchQuestion();
    }
  }, [id]);

  // 답변 등록
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://43.202.10.10:8080/api/v1/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newAnswer,
          questionId: id,
        }),
      });

      if (!res.ok) throw new Error('답변 등록에 실패했습니다.');

      //alert('답변이 등록되었습니다.');
      setNewAnswer(''); // 입력 필드 초기화

      // 페이지 강제 새로고침
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  // 질문 수정 페이지로 이동
  const handleEditQuestion = () => {
    router.push(`/questions/${id}/edit`);
  };

  // 로딩 상태 처리
  if (!question) return <p>로딩 중...</p>;

  return (
    <div className="detail-container">
      <h1>{question.subject}</h1>
      <p>작성자: {question.author || '익명'}</p>
      <p>조회수: {question.viewCount}</p>
      <p>작성일: {question.createDate}</p>
      <div className="content">{question.content}</div>

      {/* 수정 버튼 */}
      <button className="edit-button" onClick={handleEditQuestion}>
        질문 수정
      </button>

      <hr />

      {/* 답변 목록 */}
      <h2>답변</h2>
      {answers.length > 0 ? (
        <ul className="answer-list">
          {answers.map((answer) => (
            <li key={answer.id} className="answer-item">
              <p>{answer.content}</p>
              <p>작성일: {answer.createDate}</p>
              <button
                onClick={() => router.push(`/answers/${answer.id}/edit`)}
                className="edit-answer-button"
              >
                답변 수정
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>등록된 답변이 없습니다.</p>
      )}

      {/* 답변 작성 */}
      <form onSubmit={handleAnswerSubmit} className="answer-form">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="답변을 작성하세요"
          required
        ></textarea>
        <button type="submit">답변 등록</button>
      </form>
    </div>
  );
}
