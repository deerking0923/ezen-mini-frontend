'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './create.css'; // 새 CSS 파일

export default function CreateQuestionPage() {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    author: '',
    password: '',
  });
  const router = useRouter();

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 전송
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://realdeerworld.com/api/v1/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert('글 작성에 실패했습니다.');
        return;
      }

      const data = await response.json();
      const questionId = data.data.id; // 생성된 질문의 ID
      router.push(`/questions/${questionId}`); // 새 글 상세페이지로 이동
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="create-wrapper">
      <h1 className="create-title">글 작성하기</h1>

      <form onSubmit={handleSubmit} className="create-form">
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
            rows="8"
            value={formData.content}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        {/* 작성자 & 비밀번호 */}
        <div className="form-inline-row">
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

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          저장하기
        </button>
      </form>
    </div>
  );
}
