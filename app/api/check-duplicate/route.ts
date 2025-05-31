import { NextRequest, NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/google-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, deviceId } = body;

    // 이름과 연락처가 모두 비어있으면 중복 체크를 건너뛰고 바로 허용
    if (!name?.trim() && !phone?.trim()) {
      return NextResponse.json({
        isDuplicate: false,
        message: "익명 참석으로 등록됩니다.",
      });
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
      return NextResponse.json({ isDuplicate: false });
    }

    // JWT 토큰으로 Google Sheets API 인증
    const accessToken = await getGoogleAccessToken();

    // 스프레드시트 메타데이터 가져오기
    const metadataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "If-None-Match": "*",
        },
        cache: "no-store",
      }
    );

    if (!metadataResponse.ok) {
      return NextResponse.json({ isDuplicate: false });
    }

    const metadata = await metadataResponse.json();
    const firstSheetName = metadata.sheets[0].properties.title;

    // 기존 데이터 조회
    const range = `${firstSheetName}!A2:G1000`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "If-None-Match": "*",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json({ isDuplicate: false });
    }

    const data = await response.json();
    const rows = data.values || [];

    // 중복 체크 로직
    const duplicateRow = rows.find((row: string[]) => {
      const existingName = row[1] || "";
      const existingPhone = row[2] || "";
      const existingDeviceId = row[6] || "";

      // 1. Device ID가 있고 일치하는 경우 (가장 확실한 중복)
      if (deviceId && existingDeviceId && existingDeviceId === deviceId) {
        return true;
      }

      // 2. 이름과 전화번호가 모두 있고 일치하는 경우
      if (name?.trim() && phone?.trim() && existingName && existingPhone) {
        return (
          existingName.trim().toLowerCase() === name.trim().toLowerCase() &&
          existingPhone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")
        );
      }

      // 3. 이름만 있고 일치하는 경우
      if (name?.trim() && existingName && !phone?.trim()) {
        return existingName.trim().toLowerCase() === name.trim().toLowerCase();
      }

      // 4. 연락처만 있고 일치하는 경우
      if (!name?.trim() && phone?.trim() && existingPhone) {
        return (
          existingPhone.replace(/[^0-9]/g, "") === phone.replace(/[^0-9]/g, "")
        );
      }

      return false;
    });

    if (duplicateRow) {
      const [timestamp, existingName, existingPhone, willAttend] = duplicateRow;

      return NextResponse.json({
        isDuplicate: true,
        existingData: {
          timestamp,
          name: existingName || "익명",
          phone: existingPhone || "미입력",
          willAttend: willAttend === "TRUE",
        },
        message: "이미 등록된 참석자입니다.",
      });
    }

    return NextResponse.json({
      isDuplicate: false,
      message: "새로운 참석자입니다.",
    });
  } catch (error) {
    console.error("중복 체크 실패:", error);
    return NextResponse.json({ isDuplicate: false });
  }
}
