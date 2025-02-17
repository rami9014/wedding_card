"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/Map";

const WEDDING_DATE = new Date("2025-07-19T11:30:00+09:00");

interface GalleryImage {
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { src: "/gallery/image1.jpg", alt: "웨딩 사진 1" },
  { src: "/gallery/image2.jpg", alt: "웨딩 사진 2" },
  { src: "/gallery/image3.jpg", alt: "웨딩 사진 3" },
  { src: "/gallery/image4.jpg", alt: "웨딩 사진 4" },
  { src: "/gallery/image5.jpg", alt: "웨딩 사진 5" },
  { src: "/gallery/image6.jpg", alt: "웨딩 사진 6" },
];

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
    <main className="min-h-screen bg-white">
      {/* 메인 섹션 */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/main-minimal.jpg"
            alt="메인 이미지"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative text-center text-white px-4">
          <p className="text-sm sm:text-base tracking-widest mb-4 sm:mb-6">
            2025. 07. 19. SAT AM 11:30
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wider mb-4 sm:mb-6">
            이태호 & 박성혜
          </h1>
          <p className="text-sm sm:text-base tracking-wide">
            당산 그랜드컨벤션센터 5층
          </p>
        </div>
      </section>

      {/* 초대글 섹션 */}
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
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
      <section className="py-12 sm:py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-base sm:text-lg uppercase tracking-widest text-center mb-6 sm:mb-8">
            Gallery
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className="relative aspect-[3/4] cursor-pointer group overflow-hidden"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link
              href="/gallery"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors text-xs sm:text-sm uppercase tracking-wider"
            >
              <span>더 많은 사진 보기</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
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
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base sm:text-lg uppercase tracking-widest text-center mb-6 sm:mb-8">
            Contact
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
            <div className="text-center space-y-6">
              <div>
                <p className="text-sm sm:text-base font-medium mb-2">신랑</p>
                <p className="text-sm sm:text-base text-gray-600 mb-1">
                  이태호
                </p>
                <a
                  href="tel:010-1234-5678"
                  className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 uppercase tracking-wider"
                >
                  010-1234-5678
                </a>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">
                  신랑측 혼주
                </p>
                <p className="text-sm sm:text-base mb-1">
                  <span className="text-gray-500">아버지</span> 이아버지
                </p>
                <p className="text-sm sm:text-base">
                  <span className="text-gray-500">어머니</span> 이어머니
                </p>
              </div>
            </div>
            <div className="text-center space-y-6">
              <div>
                <p className="text-sm sm:text-base font-medium mb-2">신부</p>
                <p className="text-sm sm:text-base text-gray-600 mb-1">
                  박성혜
                </p>
                <a
                  href="tel:010-8765-4321"
                  className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 uppercase tracking-wider"
                >
                  010-8765-4321
                </a>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">
                  신부측 혼주
                </p>
                <p className="text-sm sm:text-base mb-1">
                  <span className="text-gray-500">아버지</span> 박아버지
                </p>
                <p className="text-sm sm:text-base">
                  <span className="text-gray-500">어머니</span> 박어머니
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지도 섹션 */}
      <section className="py-12 sm:py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-base sm:text-lg uppercase tracking-widest text-center mb-6 sm:mb-8">
            Location
          </h2>
          <Map
            latitude={37.5266}
            longitude={126.8961}
            address="서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터"
          />
        </div>
      </section>

      {/* 계좌번호 섹션 */}
      <section className="py-12 sm:py-16">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-base sm:text-lg uppercase tracking-widest text-center mb-6 sm:mb-8">
            Gift
          </h2>
          <div className="bg-neutral-50 rounded-lg p-4 sm:p-6">
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">
                신랑측 계좌번호
              </p>
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base">신한은행 111-455-555555</p>
                <button
                  onClick={() => copyToClipboard("111-455-555555")}
                  className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 uppercase tracking-wider"
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
