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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 모달 상태
  const [password, setPassword] = useState(''); // 입력된 비밀번호 상태
  const [isDeleteMode, setIsDeleteMode] = useState(false); // 삭제 모드 상태 추가

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
          const res = await fetch(`https://realdeerworld.com/api/v1/questions/${id}`);
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

  // 수정 버튼 클릭 시 비밀번호 확인
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
        alert('서버에 문제가 발생했습니다.');
        return;
      }

      const data = await res.json();

      if (!data.success || !data.data) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      // 비밀번호가 일치하면 수정 페이지로 이동
      router.push(`/questions/${id}/edit`);
    } catch (error) {
      alert('비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsPasswordModalOpen(false);
      setPassword('');
    }
  };

  // 삭제 버튼 클릭 시 비밀번호 확인 후 삭제
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
        alert('서버에 문제가 발생했습니다.');
        return;
      }

      const data = await res.json();

      if (!data.success || !data.data) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      // 비밀번호가 일치하면 삭제 요청
      const deleteRes = await fetch(`https://realdeerworld.com/v1/questions/${id}`, {
        method: 'DELETE',
      });

      if (!deleteRes.ok) {
        alert('삭제에 실패했습니다.');
        return;
      }

      alert('질문이 삭제되었습니다.');
      router.push('/questions'); // 삭제 후 목록 페이지로 이동
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsPasswordModalOpen(false);
      setPassword('');
    }
  };

  // 모달 열기 (수정/삭제 구분)
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

      // 페이지 강제 새로고침
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  // 로딩 상태 처리
  if (!question) return <p>로딩 중...</p>;

  return (
    <div className="detail-container">
      <h1>{question.subject}</h1>
      <p>저자: {question.author || '익명'}</p>
      <p>조회수: {question.viewCount}</p>
      <p>작성일: {question.createDate}</p>
      <div className="content">{question.content}</div>

      {/* 수정 및 삭제 버튼 */}
      <div className="button-group">
        <button className="edit-button" onClick={() => openPasswordModal(false)}>
          글 수정
        </button>
        <button className="delete-button" onClick={() => openPasswordModal(true)}>
          글 삭제
        </button>
      </div>

      {/* 비밀번호 입력 모달 */}
      {isPasswordModalOpen && (
        <div className="password-modal">
          <div className="modal-content">
            <h3>비밀번호 확인</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
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

      <hr />

      {/* 답변 목록 */}
      <h2>답변</h2>
      {answers.length > 0 ? (
        <ul className="answer-list">
          {answers.map((answer) => (
            <li key={answer.id} className="answer-item">
              <p>{answer.content}</p>
              <p>작성일: {answer.createDate}</p>
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
