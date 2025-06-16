"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Virtual } from "swiper/modules";
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/virtual";
import SwipeVerticalIcon from "@mui/icons-material/SwipeVertical";
interface GalleryImage {
  src: string;
  alt: string;
  year: number;
  season: string;
  seasonKr: string;
}

interface ThumbnailConfig {
  years: Record<number, string>;
  seasons: Record<string, string>;
}

interface VisionGalleryProps {
  images: any[];
  thumbnailConfig?: ThumbnailConfig;
}

export default function VisionGallery({
  images,
  thumbnailConfig,
}: VisionGalleryProps) {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"all" | "years" | "seasons">(
    "all"
  );
  const [showSwipeGuide, setShowSwipeGuide] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isMobileChrome, setIsMobileChrome] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // 브라우저 감지 및 스크롤 초기화
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    const isChrome = /chrome/i.test(userAgent) && !/edg/i.test(userAgent);

    setIsMobileChrome(isMobile && isChrome);

    // 페이지 로드 시 스크롤을 최상단으로 설정
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // Safari용 추가
    document.documentElement.scrollTop = 0; // IE/Edge용 추가
  }, []);

  // 3초 후 자동으로 가이드 숨기기
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeGuide(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (selectedYear && selectedSeason) {
        return img.year === selectedYear && img.season === selectedSeason;
      }
      if (selectedYear) return img.year === selectedYear;
      if (selectedSeason) return img.season === selectedSeason;
      return true;
    });
  }, [images, selectedYear, selectedSeason]);

  const yearThumbnails = useMemo(() => {
    return years.map((year) => {
      const configuredThumbnail = thumbnailConfig?.years[year];
      const yearImage = configuredThumbnail
        ? { src: configuredThumbnail }
        : images.find((img) => img.year === year);

      return {
        year,
        thumbnail: yearImage?.src,
        hasImages: !!yearImage,
      };
    });
  }, [years, images, thumbnailConfig]);

  const seasonThumbnails = useMemo(() => {
    return seasons.map((season) => {
      const configuredThumbnail = thumbnailConfig?.seasons[season.id];
      const seasonImage = configuredThumbnail
        ? { src: configuredThumbnail }
        : images.find((img) => img.season === season.id);

      return {
        ...season,
        thumbnail: seasonImage?.src,
        hasImages: !!seasonImage,
      };
    });
  }, [images, thumbnailConfig]);

  return (
    <div
      className="w-full h-screen bg-black text-white relative"
      style={{ height: "100dvh" }}
    >
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center px-4 py-2 relative">
          {/* 뒤로가기 버튼 */}
          {selectedYear || selectedSeason ? (
            <button
              onClick={() => {
                if (selectedSeason) {
                  setSelectedSeason(null);
                } else if (selectedYear) {
                  setSelectedYear(null);
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-sm transition-colors"
            >
              ←
            </button>
          ) : (
            <div className="px-3 py-1.5 text-sm opacity-0 pointer-events-none">
              ←
            </div>
          )}

          <div className="bg-[#4A4A4A] bg-opacity-80 backdrop-blur-md rounded-full px-3 py-1.5 flex gap-1 absolute left-1/2 transform -translate-x-1/2">
            {[
              { label: "All", key: "all" },
              { label: "연도", key: "years" },
              { label: "계절", key: "seasons" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => {
                  setSelectedView(btn.key as any);
                  setSelectedYear(null);
                  setSelectedSeason(null);
                  setCurrentSlideIndex(0);
                  swiperInstance?.slideTo(0);
                }}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedView === btn.key
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div className="absolute right-4">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
      </div>

      {/* 이미지 Swiper */}
      {(selectedView === "all" ||
        (selectedView === "years" && selectedYear && selectedSeason) ||
        (selectedView === "seasons" && selectedSeason && selectedYear)) && (
        <>
          {/* 스와이프 가이드 */}
          {showSwipeGuide && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-6 animate-pulse">
                {/* 스와이프 아이콘 */}
                <div className="flex items-center justify-center animate-bounce">
                  <SwipeVerticalIcon
                    sx={{
                      fontSize: 120,
                      color: "white",
                      filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
                    }}
                  />
                </div>

                {/* 스와이프 텍스트 */}
                <div className="text-white text-lg font-medium bg-black/70 px-6 py-3 rounded-full backdrop-blur-md border border-white/20">
                  위아래로 스와이프하세요
                </div>
              </div>
            </div>
          )}

          <div className="flex h-screen">
            {/* 메인 이미지 영역 */}
            <div className="flex-1 w-full">
              <Swiper
                direction="vertical"
                slidesPerView={1}
                spaceBetween={0}
                mousewheel
                virtual={{
                  enabled: true,
                  addSlidesAfter: 3,
                  addSlidesBefore: 3,
                  cache: true,
                }}
                zoom={{
                  maxRatio: 10,
                  minRatio: 1,
                  toggle: true,
                }}
                touchRatio={1}
                touchAngle={45}
                resistance={true}
                resistanceRatio={0.85}
                touchStartPreventDefault={false}
                touchMoveStopPropagation={false}
                modules={[Zoom, Virtual]}
                className={isMobileChrome ? "h-full -mt-8 md:mt-0" : "h-full"}
                style={
                  isMobileChrome
                    ? {}
                    : {
                        height: "100dvh",
                        marginTop: "-2dvh",
                      }
                }
                onSlideChange={(swiper) => {
                  setShowSwipeGuide(false);
                  setCurrentSlideIndex(swiper.activeIndex);
                  scrollToThumbnail(swiper.activeIndex);
                }}
                onTouchStart={() => setShowSwipeGuide(false)}
                onSwiper={setSwiperInstance}
              >
                {filteredImages.map((img, i) => (
                  <SwiperSlide
                    key={i}
                    virtualIndex={i}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="swiper-zoom-container relative w-full h-full flex items-center justify-center">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={1920}
                        height={1080}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        className="object-contain max-h-full max-w-full"
                        loading="lazy"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 하단 썸네일 영역 - 모든 화면용 */}
            <div className="absolute bottom-0 left-0 right-0 h-20 z-10 mt-1">
              <div
                ref={thumbnailContainerRef}
                className="p-2 h-full overflow-x-auto cursor-grab select-none"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setStartX(e.pageX - e.currentTarget.offsetLeft);
                  setScrollLeft(e.currentTarget.scrollLeft);
                }}
                onMouseMove={(e) => {
                  if (!isDragging) return;
                  e.preventDefault();
                  const x = e.pageX - e.currentTarget.offsetLeft;
                  const walk = (x - startX) * 2;
                  e.currentTarget.scrollLeft = scrollLeft - walk;
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="flex gap-2 h-full">
                  {filteredImages.map((img, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square h-full flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                        currentSlideIndex === index
                          ? "ring-2 ring-white shadow-lg transform scale-105"
                          : "ring-1 ring-white/20 hover:ring-white/40"
                      }`}
                      onClick={() => swiperInstance?.slideTo(index)}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                      {currentSlideIndex === index && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 연도 썸네일 */}
      {selectedView === "years" && !selectedYear && (
        <div className="h-screen pt-16">
          {/* 세로가 긴 화면: 세로 3등분 (1열 3행) */}
          <div className="h-full w-full portrait:flex portrait:flex-col portrait:gap-1 portrait:px-1 landscape:hidden">
            {yearThumbnails.map((item) => (
              <div
                key={item.year}
                className="relative flex-1 rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300"
                onClick={() => {
                  setSelectedYear(item.year);
                }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={String(item.year)}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                  {item.year}
                </div>
              </div>
            ))}
          </div>

          {/* 가로가 긴 화면: 가로 3등분 (3열 1행) */}
          <div className="h-full w-full landscape:flex landscape:gap-1 landscape:px-1 portrait:hidden">
            {yearThumbnails.map((item) => (
              <div
                key={item.year}
                className="relative flex-1 rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300"
                onClick={() => {
                  setSelectedYear(item.year);
                }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={String(item.year)}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                  {item.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 연도 선택 후 계절 선택 */}
      {selectedView === "years" && selectedYear && !selectedSeason && (
        <div className="h-screen pt-16">
          {/* 해당 연도의 계절별 썸네일 */}
          <div className="h-full w-full portrait:grid portrait:grid-cols-2 portrait:grid-rows-2 portrait:gap-3 portrait:px-3 landscape:hidden">
            {seasons.map((season) => {
              const seasonImage = filteredImages.find(
                (img) => img.season === season.id
              );
              return (
                <div
                  key={season.id}
                  className={`relative rounded-lg overflow-hidden transition-transform duration-300 ${
                    seasonImage
                      ? "cursor-pointer group hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => seasonImage && setSelectedSeason(season.id)}
                >
                  {seasonImage && (
                    <Image
                      src={seasonImage.src}
                      alt={`${selectedYear}년 ${season.name}`}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                    {season.name}
                  </div>
                  {!seasonImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400 text-sm">이미지 없음</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="h-full w-full landscape:flex landscape:gap-3 landscape:px-3 portrait:hidden">
            {seasons.map((season) => {
              const seasonImage = filteredImages.find(
                (img) => img.season === season.id
              );
              return (
                <div
                  key={season.id}
                  className={`relative flex-1 rounded-lg overflow-hidden transition-transform duration-300 ${
                    seasonImage
                      ? "cursor-pointer group hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => seasonImage && setSelectedSeason(season.id)}
                >
                  {seasonImage && (
                    <Image
                      src={seasonImage.src}
                      alt={`${selectedYear}년 ${season.name}`}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                    {season.name}
                  </div>
                  {!seasonImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400 text-sm">이미지 없음</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 계절 썸네일 */}
      {selectedView === "seasons" && !selectedSeason && (
        <div className="h-screen pt-16">
          {/* 세로가 긴 화면: 2x2 그리드 */}
          <div className="h-full w-full portrait:grid portrait:grid-cols-2 portrait:grid-rows-2 portrait:gap-3 portrait:px-3 landscape:hidden">
            {seasonThumbnails.map((item) => (
              <div
                key={item.id}
                className="relative rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300"
                onClick={() => {
                  setSelectedSeason(item.id);
                }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          {/* 가로가 긴 화면: 가로 4등분 (4열 1행) */}
          <div className="h-full w-full landscape:flex landscape:gap-3 landscape:px-3 portrait:hidden">
            {seasonThumbnails.map((item) => (
              <div
                key={item.id}
                className="relative flex-1 rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300"
                onClick={() => {
                  setSelectedSeason(item.id);
                }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 계절 선택 후 연도 선택 */}
      {selectedView === "seasons" && selectedSeason && !selectedYear && (
        <div className="h-screen pt-16">
          {/* 해당 계절의 연도별 썸네일 */}
          <div className="h-full w-full portrait:flex portrait:flex-col portrait:gap-1 portrait:px-1 landscape:hidden">
            {years.map((year) => {
              const yearImage = images.find(
                (img) => img.season === selectedSeason && img.year === year
              );
              return (
                <div
                  key={year}
                  className={`relative flex-1 rounded-lg overflow-hidden transition-transform duration-300 ${
                    yearImage
                      ? "cursor-pointer group hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => yearImage && setSelectedYear(year)}
                >
                  {yearImage && (
                    <Image
                      src={yearImage.src}
                      alt={`${year}년 ${
                        seasons.find((s) => s.id === selectedSeason)?.name
                      }`}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                    {year}
                  </div>
                  {!yearImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400 text-sm">이미지 없음</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="h-full w-full landscape:flex landscape:gap-1 landscape:px-1 portrait:hidden">
            {years.map((year) => {
              const yearImage = images.find(
                (img) => img.season === selectedSeason && img.year === year
              );
              return (
                <div
                  key={year}
                  className={`relative flex-1 rounded-lg overflow-hidden transition-transform duration-300 ${
                    yearImage
                      ? "cursor-pointer group hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => yearImage && setSelectedYear(year)}
                >
                  {yearImage && (
                    <Image
                      src={yearImage.src}
                      alt={`${year}년 ${
                        seasons.find((s) => s.id === selectedSeason)?.name
                      }`}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow-lg">
                    {year}
                  </div>
                  {!yearImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400 text-sm">이미지 없음</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
