"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/Map";

const WEDDING_DATE = new Date("2025-07-19T11:30:00+09:00");

export default function ExclusiveLayout() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeLeft({ days, hours, minutes });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-[#F5F5F3]">
      {/* 헤더 섹션 */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-light">IKE</h1>
          <span className="text-sm font-light">Exclusive Launching</span>
        </div>
      </header>

      {/* 메인 섹션 */}
      <section className="min-h-screen pt-24 px-8">
        <div className="grid grid-cols-12 gap-8">
          {/* 왼쪽 컬럼 */}
          <div className="col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="aspect-square relative rounded-lg overflow-hidden"
            >
              <Image
                src="/gallery/image1.jpg"
                alt="웨딩 사진 1"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="aspect-square relative rounded-lg overflow-hidden"
            >
              <Image
                src="/gallery/image2.jpg"
                alt="웨딩 사진 2"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="aspect-square relative rounded-lg overflow-hidden"
            >
              <Image
                src="/gallery/image3.jpg"
                alt="웨딩 사진 3"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* 중앙 컬럼 */}
          <div className="col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="sticky top-32 aspect-[3/4] relative rounded-lg overflow-hidden"
            >
              <Image
                src="/gallery/image4.jpg"
                alt="메인 웨딩 사진"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="col-span-3">
            <div className="sticky top-32 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-4xl font-light">우리 결혼합니다</h2>
                <p className="text-lg text-gray-600">이태호 ❤️ 박성혜</p>
                <p className="text-gray-500">
                  2025년 7월 19일 토요일 오전 11시 30분
                </p>
                <p className="text-gray-500">당산 그랜드컨벤션센터 5층</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="text-2xl font-light text-rose-500">
                  D-{timeLeft.days}
                </div>
                <div className="flex gap-4 text-gray-600">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-light">{timeLeft.days}</span>
                    <span className="text-sm">일</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-light">{timeLeft.hours}</span>
                    <span className="text-sm">시간</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-light">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-sm">분</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <Link
                  href="/gallery"
                  className="inline-flex items-center px-6 py-3 bg-[#2A2A2A] text-white rounded-full hover:bg-black transition-colors"
                >
                  <span>갤러리 보기</span>
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 연락처 섹션 추가 */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div className="flex justify-center gap-16">
              <div className="text-center space-y-8">
                <div>
                  <p className="text-gray-600 mb-2">신랑</p>
                  <p className="text-gray-800 font-medium mb-2">이태호</p>
                  <a
                    href="tel:010-6226-1157"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    aria-label="신랑에게 전화하기"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-1">아버지</p>
                    <p className="text-gray-800 font-medium mb-2">이름1</p>
                    <a
                      href="tel:010-6226-1157"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      aria-label="신랑 아버지께 전화하기"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">어머니</p>
                    <p className="text-gray-800 font-medium mb-2">이름2</p>
                    <a
                      href="tel:010-7777-6402"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      aria-label="신랑 어머니께 전화하기"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-8">
                <div>
                  <p className="text-gray-600 mb-2">신부</p>
                  <p className="text-gray-800 font-medium mb-2">박성혜</p>
                  <a
                    href="tel:010-2662-5517"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    aria-label="신부에게 전화하기"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-1">아버지</p>
                    <p className="text-gray-800 font-medium mb-2">아무개</p>
                    <a
                      href="tel:010-6226-1157"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      aria-label="신부 아버지께 전화하기"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">어머니</p>
                    <p className="text-gray-800 font-medium mb-2">홍길동</p>
                    <a
                      href="tel:010-7777-6402"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      aria-label="신부 어머니께 전화하기"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 지도 섹션 추가 */}
      <section className="py-24 bg-[#F5F5F3]">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-2xl font-light text-center">오시는 길</h2>
            <Map
              latitude={37.5266}
              longitude={126.8961}
              address="서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터"
            />
          </motion.div>
        </div>
      </section>

      {/* 계좌번호 섹션 추가 */}
      <section className="py-24 bg-white">
        <div className="max-w-md mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-light text-center">마음 전하실 곳</h2>
            <div className="bg-[#F5F5F3] rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-gray-600 mb-2">신랑측 계좌번호</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-800">신한은행 111-455-555555</p>
                  <button
                    onClick={() => copyToClipboard("111-455-555555")}
                    className="text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    복사
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
