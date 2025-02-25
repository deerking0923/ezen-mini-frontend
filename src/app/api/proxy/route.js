// app/api/proxy/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const targetUrl = 'https://korea-sky-planner.com/api/v1/upload';
  const body = await req.arrayBuffer();

  // 클라이언트의 헤더를 복사하되, host 헤더는 제거합니다.
  const headers = new Headers(req.headers);
  headers.delete('host');

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  // 외부 API의 응답을 그대로 전달합니다.
  const resBody = await response.arrayBuffer();

  // 응답 헤더에 CORS 허용 헤더 추가
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  
  return new NextResponse(resBody, {
    status: response.status,
    headers: newHeaders,
  });
}

export async function GET(req) {
  return NextResponse.json({ message: "POST 요청만 지원합니다." }, { status: 405 });
}
