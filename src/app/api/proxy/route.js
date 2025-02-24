// app/api/proxy/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const targetUrl = 'https://korea-sky-planner.com/api/v1/upload';
  const body = await req.arrayBuffer();

  // 클라이언트의 헤더를 그대로 복사하되, host 헤더는 제거합니다.
  const headers = new Headers(req.headers);
  headers.delete('host');

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  // 외부 API의 응답을 그대로 전달합니다.
  const resBody = await response.arrayBuffer();
  return new NextResponse(resBody, {
    status: response.status,
    headers: response.headers,
  });
}

export async function GET(req) {
  return NextResponse.json({ message: "POST 요청만 지원합니다." }, { status: 405 });
}
