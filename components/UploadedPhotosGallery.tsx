"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/zoom";

interface Photo {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  fileSize: number;
  lastModified: Date;
}

interface UploadedPhotosGalleryProps {
  isWeddingTime: boolean;
  uploadedPhotos: Photo[];
  isLoadingPhotos: boolean;
}

export default function UploadedPhotosGallery({
  isWeddingTime,
  uploadedPhotos,
  isLoadingPhotos,
}: UploadedPhotosGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // 썸네일 스크롤 함수
  const scrollToThumbnail = useCallback((index: number) => {
    if (thumbnailContainerRef.current) {
      const thumbnailWidth = 80; // h-20 = 80px + gap
      const containerWidth = thumbnailContainerRef.current.clientWidth;
      const scrollLeft =
        thumbnailWidth * index - containerWidth / 2 + thumbnailWidth / 2;

      thumbnailContainerRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      });
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        swiperInstance?.slidePrev();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        swiperInstance?.slideNext();
      }
      if (event.key === "Escape") setSelectedIndex(null);
    },
    [selectedIndex, swiperInstance]
  );

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (selectedIndex !== null) {
      // 현재 스크롤 위치 저장
      const currentScrollY = window.scrollY;
      setSavedScrollPosition(currentScrollY);

      // body 스크롤 막기
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = "100%";

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        // body 스크롤 복원
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // 저장된 스크롤 위치로 복원
        window.scrollTo(0, currentScrollY);

        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selectedIndex, handleKeyDown]);

  // 결혼식 시간이 아니면 갤러리를 표시하지 않음
  if (!isWeddingTime) {
    return null;
  }

  if (isLoadingPhotos) {
    return (
      <section className="py-12 bg-neutral-50 font-apple">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            <p className="mt-4 text-gray-600">사진을 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  if (uploadedPhotos.length === 0) {
    return (
      <section className="py-12 bg-neutral-50 font-apple">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif mb-4">업로드된 사진</h2>
          <p className="text-gray-500">아직 업로드된 사진이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">
            첫 번째 사진을 업로드해보세요! 💝
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-neutral-50 font-apple">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif mb-2">업로드된 사진</h2>
            <p className="text-gray-500 text-sm">
              총 {uploadedPhotos.length}장의 소중한 순간들
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => setSelectedIndex(index)}
              >
                {photo.fileType.startsWith("image/") ? (
                  <Image
                    src={photo.url}
                    alt={photo.fileName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : photo.fileType.startsWith("video/") ? (
                  <div className="relative w-full h-full">
                    <video
                      src={photo.url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-700 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">미리보기 불가</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 모달 뷰어 */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 font-apple">
          {/* 헤더 */}
          <div className="fixed top-0 left-0 right-0 z-20">
            <div className="flex items-center justify-between px-4 py-2">
              {/* 현재 위치 표시 */}
              <div className="text-white text-sm">
                {selectedIndex + 1} / {uploadedPhotos.length}
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <span className="text-white text-lg">×</span>
              </button>
            </div>
          </div>

          {/* 위아래로 스와이프 안내 */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 text-white text-sm z-10 md:hidden flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>위아래로 스와이프</span>
          </div>

          <div className="flex h-screen">
            {/* 메인 이미지 영역 */}
            <div className="flex-1 w-full">
              <Swiper
                direction="vertical"
                slidesPerView={1}
                spaceBetween={0}
                mousewheel
                zoom={{
                  maxRatio: 3,
                  minRatio: 1,
                  toggle: true,
                }}
                modules={[Zoom]}
                className="h-full"
                style={{ height: "100dvh" }}
                initialSlide={selectedIndex}
                onSlideChange={(swiper) => {
                  setSelectedIndex(swiper.activeIndex);
                  scrollToThumbnail(swiper.activeIndex);
                }}
                onSwiper={setSwiperInstance}
              >
                {uploadedPhotos.map((photo, index) => (
                  <SwiperSlide
                    key={photo.id}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="swiper-zoom-container relative w-full h-full">
                      {photo.fileType.startsWith("image/") ? (
                        <Image
                          src={photo.url}
                          alt={photo.fileName}
                          fill
                          className="object-contain h-full w-auto mx-auto"
                          priority={index === selectedIndex}
                          sizes="100vw"
                        />
                      ) : photo.fileType.startsWith("video/") ? (
                        <video
                          src={photo.url}
                          className="w-full h-full object-contain"
                          controls
                          autoPlay={index === selectedIndex}
                          playsInline
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-lg">
                            미리보기 불가
                          </span>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 하단 썸네일 영역 */}
            <div className="absolute bottom-0 left-0 right-0 h-20 z-10 mt-1">
              <div
                ref={thumbnailContainerRef}
                className="p-2 h-full overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="flex gap-2 h-full">
                  {uploadedPhotos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className={`relative aspect-square h-full flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedIndex === index
                          ? "ring-2 ring-white shadow-lg transform scale-105"
                          : "ring-1 ring-white/20 hover:ring-white/40"
                      }`}
                      onClick={() => swiperInstance?.slideTo(index)}
                    >
                      {photo.fileType.startsWith("image/") ? (
                        <Image
                          src={photo.url}
                          alt={photo.fileName}
                          fill
                          className="object-cover"
                        />
                      ) : photo.fileType.startsWith("video/") ? (
                        <div className="relative w-full h-full">
                          <video
                            src={photo.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-gray-700 ml-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-300 text-xs">
                            미리보기 불가
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                      {selectedIndex === index && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
