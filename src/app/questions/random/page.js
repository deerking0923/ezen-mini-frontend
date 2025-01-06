'use client'; // 클라이언트 전용 컴포넌트임을 명시

import { useEffect, useState } from 'react';
import './random.css';

const RandomQuestion = () => {
  const [question, setQuestion] = useState(null);

  // API에서 랜덤 질문을 받아오는 함수
  const fetchRandomQuestion = async () => {
    try {
      const response = await fetch('http://43.202.10.10:8080/api/v1/questions/random');
      const data = await response.json();

      if (data.success) {
        setQuestion(data.data); // 응답 받은 데이터를 상태에 저장
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

  if (!question) {
    return <div>Loading...</div>; // 데이터가 로딩 중일 때
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>오늘의 문장</h2>
      <p>{question.subject} {question.content}</p>
      <p style={{ fontStyle: 'italic' }}>- {question.author}</p>
    </div>
  );
};

export default RandomQuestion;
