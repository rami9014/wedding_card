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
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 bg-white/80 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-light tracking-widest">WEDDING</h1>
          <span className="text-sm font-light tracking-wider">2025.07.19</span>
        </div>
      </header>

      {/* 메인 섹션 */}
      <section className="min-h-screen pt-24 px-8">
        <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* 왼쪽 컬럼 */}
          <div className="col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="aspect-[3/4] relative rounded-lg overflow-hidden"
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
              className="aspect-[4/3] relative rounded-lg overflow-hidden"
            >
              <Image
                src="/gallery/image3.jpg"
                alt="웨딩 사진 3"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="aspect-[3/4] relative rounded-lg overflow-hidden"
            >
              <Image
                src="/gallery/image5.jpg"
                alt="웨딩 사진 5"
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
              className="sticky top-32 space-y-12"
            >
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image
                  src="/gallery/image4.jpg"
                  alt="메인 웨딩 사진"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/image6.jpg"
                    alt="웨딩 사진 6"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/image7.jpg"
                    alt="웨딩 사진 7"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="col-span-3">
            <div className="sticky top-32 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-5xl font-light tracking-wide leading-tight">
                    우리의
                    <br />
                    결혼식에
                    <br />
                    초대합니다
                  </h2>
                  <div className="w-12 h-0.5 bg-gray-900" />
                  <p className="text-lg text-gray-600">이태호 ❤️ 박성혜</p>
                  <p className="text-gray-500 tracking-wider">
                    2025년 7월 19일 토요일
                    <br />
                    오전 11시 30분
                  </p>
                  <p className="text-gray-500">당산 그랜드컨벤션센터 5층</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="text-3xl font-light tracking-widest text-rose-500">
                  D-{timeLeft.days}
                </div>
                <div className="flex gap-6 text-gray-600">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-light">{timeLeft.days}</span>
                    <span className="text-xs tracking-wider">DAYS</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-light">
                      {timeLeft.hours}
                    </span>
                    <span className="text-xs tracking-wider">HOURS</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-light">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-xs tracking-wider">MINUTES</span>
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
                  className="inline-flex items-center px-8 py-4 bg-[#2A2A2A] text-white rounded-full hover:bg-black transition-colors text-sm tracking-wider"
                >
                  <span>VIEW MORE PHOTOS</span>
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="aspect-[3/4] relative rounded-lg overflow-hidden"
              >
                <Image
                  src="/gallery/image8.jpg"
                  alt="웨딩 사진 8"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 매거진 스타일 갤러리 섹션 */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-light tracking-widest">OUR STORY</h2>
              <p className="text-gray-500 tracking-wider">
                The Journey of Love
              </p>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8">
                <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/image9.jpg"
                    alt="웨딩 스토리 1"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="col-span-4 space-y-8">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/image10.jpg"
                    alt="웨딩 스토리 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/gallery/image11.jpg"
                    alt="웨딩 스토리 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 연락처 섹션 */}
      <section className="py-32 bg-[#F5F5F3]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-light tracking-widest">CONTACT</h2>
              <p className="text-gray-500 tracking-wider">Get in Touch</p>
            </div>

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

      {/* 지도 섹션 */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-light tracking-widest">LOCATION</h2>
              <p className="text-gray-500 tracking-wider">Where to Find Us</p>
            </div>

            <Map
              latitude={37.5266}
              longitude={126.8961}
              address="서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터"
            />
          </motion.div>
        </div>
      </section>

      {/* 계좌번호 섹션 */}
      <section className="py-32 bg-[#F5F5F3]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-light tracking-widest">GIFT</h2>
              <p className="text-gray-500 tracking-wider">With Gratitude</p>
            </div>

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

      {/* 푸터 */}
      <footer className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-2xl font-light tracking-widest">
              TAEHO & SUNGHYE
            </p>
            <p className="text-gray-500 tracking-wider">19 JULY 2025</p>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
