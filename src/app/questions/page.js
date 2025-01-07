'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './questions.css';

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]); // 질문 목록 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [weather, setWeather] = useState(null); // 날씨 상태
  const [weatherLoading, setWeatherLoading] = useState(false); // 날씨 로딩 상태
  const [weatherError, setWeatherError] = useState(null); // 날씨 에러 상태

  // 질문 데이터 가져오기
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true); // 로딩 시작
      try {
        const res = await fetch(`https://realdeerworld.com/api/v1/questions?page=${currentPage}`);
        const data = await res.json();
        setQuestions(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error('질문을 가져오는 데 실패했습니다.', error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    }

    fetchQuestions();
  }, [currentPage]);

  // 사용자 위치 기반 날씨 데이터 가져오기
  useEffect(() => {
    async function fetchWeather() {
      setWeatherLoading(true); // 로딩 시작
      try {
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // 발급받은 Weather API 키

        // 사용자 위치 가져오기
        const getLocation = () =>
          new Promise((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });
                },
                (error) => reject(error)
              );
            } else {
              reject(new Error('Geolocation is not supported by this browser.'));
            }
          });

        const location = await getLocation();
        const { latitude, longitude } = location;

        // Weather API 호출 (lang=ko로 한국어 설정 추가)
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&lang=ko`
        );
        if (!res.ok) throw new Error('날씨 데이터를 가져오는 데 실패했습니다.');
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error('날씨 데이터를 가져오는 중 오류 발생:', error);
        setWeatherError(error.message);
      } finally {
        setWeatherLoading(false); // 로딩 종료
      }
    }

    fetchWeather();
  }, []);

  // 5개씩 페이지 번호 표시 기능
  const getPageRange = () => {
    let startPage = Math.max(currentPage - 2, 0); // 현재 페이지 기준 2개 이전 페이지
    let endPage = Math.min(startPage + 5, totalPages); // 현재 페이지 기준 2개 이후 페이지 포함

    // startPage가 0일 경우, 최소 5페이지를 표시하도록 하기 위해 endPage를 조정
    if (startPage === 0 && totalPages >= 5) {
      endPage = 5;
    }

    return Array.from({ length: endPage - startPage }, (_, index) => startPage + index);
  };

  // 페이지 번호 클릭 시 이동
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 이전 5페이지 버튼
  const handlePrev5Pages = () => {
    if (currentPage >= 5) {
      setCurrentPage((prev) => prev - 5);
    } else {
      setCurrentPage(0); // 최소 0 페이지로 제한
    }
  };

  // 다음 5페이지 버튼
  const handleNext5Pages = () => {
    if (currentPage + 5 < totalPages) {
      setCurrentPage((prev) => prev + 5);
    } else {
      setCurrentPage(totalPages - 1); // 마지막 페이지로 이동
    }
  };

  // 로딩 상태 표시
  if (loading) return <p>로딩 중...</p>;

  const pageNumbers = getPageRange();

  return (
    <div className="container">
      <div className="top-section">
        {/* 날씨 정보 */}
        <div className="weather-widget">
          <h2>현재 날씨</h2>
          {weatherLoading ? (
            <p>날씨 정보를 가져오는 중...</p>
          ) : weatherError ? (
            <p>오류: {weatherError}</p>
          ) : weather ? (
            <div>
              <img
                src={`https:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
                className="weather-icon"
              />
              <p>위치: {weather.location.name}</p>
              <p>온도: {weather.current.temp_c}°C</p>
              <p>날씨 상태: {weather.current.condition.text}</p>
            </div>
          ) : (
            <p>날씨 정보를 가져올 수 없습니다.</p>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="go-to-random-container">
            <img src="/lucky_rabbit.webp" alt="오늘의 문장 이미지" className="go-to-random-image" />
            <button className="go-to-random" onClick={() => router.push('/questions/random')}>
              오늘의 문장!
            </button>
          </div>
        </div>

        <div className="right-section">
          <h1>글 목록</h1>

          {/* 질문 목록 테이블 */}
          <table className="questions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>저자</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td
                    className="clickable-title"
                    onClick={() => router.push(`/questions/${question.id}`)}
                  >
                    {question.subject}
                    <span className="answer-count">
                      ({question.answers ? question.answers.length : 0})
                    </span>
                  </td>
                  <td>{question.author || '미작성'}</td>
                  <td>{question.viewCount || 0}</td>
                  <td>{question.createDate || '미정'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 버튼 */}
          <div className="pagination">
            <button onClick={handlePrev5Pages} disabled={currentPage === 0}>
              &lt;&lt;
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={pageNumber === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(pageNumber)}
                disabled={pageNumber === currentPage}
              >
                {pageNumber + 1}
              </button>
            ))}
            <button onClick={handleNext5Pages} disabled={currentPage + 1 >= totalPages}>
              &gt;&gt;
            </button>
          </div>

          <div className="create-button-container">
            <button className="create-button" onClick={() => router.push('/questions/create')}>
              글 작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
