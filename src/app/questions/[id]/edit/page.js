'use client'; // 클라이언트 컴포넌트 설정
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.js 라우터 사용
import { useParams } from 'next/navigation'; // URL 파라미터에서 ID를 받기 위해
import '../../create/create.css'; // 별도의 CSS 파일 추가

export default function EditQuestionPage() {
  const { id } = useParams(); // URL에서 ID 받아오기
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    author: '',
  });
  const router = useRouter(); // 라우터 초기화

  // 질문 데이터를 로드하는 useEffect
  useEffect(() => {
    async function fetchQuestion() {
      const response = await fetch(`https://realdeerworld.com/api/v1/questions/${id}`);
      const data = await response.json();
      setFormData({
        subject: data.data.subject,
        content: data.data.content,
        author: data.data.author || '',
      });
    }

    fetchQuestion();
  }, [id]);

  // 입력 필드 값 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://realdeerworld.com/api/v1/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json(); // 서버로부터 수정된 질문 데이터 받기
        //alert('수정이 성공적으로 완료되었습니다!');
        router.push(`/questions/${data.data.id}`); // 수정된 질문의 상세 페이지로 이동
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="create-container">
      <h1>질문 수정</h1>
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
          수정하기
        </button>
      </form>
    </div>
  );
}
