import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { getGoogleAccessToken } from "@/lib/google-auth";
import dayjs from "dayjs";

// Next.js App Router에서는 이 설정이 자동으로 처리됩니다
// export const config는 더 이상 필요하지 않습니다

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const uploaderName = formData.get("uploaderName") as string;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 미디어 파일인지 확인 (이미지 또는 비디오)
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "이미지 또는 영상 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // S3에 업로드
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileExtension = file.name.split(".").pop();
    const fileName = `${dayjs().format("YYYYMMDDHHMMSS")}-${Math.random()
      .toString(12)
      .substring(7)}.${fileExtension}`;

    const s3Url = await uploadToS3(buffer, fileName, file.type);

    // Google Sheets에 메타데이터 저장
    const accessToken = await getGoogleAccessToken();

    // 스프레드시트 정보 가져오기
    const metadataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!metadataResponse.ok) {
      throw new Error("스프레드시트 정보 조회 실패");
    }

    const metadata = await metadataResponse.json();

    // "사진업로드" 시트가 있는지 확인하고, 없으면 첫 번째 시트 사용
    let targetSheetName = "사진업로드";
    const sheetExists = metadata.sheets.some(
      (sheet: any) => sheet.properties.title === targetSheetName
    );

    if (!sheetExists) {
      targetSheetName = metadata.sheets[0].properties.title;
    }

    // Google Sheets에 데이터 추가
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${targetSheetName}:append?valueInputOption=RAW`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
              new Date().toISOString(),
              uploaderName || "익명",
              file.name,
              file.type,
              s3Url,
              `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            ],
          ],
        }),
      }
    );

    if (!sheetsResponse.ok) {
      console.error("Google Sheets 저장 실패");
      // S3 업로드는 성공했으므로 계속 진행
    }

    return NextResponse.json({
      success: true,
      url: s3Url,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("업로드 오류:", error);
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
