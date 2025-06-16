import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "이태호 ❤️ 박성혜 결혼식에 초대합니다",
  description: "2025년 7월 19일 토요일 오전 11시 30분, 당산 그랜드컨벤션센터",
  keywords: [
    "결혼식",
    "청첩장",
    "이태호",
    "박성혜",
    "당산 그랜드컨벤션센터",
    "웨딩",
  ],
  authors: [{ name: "이태호" }],
  creator: "이태호",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://adev.kr/wedding",
    siteName: "이태호 ❤️ 박성혜 결혼식 청첩장",
    title: "이태호 ❤️ 박성혜 결혼식에 초대합니다",
    description:
      "2025년 7월 19일 토요일 오전 11시 30분, 당산 그랜드컨벤션센터에서 열리는 저희의 결혼식에 초대합니다.",
    images: [
      {
        url: "https://d11ay48rmhjgmh.cloudfront.net/wedding/thumb.png",
        width: 1200,
        height: 630,
        alt: "이태호 ❤️ 박성혜 결혼식 사진",
      },
      {
        url: "https://d11ay48rmhjgmh.cloudfront.net/wedding/thumb.png",
        width: 800,
        height: 600,
        alt: "이태호 ❤️ 박성혜 결혼식 사진",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "이태호 ❤️ 박성혜 결혼식에 초대합니다",
    description: "2025년 7월 19일 토요일 오전 11시 30분, 당산 그랜드컨벤션센터",
    images: ["https://d11ay48rmhjgmh.cloudfront.net/wedding/thumb.png"],
    creator: "@wedding_taeho_sunghye",
  },
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/fonts-archive/AppleSDGothicNeo/AppleSDGothicNeo.css"
          type="text/css"
        />
        {/* 추가 메타 태그들 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#f43f5e" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        <div id="portal"></div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
