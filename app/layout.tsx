import type { Metadata } from "next";
import { Noto_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="ko">
      <body className={`${notoSans.variable} ${inter.variable} font-sans`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
