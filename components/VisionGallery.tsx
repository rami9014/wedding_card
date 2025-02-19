"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface GalleryImage {
  src: string;
  alt: string;
  year: number;
  season: string;
  seasonKr: string;
}

interface VisionGalleryProps {
  images: GalleryImage[];
}

export default function VisionGallery({ images }: VisionGalleryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"all" | "years" | "seasons">(
    "all"
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 연도 및 계절 목록 생성
  const years = useMemo(
    () =>
      Array.from(new Set(images.map((img) => img.year))).sort((a, b) => b - a),
    [images]
  );

  const seasons = [
    { id: "spring", name: "봄" },
    { id: "summer", name: "여름" },
    { id: "autumn", name: "가을" },
    { id: "winter", name: "겨울" },
  ];

  // 필터링된 이미지
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (selectedYear && selectedSeason) {
        return img.year === selectedYear && img.season === selectedSeason;
      }
      if (selectedYear) {
        return img.year === selectedYear;
      }
      if (selectedSeason) {
        return img.season === selectedSeason;
      }
      return true;
    });
  }, [images, selectedYear, selectedSeason]);

  // 연도별 대표 이미지
  const yearThumbnails = useMemo(() => {
    return years.map((year) => {
      const yearImage = images.find((img) => img.year === year);
      return {
        year,
        thumbnail: yearImage?.src,
        hasImages: images.some((img) => img.year === year),
      };
    });
  }, [years, images]);

  // 계절별 대표 이미지 (전체)
  const seasonThumbnails = useMemo(() => {
    return seasons.map((season) => {
      const seasonImage = images.find((img) => img.season === season.id);
      return {
        ...season,
        thumbnail: seasonImage?.src,
        hasImages: images.some((img) => img.season === season.id),
      };
    });
  }, [images]);

  // 선택된 계절의 연도별 대표 이미지
  const seasonYearThumbnails = useMemo(() => {
    if (!selectedSeason) return [];
    return years
      .map((year) => {
        const yearImage = images.find(
          (img) => img.year === year && img.season === selectedSeason
        );
        return {
          year,
          thumbnail: yearImage?.src,
          hasImages: images.some(
            (img) => img.year === year && img.season === selectedSeason
          ),
        };
      })
      .filter((item) => item.hasImages);
  }, [years, images, selectedSeason]);

  // 선택된 연도의 계절별 대표 이미지
  const yearSeasonThumbnails = useMemo(() => {
    if (!selectedYear) return [];
    return seasons
      .map((season) => {
        const seasonImage = images.find(
          (img) => img.year === selectedYear && img.season === season.id
        );
        return {
          ...season,
          thumbnail: seasonImage?.src,
          hasImages: images.some(
            (img) => img.year === selectedYear && img.season === season.id
          ),
        };
      })
      .filter((item) => item.hasImages);
  }, [selectedYear, images]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrevImage = useCallback(() => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => {
      if (prev === null) return 0;
      return prev === 0 ? filteredImages.length - 1 : prev - 1;
    });
  }, [selectedImage, filteredImages.length]);

  const handleNextImage = useCallback(() => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => {
      if (prev === null) return 0;
      return prev === filteredImages.length - 1 ? 0 : prev + 1;
    });
  }, [selectedImage, filteredImages.length]);

  const handleClose = () => {
    // 이전 페이지로 돌아가기
    router.back();
  };

  return (
    <div className="w-full min-h-screen bg-black text-white relative">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-md">
        <div className="flex justify-between items-center px-4 py-4">
          <div className="text-sm font-light tracking-wider">GALLERY</div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>

      {/* 메인 스크롤 갤러리 */}
      {(selectedView === "all" ||
        (selectedYear !== null && selectedSeason !== null)) && (
        <div
          ref={containerRef}
          className="w-full h-screen overflow-x-scroll overflow-y-hidden whitespace-nowrap cursor-grab active:cursor-grabbing scrollbar-hide pt-16"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => {
            setIsDragging(true);
            setStartX(e.touches[0].clientX);
            setScrollLeft(containerRef.current?.scrollLeft || 0);
          }}
          onTouchMove={(e) => {
            if (!isDragging) return;
            const x = e.touches[0].clientX;
            const walk = (x - startX) * 2;
            if (containerRef.current) {
              containerRef.current.scrollLeft = scrollLeft - walk;
            }
          }}
          onTouchEnd={() => setIsDragging(false)}
        >
          <div className="inline-flex gap-3 p-4 h-full items-center">
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative h-[85vh] aspect-[3/4] rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 50vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 연도별 썸네일 그리드 (Years 초기 뷰) */}
      {selectedYear === null &&
        selectedSeason === null &&
        selectedView === "years" && (
          <div className="w-full min-h-screen pt-16 px-4">
            <div className="grid grid-cols-2 gap-3">
              {yearThumbnails.map((item) => (
                <motion.div
                  key={item.year}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedYear(item.year)}
                >
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={`${item.year}년 사진`}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xl font-semibold text-white">
                        {item.year}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      {/* 선택된 연도의 계절별 썸네일 그리드 (Years 뷰) */}
      {selectedYear !== null &&
        selectedSeason === null &&
        selectedView === "years" && (
          <div className="w-full min-h-screen p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {yearSeasonThumbnails.map((item) => (
                <motion.div
                  key={item.id}
                  className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedSeason(item.id)}
                >
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={`${item.name} 사진`}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="absolute bottom-6 left-6">
                      <span className="text-2xl font-semibold text-white">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      {/* 계절별 썸네일 그리드 (Seasons 초기 뷰) */}
      {selectedSeason === null && selectedView === "seasons" && (
        <div className="w-full min-h-screen pt-16 px-4">
          <div className="grid grid-cols-2 gap-3">
            {seasonThumbnails.map((item) => {
              if (!item.hasImages) return null;

              return (
                <motion.div
                  key={item.id}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedSeason(item.id)}
                >
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={`${item.name} 사진`}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xl font-semibold text-white">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 선택된 계절의 연도별 썸네일 그리드 (Seasons 뷰) */}
      {selectedSeason !== null &&
        selectedYear === null &&
        selectedView === "seasons" && (
          <div className="w-full min-h-screen p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {seasonYearThumbnails.map((item) => (
                <motion.div
                  key={item.year}
                  className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedYear(item.year)}
                >
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt={`${item.year}년 사진`}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
                    <div className="absolute bottom-6 left-6">
                      <span className="text-2xl font-semibold text-white">
                        {item.year}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      {/* 필터 메뉴 */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-10">
        <div className="bg-[#4A4A4A] bg-opacity-80 backdrop-blur-md rounded-full px-4 py-2.5 flex gap-2 max-w-sm mx-auto">
          <button
            onClick={() => {
              setSelectedYear(null);
              setSelectedSeason(null);
              setSelectedView("all");
            }}
            className={`flex-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
              selectedView === "all"
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setSelectedYear(null);
              setSelectedSeason(null);
              setSelectedView("years");
            }}
            className={`flex-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
              selectedView === "years"
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            Years
          </button>
          <button
            onClick={() => {
              setSelectedYear(null);
              setSelectedSeason(null);
              setSelectedView("seasons");
            }}
            className={`flex-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
              selectedView === "seasons"
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            Seasons
          </button>
        </div>
      </div>

      {/* 전체화면 뷰어 */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <span className="text-lg">×</span>
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={filteredImages[selectedImage].src}
                  alt={filteredImages[selectedImage].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
