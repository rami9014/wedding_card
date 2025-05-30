import Map from "@/components/Map";

interface MapSectionProps {
  title: string;
  titleClassName?: string;
}

export default function MapSection({
  title,
  titleClassName = "text-xl sm:text-2xl font-light",
}: MapSectionProps) {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className={`text-center mb-6 sm:mb-8 ${titleClassName}`}>
          {title}
        </h2>
        <div className="h-[400px] relative">
          <Map
            latitude={37.5266}
            longitude={126.8961}
            address="서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터"
          />
        </div>
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://map.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#2DB400] text-white text-center py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              네이버 지도
            </a>
            <a
              href="https://map.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FEE500] text-black text-center py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              카카오 지도
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
