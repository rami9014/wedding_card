import { NextRequest, NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/google-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      timestamp,
      name,
      phone,
      willAttend,
      attendCount,
      userAgent,
      deviceId,
    } = body;

    // JWT 토큰으로 Google Sheets API 인증
    const accessToken = await getGoogleAccessToken();

    // 먼저 스프레드시트 정보를 가져와서 첫 번째 시트 이름 확인
    const metadataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}`,
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

    // Google Sheets API 호출 - 첫 번째 시트 이름 사용
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${firstSheetName}:append?valueInputOption=RAW`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
              timestamp,
              name,
              phone,
              willAttend ? "참석" : "불참석",
              attendCount,
              userAgent,
              deviceId,
            ],
          ],
        }),
      }
    );

    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text();
      console.error("Google Sheets API 오류:", errorText);
      throw new Error("Google Sheets API 호출 실패");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("참석 정보 저장 실패:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류" },
      { status: 500 }
    );
  }
}
