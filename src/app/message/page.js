'use client'; // React 클라이언트 컴포넌트로 설정

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Next.js 라우터 사용
//import './message.css'; // CSS 파일 가져오기


export default function MessagePage() {
  const router = useRouter(); // Next.js 라우터
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [input, setInput] = useState(""); // 메시지 입력 필드 값
  const [username, setUsername] = useState(""); // 사용자 이름 입력 필드 값
  const [isUsernameSet, setIsUsernameSet] = useState(false); // 사용자 이름 설정 여부
  const [loading, setLoading] = useState(true); // 로딩 상태
  const chatBoxRef = useRef(null); // 채팅 박스 참조

  const MAX_MESSAGES = 300; // 최대 메시지 개수 제한

  // 메시지 목록을 API로부터 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://realdeerworld.com/api/v1/messages");
        const data = await response.json();

        if (data.success) {
          setMessages(data.data.slice(-MAX_MESSAGES)); // 최신 10개의 메시지만 유지
        }
      } catch (error) {
        console.error("메시지 불러오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // 메시지 추가 시 맨 아래로 스크롤
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || !username.trim()) {
      alert("사용자 이름과 메시지를 입력하세요.");
      return;
    }

    const newMessage = {
      username,
      content: input,
    };

    try {
      // 메시지 생성 API 호출
      const response = await fetch("https://realdeerworld.com/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages((prev) => {
          const updatedMessages = [...prev, data.data];
          if (updatedMessages.length > MAX_MESSAGES) {
            updatedMessages.shift(); // 오래된 메시지 제거
          }
          return updatedMessages;
        });
        setInput(""); // 입력 필드 초기화
      } else {
        console.error("메시지 전송 실패:", data.error || "알 수 없는 오류");
      }
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    }
  };

  const setUsernameHandler = () => {
    if (username.trim()) {
      setIsUsernameSet(true); // 사용자 이름 설정 완료
    } else {
      alert("사용자 이름을 입력하세요.");
    }
  };

  // 메시지 렌더링
  const renderMessages = () => {
    if (loading) {
      return <p>로딩 중...</p>;
    }

    if (messages.length === 0) {
      return <p>메시지가 없습니다.</p>;
    }

    return messages.map((msg) => (
      <div key={msg.id} style={{ marginBottom: "10px" }}>
        <strong>{msg.username}</strong>: {msg.content}
        <div style={{ fontSize: "0.8rem", color: "gray" }}>
          {msg.timestamp}
        </div>
      </div>
    ));
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <button
        onClick={() => router.push("/questions")}
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        돌아가기
      </button>

      <h1>실시간 채팅방</h1>

      {!isUsernameSet ? (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자 이름을 입력하세요"
            style={{ width: "80%", marginRight: "10px", padding: "5px" }}
          />
          <button onClick={setUsernameHandler} style={{ padding: "5px 10px" }}>
            이름 설정
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: "10px" }}>
            <strong>현재 사용자:</strong> {username}
          </p>

          <div
            ref={chatBoxRef} // chatBoxRef로 스크롤 제어
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {renderMessages()}
          </div>

          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요"
              style={{
                flex: "1",
                marginRight: "10px",
                padding: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
