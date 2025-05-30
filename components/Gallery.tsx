"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

interface GalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState(12); // 처음에 12장만 보여줌
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreImages = () => {
    setIsLoading(true);
    // 로딩 애니메이션을 위한 짧은 지연
    setTimeout(() => {
      setVisibleImages((prev) => Math.min(prev + 12, images.length));
      setIsLoading(false);
    }, 500);
  };

  const handlePrevImage = useCallback(() => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => {
      if (prev === null) return null;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  }, [selectedImage, images.length]);

  // const handlePrev = useCallback(() => {

  //   if (selectedImage === null) return;
  //   setSelectedImage((prev) =>
  //     prev !== null && prev === 0 ? images.length - 1 : prev - 1
  //   );
  // }, [selectedImage, images.length]);

  const handleNextImage = useCallback(() => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => {
      if (prev === null) return null;
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  }, [selectedImage, images.length]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (event.key === "ArrowLeft") handlePrevImage();
      if (event.key === "ArrowRight") handleNextImage();
      if (event.key === "Escape") setSelectedImage(null);
    },
    [selectedImage, handlePrevImage, handleNextImage]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const touchDiff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(touchDiff) > minSwipeDistance) {
      if (touchDiff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  useEffect(() => {
    if (selectedImage !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage, handleKeyDown]);

  return (
    <div className="w-full">
      {/* 썸네일 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.slice(0, visibleImages).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(index)}
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

      {/* 더보기 버튼 */}
      {visibleImages < images.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMoreImages}
            disabled={isLoading}
            className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                불러오는 중...
              </span>
            ) : (
              `더 보기 (${visibleImages}/${images.length})`
            )}
          </button>
        </div>
      )}

      {/* 전체화면 모달 뷰어 */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
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

            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-white text-4xl z-10 hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>

            {/* 이미지 */}
            <div className="relative w-full h-full">
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* 이미지 카운터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
