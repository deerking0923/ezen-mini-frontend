'use client'; // 클라이언트 컴포넌트
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './edit.css'; // 새 CSS 파일

export default function QuestionEditPage() {
  const { id } = useParams(); // URL 파라미터
  const router = useRouter();

  // 폼 데이터 (제목, 내용, 작성자)
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    author: '',
  });

  // 초기 데이터 로드
  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await fetch(`https://realdeerworld.com/api/v1/questions/${id}`);
        if (!response.ok) throw new Error('질문 데이터를 불러오지 못했습니다.');
        const data = await response.json();
        setFormData({
          subject: data.data.subject || '',
          content: data.data.content || '',
          author: data.data.author || '',
        });
      } catch (error) {
        console.error(error);
        alert('질문을 불러오는 중 오류가 발생했습니다.');
      }
    }
    fetchQuestion();
  }, [id]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://realdeerworld.com/api/v1/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        alert('수정에 실패했습니다.');
        return;
      }

      const data = await response.json();
      // 수정된 질문 상세 페이지로 이동
      router.push(`/questions/${data.data.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="edit-wrapper">
      <h1 className="edit-title">질문 수정</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        {/* 제목 */}
        <div className="form-group">
          <label htmlFor="subject">제목</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        {/* 내용 */}
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        {/* 작성자 */}
        <div className="form-group">
          <label htmlFor="author">작성자</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <button type="submit" className="edit-submit-button">
          수정하기
        </button>
      </form>
    </div>
  );
}
