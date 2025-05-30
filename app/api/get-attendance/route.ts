import { NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/google-auth";

export async function GET() {
  try {
    console.log("=== API 호출 시작 ===");
    const sheetId = process.env.GOOGLE_SHEET_ID;
    console.log("Sheet ID:", sheetId ? "존재함" : "누락됨");

    if (!sheetId) {
      console.error("Google Sheet ID가 누락되었습니다");
      return new NextResponse(
        JSON.stringify({ error: "Google Sheet ID가 누락되었습니다" }),
        { status: 500 }
      );
    }

    console.log("Google 액세스 토큰 요청 중...");
    // JWT 토큰으로 Google Sheets API 인증
    const accessToken = await getGoogleAccessToken();
    console.log("액세스 토큰 획득 성공");

    console.log("스프레드시트 메타데이터 요청 중...");
    // 먼저 스프레드시트 정보를 가져와서 첫 번째 시트 이름 확인
    const metadataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?timestamp=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    console.log("메타데이터 응답 상태:", metadataResponse.status);
    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error("메타데이터 응답 오류:", errorText);
      throw new Error(
        `스프레드시트 정보 조회 실패: ${metadataResponse.status}`
      );
    }

    const metadata = await metadataResponse.json();
    const firstSheetName = metadata.sheets[0].properties.title;
    console.log("첫 번째 시트 이름:", firstSheetName);

    const range = `${firstSheetName}!A2:G1000`; // 헤더 제외하고 데이터만 가져오기 (G열까지 확장)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?timestamp=${Date.now()}&nocache=true`;
    console.log("데이터 요청 URL:", url);

    console.log("시트 데이터 요청 중...");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    console.log("시트 데이터 응답 상태:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API 오류:", errorText);
      throw new Error(
        `Google Sheets API 오류: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("받은 원본 데이터:", data);
    const rows = data.values || [];
    console.log("데이터 행 수:", rows.length);

    // 데이터 변환
    const attendance = rows.map((row: string[], index: number) => {
      console.log(`행 ${index + 2}:`, row);
      return {
        timestamp: row[0] || "",
        name: row[1] || "",
        phone: row[2] || "",
        willAttend: row[3] === "참석",
        attendCount: parseInt(row[4]) || 0,
        deviceId: row[6] || "", // G열에서 device ID 가져오기
      };
    });

    console.log("변환된 참석자 데이터:", attendance);
    console.log("총 참석자 수:", attendance.length);

    // 캐시 방지 헤더와 함께 응답 반환
    return new NextResponse(
      JSON.stringify({
        success: true,
        attendance,
        total: attendance.length,
        timestamp: new Date().toISOString(), // 응답 시간 추가
        debug: {
          sheetName: firstSheetName,
          rawRowCount: rows.length,
          processedCount: attendance.length,
        },
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
      JSON.stringify({
        error: "데이터 조회에 실패했습니다",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
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
