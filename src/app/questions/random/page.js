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
      const response = await fetch('http://43.202.10.10:8080/api/v1/questions/random');
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        {/* 수상 소감을 담을 반투명 컨테이너 */}
        <div className="award-container">
          <div className="award-messager">
            <p>
              "어렸을 때부터 저는 알고 싶었습니다. 우리가 태어난 이유. 고통과 사랑이 존재하는 이유. 이러한 질문은 수천 년 동안 문학이 던져온 질문이며, 오늘날에도 계속되고 있습니다.
            </p>
            <p>
              우리가 이 세상에 잠시 머무는 것의 의미는 무엇일까요? 무슨 일이 있어도 인간으로 남는다는 것은 얼마나 어려운 일일까요?
            </p>
            <p>
              가장 어두운 밤, 우리가 무엇으로 이루어져 있는지 묻는 언어, 이 지구에 사는 사람들과 생명체의 일인칭 시점으로 상상하는 언어,
            </p>
            <p>
              우리를 서로 연결해주는 언어가 있습니다. 이러한 언어를 다루는 문학은 필연적으로 일종의 체온을 지니고 있습니다.
            </p>
            <p>
              필연적으로 문학을 읽고 쓰는 작업은 생명을 파괴하는 모든 행위에 반대되는 위치에 서 있습니다."
            </p>
            <p>한강, 노벨 문학상 수상 소감 중</p>
          </div>
        </div>

        <br/>
        <br/>

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
    </div>
  );
};

export default RandomQuestion;
