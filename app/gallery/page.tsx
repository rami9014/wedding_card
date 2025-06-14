"use client";

import { galleryImages } from "@/components/Images";
import VisionGallery from "@/components/VisionGallery";

// 갤러리 이미지 목록

// 썸네일 설정 - 원하는 이미지를 썸네일로 지정
const thumbnailConfig = {
  // 연도별 썸네일 설정
  years: {
    2023: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image5.jpg", // 여름 이미지를 2023년 썸네일로
    2024: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image20.jpg", // 봄 마지막 이미지를 2024년 썸네일로
    2025: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image15.jpg", // 여름 이미지를 2025년 썸네일로
  },
  // 계절별 썸네일 설정
  seasons: {
    spring: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image3.jpg", // 봄의 3번째 이미지
    summer: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image7.jpg", // 여름의 3번째 이미지
    autumn: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image11.jpg", // 가을의 3번째 이미지
    winter: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image15.jpg", // 겨울의 3번째 이미지
  },
};

export default function GalleryPage() {
  // mainImages를 VisionGallery에서 사용할 수 있는 형태로 변환

  return (
    <main className="min-h-screen">
      <VisionGallery images={galleryImages} thumbnailConfig={thumbnailConfig} />
    </main>
  );
}
