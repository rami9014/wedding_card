"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/Map";

const WEDDING_DATE = new Date("2025-07-19T11:30:00+09:00");

export default function MinimalLayout() {
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
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* 메인 섹션 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12 max-w-2xl mx-auto"
        >
          <div className="space-y-6">
            <h1 className="text-4xl font-light tracking-widest">
              이태호 & 박성혜
            </h1>
            <p className="text-lg text-gray-600">
              2025년 7월 19일 토요일 오전 11시 30분
            </p>
            <p className="text-gray-500">당산 그랜드컨벤션센터 5층</p>
          </div>

          <div className="w-px h-16 bg-gray-200 mx-auto" />

          <div className="flex justify-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-light text-gray-900 mb-1">
                {timeLeft.days}
              </div>
              <div className="text-gray-500">DAYS</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-1">
                {timeLeft.hours}
              </div>
              <div className="text-gray-500">HOURS</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-1">
                {timeLeft.minutes}
              </div>
              <div className="text-gray-500">MINUTES</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 초대글 섹션 */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <div className="space-y-8">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {`서로가 마주보며 다져온 사랑을
                이제 함께 한 곳을 바라보며
                걸어가고자 합니다.
                
                저희 두 사람이 사랑으로 만나
                진실과 이해로써 하나 되는 날입니다.
                
                오셔서 축복해 주시면
                감사하겠습니다.`}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 갤러리 섹션 */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="relative aspect-[4/5]">
                  <Image
                    src={`/gallery/image${index}.jpg`}
                    alt={`웨딩 사진 ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/gallery"
                className="inline-flex items-center text-sm tracking-widest hover:text-gray-600 transition-colors"
              >
                <span>VIEW MORE PHOTOS</span>
                <svg
                  className="w-4 h-4 ml-2"
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* 연락처 섹션 추가 */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-16"
          >
            <div className="flex justify-center gap-16">
              <div className="text-center space-y-8">
                <div>
                  <p className="text-gray-600 mb-2 text-sm tracking-widest">
                    GROOM
                  </p>
                  <p className="text-gray-800 font-light mb-2">이태호</p>
                  <a
                    href="tel:010-6226-1157"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
                    <p className="text-gray-600 mb-1 text-sm tracking-widest">
                      FATHER
                    </p>
                    <p className="text-gray-800 font-light mb-2">이름1</p>
                    <a
                      href="tel:010-6226-1157"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
                    <p className="text-gray-600 mb-1 text-sm tracking-widest">
                      MOTHER
                    </p>
                    <p className="text-gray-800 font-light mb-2">이름2</p>
                    <a
                      href="tel:010-7777-6402"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
                  <p className="text-gray-600 mb-2 text-sm tracking-widest">
                    BRIDE
                  </p>
                  <p className="text-gray-800 font-light mb-2">박성혜</p>
                  <a
                    href="tel:010-2662-5517"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
                    <p className="text-gray-600 mb-1 text-sm tracking-widest">
                      FATHER
                    </p>
                    <p className="text-gray-800 font-light mb-2">아무개</p>
                    <a
                      href="tel:010-6226-1157"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
                    <p className="text-gray-600 mb-1 text-sm tracking-widest">
                      MOTHER
                    </p>
                    <p className="text-gray-800 font-light mb-2">홍길동</p>
                    <a
                      href="tel:010-7777-6402"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-sm tracking-widest text-gray-600 text-center">
              LOCATION
            </h2>
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
            className="space-y-8"
          >
            <h2 className="text-sm tracking-widest text-gray-600 text-center">
              GIFT
            </h2>
            <div className="bg-[#FAFAFA] p-6 space-y-4">
              <div>
                <p className="text-gray-600 mb-2 text-sm">신랑측 계좌번호</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-light">
                    신한은행 111-455-555555
                  </p>
                  <button
                    onClick={() => copyToClipboard("111-455-555555")}
                    className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
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
      <footer className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="text-sm tracking-widest text-gray-500">
              TAEHO & SUNGHYE
            </div>
            <div className="text-xs text-gray-400">2025.07.19 SAT AM 11:30</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
