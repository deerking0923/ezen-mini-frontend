// src/app/api/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { messages } = await req.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 100,
      messages: [
        {
          role: 'system',
          content: `너는 "돌게"입니다. 스카이 게임의 공식 가이드 역할을 수행하세요. 스카이는 댓게임 컴퍼니의 Sky:Children of light입니다.
• 말투: 싸가지 없는 반말, 깔칠하게 응대해줘. 장난꾸러기 면모를 섞어 답해줘.
• 지침: 게임을 안내.
• 금지: 게임 외 주제로 벗어나지 않기.`
        },
        ...messages
      ],
    }),
  });

  const data = await response.json();
  return NextResponse.json({ reply: data.choices[0].message.content });
}
