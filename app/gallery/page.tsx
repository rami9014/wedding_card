"use client";

import { galleryImages, mainImages } from "@/components/Images";
import VisionGallery from "@/components/VisionGallery";

// Fisher-Yates 셔플 알고리즘
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 갤러리 이미지 목록

// 썸네일 설정 - 원하는 이미지를 썸네일로 지정
const thumbnailConfig = {
  // 연도별 썸네일 설정
  years: {
    2023: "https://d11ay48rmhjgmh.cloudfront.net/wedding/o_35.jpg", // 여름 이미지를 2023년 썸네일로
    2024: "https://d11ay48rmhjgmh.cloudfront.net/wedding/o_2.jpg", // 봄 마지막 이미지를 2024년 썸네일로
    2025: "https://d11ay48rmhjgmh.cloudfront.net/wedding/s_3.jpg", // 여름 이미지를 2025년 썸네일로
  },
  // 계절별 썸네일 설정
  seasons: {
    spring: "https://d11ay48rmhjgmh.cloudfront.net/wedding/m_37.jpg", // 봄의 3번째 이미지
    summer: "https://d11ay48rmhjgmh.cloudfront.net/wedding/o_4.jpg", // 여름의 3번째 이미지
    autumn: "https://d11ay48rmhjgmh.cloudfront.net/wedding/t_36.jpg", // 가을의 3번째 이미지
    winter: "https://d11ay48rmhjgmh.cloudfront.net/wedding/g_8.jpg", // 겨울의 3번째 이미지
  },
};

export default function GalleryPage() {
  // 이미지 배열을 합치고 랜덤하게 섞기
  const images = shuffleArray([...galleryImages, ...mainImages]);

  return (
    <main className="min-h-screen">
      <VisionGallery images={images} thumbnailConfig={thumbnailConfig} />
    </main>
  );
}
