"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MapSection from "@/components/MapSection";
import { ToastProvider, useToast } from "@/components/Toast";

interface GalleryImage {
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image1.jpg",
    alt: "웨딩 사진 1",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image2.jpg",
    alt: "웨딩 사진 2",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image3.jpg",
    alt: "웨딩 사진 3",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image4.jpg",
    alt: "웨딩 사진 4",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image5.jpg",
    alt: "웨딩 사진 5",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image6.jpg",
    alt: "웨딩 사진 6",
  },
];

const WEDDING_DATE = new Date("2025-07-19T11:30:00+09:00");

// 위치 정보
const LOCATION = {
  latitude: 37.5266,
  longitude: 126.8961,
  address: "서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터",
};

// 인터뷰 데이터
const interviews = [
  {
    question: "서로의 첫인상은 어땠나요?",
    groomAnswer:
      "처음 봤을 때 밝은 미소가 너무 인상적이었어요. 그 미소에 반했죠.",
    brideAnswer:
      "차분하고 신중한 모습이 믿음직스러웠어요. 말씀하시는 게 참 따뜻했어요.",
  },
  {
    question: "언제 결혼을 결심하게 되었나요?",
    groomAnswer:
      "서로를 더 깊이 알아갈수록 평생을 함께하고 싶다는 마음이 커졌어요.",
    brideAnswer:
      "힘들 때 항상 곁에서 힘이 되어주는 모습을 보며 이 사람이구나 생각했어요.",
  },
  {
    question: "앞으로의 신혼 생활 계획은?",
    groomAnswer: "서로 배려하고 이해하며 행복한 가정을 만들어가고 싶어요.",
    brideAnswer: "작은 일상의 순간들을 소중히 여기며 함께 성장해나가고 싶어요.",
  },
];

// 계좌번호 정보
const accounts = [
  {
    bank: "신한은행",
    number: "110-123-456789",
    holder: "이태호",
  },
  {
    bank: "국민은행",
    number: "123-12-123456",
    holder: "박성혜",
  },
];

function MagazineComponent() {
  const { showToast } = useToast();
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [isMobileView, setIsMobileView] = React.useState(false);

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
    <main
      className={`min-h-screen bg-[#D0BCA4] ${
        isMobileView ? "max-w-[428px] mx-auto shadow-2xl relative" : ""
      }`}
    >
      {/* 네비게이션 버튼 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">메인</span>
          </Link>

          <Link
            href="/minimal"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">미니멀</span>
          </Link>

          <Link
            href="/classic"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">클래식</span>
          </Link>

          <Link
            href="/exclusive"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">익스클루시브</span>
          </Link>

          <Link
            href="/magazine"
            className="bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">매거진</span>
          </Link>
        </div>

        <button
          onClick={() => setIsMobileView(!isMobileView)}
          className="bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
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
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">
            {isMobileView ? "데스크톱으로 보기" : "모바일로 보기"}
          </span>
        </button>
      </div>

      {/* 메인 섹션 */}
      <section className="relative bg-[#D0BCA4]">
        {/* 상단 매거진 스타일 섹션 */}
        <div className="flex flex-col gap-20">
          {/* 첫 번째 영역 - 매거진 스타일 레이아웃 */}
          <div className="relative h-screen w-full snap-start">
            <div className="absolute inset-0 w-full h-full">
              {/* 전신 이미지 - 상단 좌측 */}
              <div className="absolute top-[5%] left-[5%] w-[60%] h-[50%]">
                <Image
                  src="https://d11ay48rmhjgmh.cloudfront.net/wedding/f1.jpg"
                  alt="전신 이미지"
                  fill
                  className="object-cover object-center"
                  sizes="60vw"
                />
              </div>
              {/* 클로즈업 이미지 - 가운데 우측 */}
              <div className="absolute top-[15%] right-[5%] w-[55%] h-[45%] z-10">
                <Image
                  src="https://d11ay48rmhjgmh.cloudfront.net/wedding/f.jpg"
                  alt="클로즈업 이미지"
                  fill
                  className="object-cover object-center"
                  sizes="55vw"
                />
              </div>
              {/* 제품 이미지 - 하단 중앙 */}
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[40%] aspect-square">
                <Image
                  src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image6.jpg"
                  alt="제품 이미지"
                  fill
                  className="object-contain"
                  sizes="40vw"
                />
              </div>
              {/* 20 F/W COLLECTION 텍스트 */}
              <div className="absolute -right-4 top-0 transform -rotate-90 origin-right">
                <p className="text-sm tracking-widest text-gray-600">
                  20 F/W COLLECTION
                </p>
              </div>
            </div>
          </div>

          {/* 두 번째 영역 - 중간 크기 이미지와 텍스트 */}
          <div className="relative h-screen w-full snap-start overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image2.jpg"
                alt="중간 이미지"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="absolute bottom-12 left-0 right-0 px-8">
              <h2 className="text-3xl font-light mb-4 text-white">Our Story</h2>
              <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
                서로가 마주보며 다져온 사랑을 이제 함께 한 곳을 바라보며
                걸어가고자 합니다.
              </p>
            </div>
          </div>

          {/* 세 번째 영역 - 큰 이미지와 텍스트 */}
          <div className="relative h-screen w-full snap-start">
            <div className="absolute inset-0">
              <Image
                src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image3.jpg"
                alt="큰 이미지"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
              <h1 className="text-5xl font-light mb-8 text-white">
                이태호 & 박성혜
              </h1>
              <p className="text-xl text-white/90">2025.07.19 SAT AM 11:30</p>
            </div>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="mt-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-light text-center mb-2">
              WEDDING MAGAZINE
            </h2>
            <p className="text-sm text-gray-600 text-center">
              우리의 특별한 순간을 담은 매거진
            </p>
          </div>
        </div>
      </section>

      {/* 갤러리 섹션 */}
      <section className="py-20 bg-[#D0BCA4]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-[3/4] group overflow-hidden rounded-lg"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
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
        </div>
      </section>

      {/* 인터뷰 섹션 */}
      <section className="py-20 px-4 bg-[#D0BCA4]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-4 text-gray-800">
            Our Story
          </h2>
          <p className="text-gray-600 text-center mb-12 font-light">
            태호와 성혜의 설레는 이야기
          </p>
          <div className="space-y-8 sm:space-y-12">
            {/* 첫 번째 질문 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg font-medium text-rose-500 mb-4 sm:mb-6">
                서로의 첫인상은 어땠나요? 💝
              </p>
              <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {interviews[0].groomAnswer}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {interviews[0].brideAnswer}
                  </p>
                </div>
              </div>
            </div>

            {/* 두 번째 질문 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg font-medium text-rose-500 mb-4 sm:mb-6">
                언제 결혼을 결심하게 되었나요? ✨
              </p>
              <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {interviews[1].groomAnswer}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {interviews[1].brideAnswer}
                  </p>
                </div>
              </div>
            </div>

            {/* 세 번째 질문 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg font-medium text-rose-500 mb-4 sm:mb-6">
                앞으로의 신혼 생활 계획은? ❤️
              </p>
              <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {interviews[2].groomAnswer}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {interviews[2].brideAnswer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지도 섹션 */}
      <MapSection />

      {/* 마음 전하실 곳 섹션 */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">
            마음 전하실 곳
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <p className="text-sm text-gray-500 mb-2">{account.holder}</p>
                <p className="font-medium mb-2">{account.bank}</p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">{account.number}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(account.number);
                      showToast("계좌번호가 복사되었습니다.", "success");
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    복사
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function MagazineLayout() {
  return (
    <ToastProvider>
      <MagazineComponent />
    </ToastProvider>
  );
}
