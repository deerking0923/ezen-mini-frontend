'use client'; // 클라이언트 컴포넌트 설정
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js 라우터 사용
import './create.css'; // 별도의 CSS 파일 추가

export default function CreateQuestionPage() {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    author: '',
  });
  const router = useRouter(); // 라우터 초기화

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://43.202.10.10:8080/api/v1/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json(); // 서버로부터 생성된 질문 데이터 받기
        const questionId = data.data.id; // 생성된 질문의 ID 가져오기
        //alert('글이 성공적으로 작성되었습니다!');
        router.push(`/questions/${questionId}`); // 상세 페이지로 이동
      } else {
        alert('글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="create-container">
      <h1>글 작성하기</h1>
      <form onSubmit={handleSubmit} className="create-form">
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
          ></textarea>
        </div>

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

        <button type="submit" className="btn btn-primary">
          저장하기
        </button>
      </form>
    </div>
  );
}
