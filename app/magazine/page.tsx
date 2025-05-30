"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/Map";

interface GalleryImage {
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image1.jpg", alt: "웨딩 사진 1" },
  { src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image2.jpg", alt: "웨딩 사진 2" },
  { src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image3.jpg", alt: "웨딩 사진 3" },
  { src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image4.jpg", alt: "웨딩 사진 4" },
  { src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image5.jpg", alt: "웨딩 사진 5" },
  { src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image6.jpg", alt: "웨딩 사진 6" },
];

const WEDDING_DATE = new Date("2025-07-19T11:30:00+09:00");

export default function MagazineLayout() {
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
        isMobileView ? "max-w-[430px] mx-auto shadow-2xl relative" : ""
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

      {/* 연락처 섹션 */}
      <section className="py-20 bg-[#D0BCA4]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <h3 className="text-xl mb-6">신랑</h3>
              <p className="text-gray-600 mb-2">이태호</p>
              <a
                href="tel:010-1234-5678"
                className="text-blue-500 hover:text-blue-600"
              >
                010-1234-5678
              </a>
              <div className="mt-6">
                <p className="text-gray-500 mb-2">신랑측 혼주</p>
                <p className="text-gray-600">
                  <span className="text-gray-500">아버지</span> 이아버지
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-500">어머니</span> 이어머니
                </p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl mb-6">신부</h3>
              <p className="text-gray-600 mb-2">박성혜</p>
              <a
                href="tel:010-8765-4321"
                className="text-blue-500 hover:text-blue-600"
              >
                010-8765-4321
              </a>
              <div className="mt-6">
                <p className="text-gray-500 mb-2">신부측 혼주</p>
                <p className="text-gray-600">
                  <span className="text-gray-500">아버지</span> 박아버지
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-500">어머니</span> 박어머니
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지도 섹션 */}
      <section className="py-20 bg-[#D0BCA4]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Location</h2>
          <Map
            latitude={37.5266}
            longitude={126.8961}
            address="서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터"
          />
        </div>
      </section>

      {/* 계좌번호 섹션 */}
      <section className="py-20 bg-[#D0BCA4]">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Gift</h2>
          <div className="bg-white/50 rounded-lg p-6">
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
