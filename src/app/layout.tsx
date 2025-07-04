import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "이태호 ❤️ 박성혜 결혼식에 초대합니다",
  description: "2025년 7월 19일 토요일 오전 11시 30분, 당산 그랜드컨벤션센터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} antialiased`}>{children}</body>
    </html>
  );
}
