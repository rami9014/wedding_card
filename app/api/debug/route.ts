import { NextResponse } from "next/server";

export async function GET() {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
      hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      googleSheetIdLength: process.env.GOOGLE_SHEET_ID?.length || 0,
      serviceAccountEmailDomain:
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.split("@")[1] || "none",
      privateKeyPrefix:
        process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30) || "none",
    };

    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json(
      { error: "디버그 정보 조회 실패", details: String(error) },
      { status: 500 }
    );
  }
}
