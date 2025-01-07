import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || ""; // 검색어 가져오기
  const apiKey = process.env.NEXT_PUBLIC_DICTIONARY_API_KEY; // 환경 변수에서 API 키 가져오기
  const certKeyNo = "7218"; // 인증 키 번호
  const API_URL = `https://stdict.korean.go.kr/api/search.do?certkey_no=${certKeyNo}&key=${apiKey}&type_search=search&req_type=json&q=${encodeURIComponent(
    query
  )}`;

  try {
    // 표준국어대사전 API 호출
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("사전 API 요청 실패");
    }

    const data = await response.json();
    return NextResponse.json(data); // JSON 응답 반환
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
