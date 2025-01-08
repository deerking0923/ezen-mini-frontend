'use client'; // React 클라이언트 컴포넌트로 설정

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import './message.css'; // 분리된 CSS 파일 가져오기

export default function MessagePage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatBoxRef = useRef(null);

  const MAX_MESSAGES = 300;

  // 메시지 목록을 API로부터 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://realdeerworld.com/api/v1/messages");
        const data = await response.json();

        if (data.success) {
          setMessages(data.data.slice(-MAX_MESSAGES));
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
            updatedMessages.shift();
          }
          return updatedMessages;
        });
        setInput("");
      } else {
        console.error("메시지 전송 실패:", data.error || "알 수 없는 오류");
      }
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    }
  };

  const setUsernameHandler = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
    } else {
      alert("사용자 이름을 입력하세요.");
    }
  };

  const renderMessages = () => {
    if (loading) {
      return <p>로딩 중...</p>;
    }

    if (messages.length === 0) {
      return <p>메시지가 없습니다.</p>;
    }

    return messages.map((msg) => (
      <div key={msg.id} className="message">
        <strong>{msg.username}</strong>: {msg.content}
        <div className="timestamp">
          {msg.timestamp}
        </div>
      </div>
    ));
  };

  return (
    <div className="container">
      <button
        onClick={() => router.push("/questions")}
        className="back-button"
      >
        돌아가기
      </button>

      <h1>탕수육은 찍먹 VS 부먹</h1>

      {!isUsernameSet ? (
        <div className="username-section">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자 이름을 입력하세요"
            className="username-input"
          />
          <button onClick={setUsernameHandler} className="username-button">
            이름 설정
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>현재 사용자:</strong> {username}
          </p>

          <div
            ref={chatBoxRef}
            className="chat-box"
          >
            {renderMessages()}
          </div>

          <div className="message-input-section">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요"
              className="message-input"
            />
            <button onClick={sendMessage} className="send-button">
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
