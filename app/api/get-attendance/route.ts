import { NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/google-auth";

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!sheetId) {
      return NextResponse.json(
        { error: "Google Sheet ID가 누락되었습니다" },
        { status: 500 }
      );
    }

    // JWT 토큰으로 Google Sheets API 인증
    const accessToken = await getGoogleAccessToken();

    // 먼저 스프레드시트 정보를 가져와서 첫 번째 시트 이름 확인
    const metadataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!metadataResponse.ok) {
      throw new Error("스프레드시트 정보 조회 실패");
    }

    const metadata = await metadataResponse.json();
    const firstSheetName = metadata.sheets[0].properties.title;

    const range = `${firstSheetName}!A2:G1000`; // 헤더 제외하고 데이터만 가져오기 (G열까지 확장)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API 오류:", errorText);
      throw new Error(`Google Sheets API 오류: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    // 데이터 변환
    const attendance = rows.map((row: string[]) => ({
      timestamp: row[0] || "",
      name: row[1] || "",
      phone: row[2] || "",
      willAttend: row[3] === "참석",
      attendCount: parseInt(row[4]) || 0,
      deviceId: row[6] || "", // G열에서 device ID 가져오기
    }));

    // 캐시 방지 헤더와 함께 응답 반환
    return new NextResponse(
      JSON.stringify({
        success: true,
        attendance,
        total: attendance.length,
        timestamp: new Date().toISOString(), // 응답 시간 추가
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          ETag: `"${Date.now()}"`, // 동적 ETag 생성
        },
      }
    );
  } catch (error) {
    console.error("참석자 데이터 조회 실패:", error);
    return new NextResponse(
      JSON.stringify({ error: "데이터 조회에 실패했습니다" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
