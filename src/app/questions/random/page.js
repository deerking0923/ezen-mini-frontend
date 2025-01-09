'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './random.css';

export default function RandomPage() {
  const [randomSentence, setRandomSentence] = useState(null);
  const [loading, setLoading] = useState(true);

  // 랜덤 질문(문장) 가져오기
  const fetchRandomSentence = async () => {
    try {
      const response = await fetch('https://realdeerworld.com/api/v1/questions/random');
      const data = await response.json();
      
      if (data.success) {
        setRandomSentence(data.data);
      } else {
        console.error('Failed to fetch random sentence');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomSentence();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="random-page-background">
      {/* quote-container: 문장 + 버튼이 함께 아래쪽 */}
      <div className="quote-container">
        <div className="random-quote-box">
          <h2>오늘의 문장</h2>
          <p>
            {randomSentence.subject} {randomSentence.content}
          </p>
          <p style={{ fontStyle: 'italic', marginTop: '10px' }}>
            - {randomSentence.author}
          </p>
        </div>

        <Link href="/questions">
          <button className="random-back-button">돌아가기</button>
        </Link>
      </div>
    </div>
  );
}
