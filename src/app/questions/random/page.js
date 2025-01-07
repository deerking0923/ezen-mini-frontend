'use client'; // 클라이언트 전용 컴포넌트임을 명시

import { useEffect, useState } from 'react';
import './random.css';
import Link from 'next/link'; // 돌아가기 버튼에 링크 추가

const RandomQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태

  // API에서 랜덤 질문을 받아오는 함수
  const fetchRandomQuestion = async () => {
    try {
      const response = await fetch('https://realdeerworld.com/api/v1/questions/random');
      const data = await response.json();

      if (data.success) {
        setQuestion(data.data); // 응답 받은 데이터를 상태에 저장
        setLoading(false); // 로딩 종료
      } else {
        console.error('Failed to fetch random question');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 페이지가 처음 로드될 때 API 호출
  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 데이터가 로딩 중일 때
  }

  return (
    <div className="page-background">
      {/* 랜덤 문장 */}
      <div className="random-quote">
        <h2>오늘의 문장</h2>
        <p>{question.subject} {question.content}</p>
        <p style={{ fontStyle: 'italic' }}>- {question.author}</p>
      </div>

      {/* 돌아가기 버튼 */}
      <Link href="/questions">
        <button className="back-button">
          돌아가기
        </button>
      </Link>
    </div>
  );
};

export default RandomQuestion;
