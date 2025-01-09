'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './questions.css';

export default function MyLayoutPage() {
  const router = useRouter();

  // 게시글(질문) 목록 상태
  const [postList, setPostList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // 날씨 상태
  const [climate, setClimate] = useState(null);
  const [climateLoading, setClimateLoading] = useState(false);
  const [climateError, setClimateError] = useState(null);

  // 사전 검색 상태
  const [dicSearchTerm, setDicSearchTerm] = useState('');
  const [dicResults, setDicResults] = useState(null);
  const [dicError, setDicError] = useState(null);

  // 게시글 목록 불러오기
  useEffect(() => {
    async function fetchPostList() {
      setLoadingPosts(true);
      try {
        const res = await fetch(
          `https://realdeerworld.com/api/v1/questions?page=${currentPage}`
        );
        const data = await res.json();
        setPostList(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error);
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchPostList();
  }, [currentPage]);

  // 페이지네이션 버튼
  const renderPageButtons = () => {
    const pageNumbers = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // 페이지 이동 핸들러
  const goPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const goFirstPage = () => {
    setCurrentPage(0);
  };
  const goLastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  // 사용자 위치 기반 날씨
  useEffect(() => {
    async function fetchClimate() {
      setClimateLoading(true);
      try {
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

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

        const { latitude, longitude } = await getLocation();

        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&lang=ko`
        );
        if (!res.ok) throw new Error('날씨 데이터를 가져오는 데 실패했습니다.');
        const data = await res.json();
        setClimate(data);
      } catch (error) {
        console.error('날씨 데이터 오류:', error);
        setClimateError(error.message);
      } finally {
        setClimateLoading(false);
      }
    }
    fetchClimate();
  }, []);

  // 국어사전 검색
  const searchKoreanDictionary = async () => {
    setDicResults(null);
    setDicError(null);
    try {
      const res = await fetch(`/api/dictionary?q=${encodeURIComponent(dicSearchTerm)}`);
      if (!res.ok) {
        throw new Error('검색 결과를 찾을 수 없습니다.');
      }
      const data = await res.json();
      setDicResults(data.channel?.item || []);
    } catch (err) {
      setDicError(err.message);
    }
  };

  return (
    <div className="container">
      {/* 왼쪽 섹션: 오늘의 문장 */}
      <div className="left-section">
        <div className="go-to-random-container">
          <img
            src="/lucky_rabbit.webp"
            alt="오늘의 문장 이미지"
            className="go-to-random-image"
          />
          <button
            className="go-to-random"
            onClick={() => router.push('/questions/random')}
          >
            오늘의 문장!
          </button>
        </div>
      </div>

      
      {/* 중앙(메인) 섹션 */}
      <div className="main-content">
        <h1>글 목록</h1>
        {loadingPosts && <p>로딩 중...</p>}

        <table className="questions-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>제목</th>
      <th>
        <img src="/eye.svg" alt="조회 아이콘" className="view-icon" />
      </th>
    </tr>
  </thead>
  <tbody>
    {postList.map((post) => (
      <tr key={post.id}>
        <td>{post.id}</td>
        <td className="title-cell">
          <div
            className="clickable-title"
            onClick={() => router.push(`/questions/${post.id}`)}
          >
            {post.subject}
          </div>
          <div className="meta-info">
            {post.author || '미작성'} | {post.createDate || '미정'}
          </div>
        </td>
        <td>{post.viewCount || 0}</td>
      </tr>
    ))}
  </tbody>
</table>



        {/* 하단 영역: 글쓰기 버튼 + 페이지네이션 */}
        <div className="footer-actions">
          <button
            className="create-question-button"
            onClick={() => router.push('/questions/create')}
          >
            글 쓰기
          </button>

          {/* 페이지네이션 */}
          <div className="pagination">
            <button onClick={goFirstPage} disabled={currentPage === 0}>
              &lt;&lt;
            </button>
            {renderPageButtons().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goPageChange(pageNumber)}
                className={pageNumber === currentPage ? 'active' : ''}
                disabled={pageNumber === currentPage}
              >
                {pageNumber + 1}
              </button>
            ))}
            <button onClick={goLastPage} disabled={currentPage === totalPages - 1}>
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>


      {/* 오른쪽 섹션: 날씨, 국어사전 */}
      <div className="right-section">
        {/* 날씨 */}
        <div className="weather-widget">
          <h2>현재 날씨</h2>
          {climateLoading ? (
            <p>날씨 정보를 가져오는 중...</p>
          ) : climateError ? (
            <p>오류: {climateError}</p>
          ) : climate ? (
            <div>
              <img
                src={`https:${climate.current.condition.icon}`}
                alt={climate.current.condition.text}
                className="weather-icon"
              />
              <p>위치: {climate.location.name}</p>
              <p>온도: {climate.current.temp_c}°C</p>
              <p>날씨 상태: {climate.current.condition.text}</p>
            </div>
          ) : (
            <p>날씨 정보를 가져올 수 없습니다.</p>
          )}
        </div>

        {/* 국어사전 */}
        <div className="dictionary-widget">
          <h2>국어사전 검색</h2>
          <input
            type="text"
            value={dicSearchTerm}
            onChange={(e) => setDicSearchTerm(e.target.value)}
            placeholder="검색어 입력"
          />
          <button onClick={searchKoreanDictionary}>검색</button>

          {dicError && <p className="error">{dicError}</p>}
          {dicResults && (
            <ul className="dictionary-results">
              {dicResults.map((item, index) => (
                <li key={index}>
                  {item.sense.definition}
                </li>
              ))}
            </ul>
          )}
          <p className="source">국립국어원 표준국어대사전</p>
        </div>
      </div>
    </div>
  );
}
