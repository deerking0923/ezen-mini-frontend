import { NextResponse } from "next/server";

export async function GET(req) {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Weather API 키
  const { searchParams } = new URL(req.url);
  const latitude = searchParams.get("lat"); // 위도
  const longitude = searchParams.get("lon"); // 경도

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "위도와 경도를 제공해야 합니다." },
      { status: 400 }
    );
  }

  const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&lang=ko`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("날씨 API 요청 실패");
    }

    const data = await response.json();
    return NextResponse.json(data); // JSON 응답 반환
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
