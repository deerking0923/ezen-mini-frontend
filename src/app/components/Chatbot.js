'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';

// 초기 인사 메시지
const initialBotMessage = {
  role: 'assistant',
  content: '안녕? 궁금한 게 뭔데? 알려줄 수 있으면 알려줄게 ㅋ',
  time: new Date(),
};

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();

  // 인사 메시지
  useEffect(() => {
    setMessages([initialBotMessage]);
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input, time: new Date() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');

    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    const botMsg = { role: 'assistant', content: data.reply, time: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const formatTime = date =>
    `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.header}>
        <img
          src="/sky/extra/profile.png"
          alt="돌게 프로필"
          className={styles.profileIcon}
        />
        <span className={styles.title}>돌게</span>
      </div>

      <div className={styles.chatBox} ref={boxRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === 'user'
                ? styles.userBubbleWrapper
                : styles.botBubbleWrapper
            }
          >
            {msg.role === 'assistant' && (
              <img
                src="/sky/extra/profile.png"
                alt=""
                className={styles.bubbleIcon}
              />
            )}
            <div
              className={
                msg.role === 'user' ? styles.userBubble : styles.botBubble
              }
            >
              {msg.content}
              <span className={styles.timestamp}>
                {formatTime(msg.time)}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className={styles.typingWrapper}>
            <img
              src="/sky/extra/profile.png"
              alt="타이핑 중"
              className={styles.bubbleIcon}
            />
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>
          <img src="/sky/extra/send.png" alt="전송" />
        </button>
      </div>
    </div>
  );
}
