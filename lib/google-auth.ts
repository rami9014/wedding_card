import jwt from "jsonwebtoken";

interface GoogleAuthPayload {
  iss: string;
  scope: string;
  aud: string;
  exp: number;
  iat: number;
}

export async function getGoogleAccessToken(): Promise<string> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!serviceAccountEmail || !privateKey) {
    throw new Error("Google 서비스 계정 정보가 누락되었습니다");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: GoogleAuthPayload = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600, // 1시간 후 만료
    iat: now,
  };

  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: token,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google 토큰 발급 실패: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}
