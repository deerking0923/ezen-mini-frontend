'use client'; // 클라이언트 컴포넌트
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import './detail.css'; // 새 CSS 파일

export default function QuestionDetailPage({ params }) {
  const router = useRouter();

  // 상태들
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  
  const [id, setId] = useState(null);
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // params에서 id 파싱
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // 질문 데이터 + 답변 가져오기
  useEffect(() => {
    if (!id) return;
    async function fetchQuestionData() {
      try {
        const res = await fetch(`https://realdeerworld.com/api/v1/questions/${id}`);
        if (!res.ok) throw new Error('데이터를 가져오는 데 실패했습니다.');
        const data = await res.json();
        setQuestion(data.data);
        setAnswers(data.data.answers || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchQuestionData();
  }, [id]);

  // 수정 모달에서 “확인” 클릭 시 비번 체크 → 수정 페이지 이동
  const handleEditQuestion = async () => {
    try {
      const res = await fetch(`https://realdeerworld.com/api/v1/questions/${id}/check-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.status === 404) {
        alert('해당 질문을 찾을 수 없습니다.');
        return;
      }
      if (!res.ok) {
        alert('서버 오류가 발생했습니다.');
        return;
      }

      const data = await res.json();

      if (!data.success || !data.data) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      // 비밀번호 통과 → 수정 페이지로 이동
      router.push(`/questions/${id}/edit`);
    } catch (error) {
      alert('비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsPasswordModalOpen(false);
      setPassword('');
    }
  };

  // 삭제 모달에서 “확인” 클릭 시 비번 체크 → 삭제
  const handleDeleteQuestion = async () => {
    try {
      const res = await fetch(`https://realdeerworld.com/api/v1/questions/${id}/check-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.status === 404) {
        alert('해당 질문을 찾을 수 없습니다.');
        return;
      }
      if (!res.ok) {
        alert('서버 오류가 발생했습니다.');
        return;
      }

      const data = await res.json();
      if (!data.success || !data.data) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      // 비밀번호 통과 → 삭제 요청
      const deleteRes = await fetch(`https://realdeerworld.com/v1/questions/${id}`, {
        method: 'DELETE',
      });
      if (!deleteRes.ok) {
        alert('삭제에 실패했습니다.');
        return;
      }

      alert('질문이 삭제되었습니다.');
      router.push('/questions'); 
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsPasswordModalOpen(false);
      setPassword('');
    }
  };

  // 모달 열기
  const openPasswordModal = (isDelete) => {
    setIsDeleteMode(isDelete);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPassword('');
    setIsDeleteMode(false);
  };

  // 답변 등록
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://realdeerworld.com/api/v1/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newAnswer,
          questionId: id,
        }),
      });
      if (!res.ok) throw new Error('답변 등록에 실패했습니다.');

      setNewAnswer(''); // 입력 필드 초기화
      window.location.reload(); // 새로고침
    } catch (error) {
      alert(error.message);
    }
  };

  if (!question) return <p>로딩 중...</p>;

  return (
    <div className="detail-wrapper">
      <h1 className="detail-title">{question.subject}</h1>
      <div className="detail-meta">
        <p>저자: {question.author || '익명'}</p>
        <p>조회수: {question.viewCount}</p>
        <p>작성일: {question.createDate}</p>
      </div>
      <div className="detail-content">
        <p>{question.content}</p>
      </div>

      {/* 수정 & 삭제 버튼 */}
      <div className="detail-button-group">
        <button
          className="detail-edit-button"
          onClick={() => openPasswordModal(false)}
        >
          글 수정
        </button>
        <button
          className="detail-delete-button"
          onClick={() => openPasswordModal(true)}
        >
          글 삭제
        </button>
      </div>

      {/* 비밀번호 모달 */}
      {isPasswordModalOpen && (
        <div className="detail-password-modal">
          <div className="modal-content">
            <h3>비밀번호 확인</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
            />
            <div className="modal-actions">
              {isDeleteMode ? (
                <button onClick={handleDeleteQuestion}>삭제</button>
              ) : (
                <button onClick={handleEditQuestion}>확인</button>
              )}
              <button onClick={closePasswordModal}>취소</button>
            </div>
          </div>
        </div>
      )}

      <hr className="detail-divider" />

      {/* 답변 목록 */}
      <h2 className="detail-answers-title">답변</h2>
      {answers.length > 0 ? (
        <ul className="detail-answer-list">
          {answers.map((ans) => (
            <li key={ans.id} className="detail-answer-item">
              <p>{ans.content}</p>
              <p className="detail-answer-date">작성일: {ans.createDate}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>등록된 답변이 없습니다.</p>
      )}

      {/* 답변 작성 폼 */}
      <form onSubmit={handleAnswerSubmit} className="detail-answer-form">
        <textarea
          className="detail-answer-input"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="답변을 작성하세요"
          required
        />
        <button type="submit" className="detail-answer-submit">
          답변 등록
        </button>
      </form>
    </div>
  );
}
