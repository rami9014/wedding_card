import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "이태호 ❤️ 박성혜 결혼식에 초대합니다",
  description: "2025년 7월 19일 토요일 오전 11시 30분, 당산 그랜드컨벤션센터",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      style={{
        fontFamily:
          '"Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", sans-serif',
      }}
    >
      <body>
        {children}
        <div id="portal"></div>
      </body>
      <SpeedInsights />
    </html>
  );
}
