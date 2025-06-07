"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

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
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handlePrevImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? uploadedPhotos.length - 1 : prev - 1;
    });
  }, [selectedIndex, uploadedPhotos.length]);

  const handleNextImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === uploadedPhotos.length - 1 ? 0 : prev + 1;
    });
  }, [selectedIndex, uploadedPhotos.length]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handlePrevImage();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        handleNextImage();
      }
      if (event.key === "ArrowLeft") handlePrevImage();
      if (event.key === "ArrowRight") handleNextImage();
      if (event.key === "Escape") setSelectedIndex(null);
    },
    [selectedIndex, handlePrevImage, handleNextImage]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = e.touches[0].clientY; // 초기값 설정
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;

    // 스와이프 중일 때만 스크롤 방지
    const touchDiff = Math.abs(touchStartY.current - touchEndY.current);
    if (touchDiff > 10) {
      // 10px 이상 움직였을 때만 스크롤 방지
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDiff = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 80; // 최소 스와이프 거리를 더 크게 설정

    if (Math.abs(touchDiff) > minSwipeDistance) {
      e.preventDefault(); // 스와이프로 인정될 때만 기본 동작 방지
      if (touchDiff > 0) {
        // 위로 스와이프 - 다음 사진
        handleNextImage();
      } else {
        // 아래로 스와이프 - 이전 사진
        handlePrevImage();
      }
    }

    // 터치 값 초기화
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (selectedIndex !== null) {
      // body 스크롤 막기
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        // body 스크롤 복원
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";

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
      <section className="py-12 bg-neutral-50">
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
      <section className="py-12 bg-neutral-50">
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
      <section className="py-12 bg-neutral-50">
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
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full h-full md:w-4/5 md:h-4/5"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 이전 버튼 */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10 hover:text-gray-300 transition-colors md:block hidden"
              onClick={handlePrevImage}
            >
              ‹
            </button>

            {/* 다음 버튼 */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10 hover:text-gray-300 transition-colors md:block hidden"
              onClick={handleNextImage}
            >
              ›
            </button>

            {/* 위로 스와이프 안내 (모바일) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm z-10 md:hidden flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>위아래로 스와이프</span>
            </div>

            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-white text-4xl z-10 hover:text-gray-300 transition-colors"
              onClick={() => setSelectedIndex(null)}
            >
              ×
            </button>

            {/* 현재 위치 표시 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm z-10">
              {selectedIndex + 1} / {uploadedPhotos.length}
            </div>

            {/* 미디어 콘텐츠 */}
            <div className="relative w-full h-full">
              {uploadedPhotos[selectedIndex].fileType.startsWith("image/") ? (
                <Image
                  src={uploadedPhotos[selectedIndex].url}
                  alt={uploadedPhotos[selectedIndex].fileName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : uploadedPhotos[selectedIndex].fileType.startsWith(
                  "video/"
                ) ? (
                <video
                  src={uploadedPhotos[selectedIndex].url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-lg">미리보기 불가</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
