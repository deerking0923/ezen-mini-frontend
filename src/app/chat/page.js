// src/app/chat/page.jsx
'use client';              // 이 파일도 클라이언트 컴포넌트임을 명시
import dynamic from 'next/dynamic';

const ChatbotNoSSR = dynamic(
  () => import('@/app/components/Chatbot'),
  { ssr: false }
);

export default function ChatPage() {
  return <ChatbotNoSSR />;
}
