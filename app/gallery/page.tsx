"use client";

import VisionGallery from "@/components/VisionGallery";

// 갤러리 이미지 목록
const galleryImages = [
  // 2023 봄 (4월~5월)
  {
    src: "/gallery/image1.jpg",
    alt: "웨딩 사진 1",
    year: 2023,
    season: "spring",
    seasonKr: "봄",
  },
  {
    src: "/gallery/image2.jpg",
    alt: "웨딩 사진 2",
    year: 2023,
    season: "spring",
    seasonKr: "봄",
  },
  {
    src: "/gallery/image3.jpg",
    alt: "웨딩 사진 3",
    year: 2023,
    season: "spring",
    seasonKr: "봄",
  },

  // 2023 여름 (6월~8월)
  {
    src: "/gallery/image4.jpg",
    alt: "웨딩 사진 4",
    year: 2023,
    season: "summer",
    seasonKr: "여름",
  },
  {
    src: "/gallery/image5.jpg",
    alt: "웨딩 사진 5",
    year: 2023,
    season: "summer",
    seasonKr: "여름",
  },
  {
    src: "/gallery/image6.jpg",
    alt: "웨딩 사진 6",
    year: 2023,
    season: "summer",
    seasonKr: "여름",
  },
  {
    src: "/gallery/image7.jpg",
    alt: "웨딩 사진 7",
    year: 2023,
    season: "summer",
    seasonKr: "여름",
  },

  // 2023 가을 (9월~11월)
  {
    src: "/gallery/image8.jpg",
    alt: "웨딩 사진 8",
    year: 2023,
    season: "autumn",
    seasonKr: "가을",
  },
  {
    src: "/gallery/image9.jpg",
    alt: "웨딩 사진 9",
    year: 2023,
    season: "autumn",
    seasonKr: "가을",
  },
  {
    src: "/gallery/image10.jpg",
    alt: "웨딩 사진 10",
    year: 2023,
    season: "autumn",
    seasonKr: "가을",
  },
  {
    src: "/gallery/image11.jpg",
    alt: "웨딩 사진 11",
    year: 2023,
    season: "autumn",
    seasonKr: "가을",
  },

  // 2023 겨울 (12월)
  {
    src: "/gallery/image12.jpg",
    alt: "웨딩 사진 12",
    year: 2023,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image13.jpg",
    alt: "웨딩 사진 13",
    year: 2023,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image14.jpg",
    alt: "웨딩 사진 14",
    year: 2023,
    season: "winter",
    seasonKr: "겨울",
  },

  // 2024 겨울 (1월~2월)
  {
    src: "/gallery/image15.jpg",
    alt: "웨딩 사진 15",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image16.jpg",
    alt: "웨딩 사진 16",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image17.jpg",
    alt: "웨딩 사진 17",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image18.jpg",
    alt: "웨딩 사진 18",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image19.jpg",
    alt: "웨딩 사진 19",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image20.jpg",
    alt: "웨딩 사진 20",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image21.jpg",
    alt: "웨딩 사진 21",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image22.jpg",
    alt: "웨딩 사진 22",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image23.jpg",
    alt: "웨딩 사진 23",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
  {
    src: "/gallery/image24.jpg",
    alt: "웨딩 사진 24",
    year: 2024,
    season: "winter",
    seasonKr: "겨울",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      <VisionGallery images={galleryImages} />
    </main>
  );
}
