"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"all" | "years" | "seasons">("all");

  const years = useMemo(
    () => Array.from(new Set(images.map((img) => img.year))).sort((a, b) => b - a),
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
      const yearImage = images.find((img) => img.year === year);
      return {
        year,
        thumbnail: yearImage?.src,
        hasImages: !!yearImage,
      };
    });
  }, [years, images]);

  const seasonThumbnails = useMemo(() => {
    return seasons.map((season) => {
      const seasonImage = images.find((img) => img.season === season.id);
      return {
        ...season,
        thumbnail: seasonImage?.src,
        hasImages: !!seasonImage,
      };
    });
  }, [images]);

  return (
    <div className="w-full h-screen bg-black text-white relative">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-md">
        <div className="flex justify-between items-center px-4 py-4">
          <div className="text-sm font-light tracking-wider">GALLERY</div>
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>

      {/* 이미지 Swiper */}
      {(selectedView === "all" || (selectedYear && selectedSeason)) && (
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          mousewheel
          className="h-screen pt-16"
        >
          {filteredImages.map((img, i) => (
            <SwiperSlide key={i}  className="flex items-center justify-center h-screen">
              <div className="relative w-full h-full">
                <Image src={img.src} alt={img.alt} fill className="object-contain h-full w-auto mx-auto" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* 연도/계절 썸네일 */}
      {selectedView === "years" && !selectedYear && (
        <div className="grid grid-cols-2 gap-4 px-4 pt-20">
          {yearThumbnails.map((item) => (
            <div
              key={item.year}
              className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedYear(item.year)}
            >
              {item.thumbnail && (
                <Image src={item.thumbnail} alt={String(item.year)} fill   className="object-contain h-full w-auto mx-auto" />
              )}
              <div className="absolute bottom-4 left-4 text-white text-xl font-bold">
                {item.year}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedView === "seasons" && !selectedSeason && (
        <div className="grid grid-cols-2 gap-4 px-4 pt-20">
          {seasonThumbnails.map((item) => (
            <div
              key={item.id}
              className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedSeason(item.id)}
            >
              {item.thumbnail && (
                <Image src={item.thumbnail} alt={item.name} fill className="object-contain h-full w-auto mx-auto" />
              )}
              <div className="absolute bottom-4 left-4 text-white text-xl font-bold">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 필터 메뉴 */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-30">
        <div className="bg-[#4A4A4A] bg-opacity-80 backdrop-blur-md rounded-full px-4 py-2.5 flex gap-2 max-w-sm mx-auto">
          {[
            { label: "All", key: "all" },
            { label: "Years", key: "years" },
            { label: "Seasons", key: "seasons" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setSelectedView(btn.key as any);
                setSelectedYear(null);
                setSelectedSeason(null);
              }}
              className={`flex-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
                selectedView === btn.key ? "bg-white text-black" : "text-white hover:bg-white/10"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
