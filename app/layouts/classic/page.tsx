"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/Map";

const WEDDING_DATE = new Date("2025-07-19T11:30:00+09:00");

export default function ClassicLayout() {
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
    <main className="min-h-screen bg-white">
      {/* 메인 섹션 */}
      <section className="relative h-screen">
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="/gallery/image1.jpg"
            alt="메인 웨딩 사진"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-6xl font-serif mb-4">이태호 & 박성혜</h1>
            <p className="text-xl font-light tracking-widest">
              2025년 7월 19일 토요일 오전 11시 30분
            </p>
            <p className="text-lg font-light">당산 그랜드컨벤션센터 5층</p>
          </motion.div>
        </div>

        {/* 스크롤 다운 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll Down</span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* 초대글 섹션 */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-serif mb-8">초대합니다</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {`서로가 마주보며 다져온 사랑을
              이제 함께 한 곳을 바라보며
              걸어가고자 합니다.
              
              저희 두 사람이 사랑으로 만나
              진실과 이해로써 하나 되는 날입니다.
              
              오셔서 축복해 주시면
              감사하겠습니다.`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* D-day 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif mb-12">Wedding Day</h2>
            <div className="flex justify-center gap-12">
              <div className="w-24">
                <div className="text-4xl font-light text-rose-500 mb-2">
                  {timeLeft.days}
                </div>
                <div className="text-gray-500">Days</div>
              </div>
              <div className="w-24">
                <div className="text-4xl font-light text-rose-500 mb-2">
                  {timeLeft.hours}
                </div>
                <div className="text-gray-500">Hours</div>
              </div>
              <div className="w-24">
                <div className="text-4xl font-light text-rose-500 mb-2">
                  {timeLeft.minutes}
                </div>
                <div className="text-gray-500">Minutes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 갤러리 섹션 */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif mb-12">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="relative aspect-square group overflow-hidden"
                >
                  <Image
                    src={`/gallery/image${index}.jpg`}
                    alt={`웨딩 사진 ${index}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link
                href="/gallery"
                className="inline-flex items-center px-8 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors rounded-full"
              >
                <span>더 많은 사진 보기</span>
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* 연락처 섹션 추가 */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif mb-16">Contact</h2>
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
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif mb-12">Location</h2>
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
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-serif mb-12">Gift</h2>
            <div className="bg-gray-50 rounded-lg shadow-sm p-6">
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
      <footer className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
          <p>이태호 ❤️ 박성혜</p>
          <p className="mt-2">2025년 7월 19일 토요일 오전 11시 30분</p>
          <p>당산 그랜드컨벤션센터 5층</p>
        </div>
      </footer>
    </main>
  );
}
