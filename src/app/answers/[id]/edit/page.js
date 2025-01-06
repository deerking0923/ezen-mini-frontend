'use client';  // 클라이언트 컴포넌트 설정

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';  // URL 파라미터에서 id를 받기 위해
import './edit.css';  // 해당 CSS 파일 추가

export default function EditAnswerPage() {
  const { id } = useParams(); // URL에서 id를 가져옵니다.
  const [answer, setAnswer] = useState({ content: '' });
  const [question, setQuestion] = useState(null);  // 질문 정보 상태
  const router = useRouter();

  useEffect(() => {
    // 페이지 로드 시, 해당 ID의 질문과 답변 데이터를 가져옵니다.
    async function fetchQuestionData() {
      const res = await fetch(`http://43.202.10.10:8080/api/v1/questions/${id}`);
      if (!res.ok) {
        console.error('API 요청 실패');
        alert('데이터를 불러오는 데 실패했습니다.');
        return;
      }
      const data = await res.json();
      setQuestion(data.data);

      // answers 배열에서 현재 수정하려는 답변을 찾아서 설정
      const answerToEdit = data.data.answers.find(answer => answer.id === parseInt(id));
      setAnswer(answerToEdit || { content: '' });
    }
    fetchQuestionData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 수정된 답변 내용을 해당 질문 객체에 포함시켜 API로 요청
      const updatedQuestion = {
        ...question,
        answers: question.answers.map((ans) => 
          ans.id === answer.id ? { ...ans, content: answer.content } : ans
        ),
      };

      const res = await fetch(`http://43.202.10.10:8080/api/v1/questions/${question.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestion),
      });

      if (res.ok) {
        // 수정 후 해당 질문의 상세 페이지로 이동
        router.push(`/questions/${question.id}`);
      } else {
        alert('답변 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnswer({ ...answer, [name]: value });
  };

  if (!question) {
    return <div>로딩 중...</div>;  // 질문 데이터를 불러오는 중에는 로딩 메시지 표시
  }

  return (
    <div className="edit-container">
      <h1>답변 수정</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="content">답변 내용</label>
          <textarea
            id="content"
            name="content"
            rows="10"
            value={answer.content}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">수정하기</button>
      </form>
    </div>
  );
}
