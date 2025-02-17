"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Map from "@/components/Map";
import Gallery from "@/components/Gallery";

// 갤러리 이미지 목록
const galleryImages = [
  { src: "/gallery/image1.jpg", alt: "웨딩 사진 1" },
  { src: "/gallery/image2.jpg", alt: "웨딩 사진 2" },
  { src: "/gallery/image3.jpg", alt: "웨딩 사진 3" },
  { src: "/gallery/image4.jpg", alt: "웨딩 사진 4" },
  { src: "/gallery/image5.jpg", alt: "웨딩 사진 5" },
  { src: "/gallery/image6.jpg", alt: "웨딩 사진 6" },
];

// 결혼식 날짜 설정
const WEDDING_DATE = new Date("2025-07-19T11:30:00+09:00");

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
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

    // 초기 계산
    calculateTimeLeft();

    // 1분마다 업데이트
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* 메인 섹션 */}
      <section className="w-full h-screen flex flex-col items-center justify-center bg-neutral-50">
        <div className="relative w-full h-[70vh]">
          <Image
            src="/main-image.jpg"
            alt="이태호 ❤️ 박성혜 웨딩 이미지"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="text-center py-8 relative">
          {/* D-day 카운터 */}
          <div className="mb-8">
            <div className="inline-flex flex-col items-center">
              <div className="text-3xl font-bold text-rose-500 mb-2">
                D-{timeLeft.days}
              </div>
              <div className="flex gap-4 text-gray-600">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-semibold">
                    {timeLeft.days}
                  </span>
                  <span className="text-sm">일</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-semibold">
                    {timeLeft.hours}
                  </span>
                  <span className="text-sm">시간</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-semibold">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-sm">분</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-serif mb-4">우리 결혼합니다</h1>
          <p className="text-lg text-gray-600">이태호 ❤️ 박성혜</p>
          <p className="mt-4 text-gray-500">
            2025년 7월 19일 토요일 오전 11시 30분
          </p>
          <p className="text-gray-500">당산 그랜드컨벤션센터 5층</p>
        </div>
      </section>

      {/* 초대글 섹션 */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {`서로가 마주보며 다져온 사랑을
            이제 함께 한 곳을 바라보며
            걸어가고자 합니다.
            
            저희 두 사람이 사랑으로 만나
            진실과 이해로써 하나 되는 날입니다.
            
            오셔서 축복해 주시면
            감사하겠습니다.`}
          </p>
        </div>
      </section>

      {/* 갤러리 섹션 */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-8">갤러리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/gallery"
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
            >
              <span>더 많은 사진 보기</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 우리의 이야기 섹션 */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-4">Our Story</h2>
          <p className="text-gray-500 text-center mb-12 font-light">
            태호와 성혜의 설레는 이야기
          </p>
          <div className="space-y-12">
            {/* 첫 번째 질문 */}
            <div className="bg-neutral-50 rounded-3xl p-8 shadow-sm">
              <p className="text-lg font-medium text-rose-500 mb-6">
                첫 만남의 설렘이 아직도 생생해요 💝
              </p>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {`2022년 여름, 공통 친구의 소개로 처음 만났어요.
                    카페에서 마주 앉아 이야기를 나누는데, 성혜가 웃을 때마다 
                    주변이 환해지는 것 같았죠. 그때의 설렘이 지금도 생생합니다.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`처음 본 순간부터 태호의 따뜻한 미소가 인상적이었어요.
                    대화를 나누면서 서로의 가치관이 잘 맞는다는 걸 느꼈고,
                    이야기를 나눌수록 시간 가는 줄 몰랐던 기억이 나요.`}
                  </p>
                </div>
              </div>
            </div>

            {/* 두 번째 질문 */}
            <div className="bg-neutral-50 rounded-3xl p-8 shadow-sm">
              <p className="text-lg font-medium text-rose-500 mb-6">
                서로가 서로에게 반한 순간들 ✨
              </p>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {`성혜는 늘 긍정적이고 다정한 마음을 가졌어요.
                    힘든 순간에도 서로를 생각하며 웃을 수 있게 해주죠.
                    그런 성혜를 보면서 '이런 사람과 함께라면 어떤 어려움도 이겨낼 수 있겠다'는 
                    확신이 들었어요.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`태호는 책임감이 강하고 성실해요.
                    무엇보다 서로를 향한 믿음과 존중하는 마음이 크답니다.
                    작은 일상에서도 늘 배려하는 모습을 보여주는 태호를 보며
                    '평생 함께하고 싶다'는 마음이 커져갔어요.`}
                  </p>
                </div>
              </div>
            </div>

            {/* 세 번째 질문 */}
            <div className="bg-neutral-50 rounded-3xl p-8 shadow-sm">
              <p className="text-lg font-medium text-rose-500 mb-6">
                우리의 특별한 순간 ❤️
              </p>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {`함께한 시간 동안의 작은 순간들이 모여 큰 확신이 되었어요.
                    퇴근 후 늦은 저녁을 함께 먹으며 나눈 대화들,
                    주말 아침 커피 한 잔을 나누며 꾸린 소소한 계획들...
                    성혜와 함께라면 어떤 미래도 행복할 거라 믿게 되었죠.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`서로를 더 깊이 이해하고 아끼는 마음이 자라날수록,
                    자연스럽게 '이 사람과 함께 나이 들어가고 싶다'는 생각이 들었어요.
                    태호와 함께 보낸 평범한 날들이 특별해지고,
                    일상의 작은 순간들이 소중한 추억이 되어갔죠.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 연락처 섹션 */}
      <section className="w-full py-8 bg-white">
        <div className="max-w-3xl mx-auto px-4">
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
                    xmlns="http://www.w3.org/2000/svg"
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
                      xmlns="http://www.w3.org/2000/svg"
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
                      xmlns="http://www.w3.org/2000/svg"
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
                    xmlns="http://www.w3.org/2000/svg"
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
                      xmlns="http://www.w3.org/2000/svg"
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
                      xmlns="http://www.w3.org/2000/svg"
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
        </div>
      </section>

      {/* 지도 섹션 */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-8">오시는 길</h2>
          <Map
            latitude={37.5266}
            longitude={126.8961}
            address="서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터"
          />
        </div>
      </section>

      {/* 계좌번호 섹션 */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-2xl font-serif text-center mb-8">
            마음 전하실 곳
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">신랑측 계좌번호</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800">신한은행 111-455-555555</p>
                <button
                  onClick={() => copyToClipboard("111-455-555555")}
                  className="text-blue-500 hover:text-blue-600"
                >
                  복사
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
