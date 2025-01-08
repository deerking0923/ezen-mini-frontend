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

  const [dictionaryQuery, setDictionaryQuery] = useState(''); // 국어사전 검색어
  const [dictionaryResults, setDictionaryResults] = useState(null); // 국어사전 결과
  const [dictionaryError, setDictionaryError] = useState(null); // 국어사전 에러 상태


  // 질문 데이터 가져오기
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await fetch(`https://realdeerworld.com/api/v1/questions?page=${currentPage}`);
        const data = await res.json();
        setQuestions(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error('질문을 가져오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [currentPage]);

  // 페이지네이션 버튼 생성
  const generatePageButtons = () => {
    const pageNumbers = [];
    const startPage = Math.max(0, currentPage - 2); // 현재 페이지 기준 앞 2개
    const endPage = Math.min(totalPages - 1, currentPage + 2); // 현재 페이지 기준 뒤 2개

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 페이지네이션 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages - 1);
  };
  // 사용자 위치 기반 날씨 데이터 가져오기
  useEffect(() => {
    async function fetchWeather() {
      setWeatherLoading(true); // 로딩 시작
      try {
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // 발급받은 Weather API 키

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

  // 국어사전 검색 함수
  const searchDictionary = async () => {
    setDictionaryResults(null); // 이전 결과 초기화
    setDictionaryError(null); // 이전 에러 초기화
    try {
      const res = await fetch(`/api/dictionary?q=${encodeURIComponent(dictionaryQuery)}`);
      if (!res.ok) {
        throw new Error('검색 결과를 찾을 수 없습니다.');
      }
      const data = await res.json();
      setDictionaryResults(data.channel?.item || []);
    } catch (err) {
      setDictionaryError(err.message);
    }
  };

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

        <div className="dictionary-widget">
          <h2>국어사전 검색</h2>
          <input
            type="text"
            value={dictionaryQuery}
            onChange={(e) => setDictionaryQuery(e.target.value)}
            placeholder="검색어 입력"
          />
          <button onClick={searchDictionary}>검색</button>
          {dictionaryError && <p className="error">{dictionaryError}</p>}
          {dictionaryResults && (
            <ul className="dictionary-results" style={{ counterReset: 'item' }}>
              {dictionaryResults.map((item, index) => (
                <li key={index}>
                  {item.sense.definition}
                </li>
              ))}
            </ul>
          )}
          <p className="source">국립국어원 표준국어대사전</p>
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
                  </td>
                  <td>{question.author || '미작성'}</td>
                  <td>{question.viewCount || 0}</td>
                  <td>{question.createDate || '미정'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="pagination">
            {/* 맨 처음 페이지 */}
            <button onClick={handleFirstPage} disabled={currentPage === 0}>
              &lt;&lt;
            </button>

            {/* 페이지 번호 */}
            {generatePageButtons().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={pageNumber === currentPage ? 'active' : ''}
                disabled={pageNumber === currentPage}
              >
                {pageNumber + 1}
              </button>
            ))}

            {/* 맨 마지막 페이지 */}
            <button onClick={handleLastPage} disabled={currentPage === totalPages - 1}>
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
