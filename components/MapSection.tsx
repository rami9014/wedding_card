import Map from "@/components/Map";

interface MapSectionProps {
  title?: string;
}

export default function MapSection({ title = "LOCATION" }: MapSectionProps) {
  return (
    <section
      className="w-full py-12 sm:py-16 bg-gray-50"
      suppressHydrationWarning={true}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-serif text-center mb-6 sm:mb-8">
          {title}
        </h2>
        <Map
          latitude={37.5347454}
          longitude={126.9006169}
          address="서울특별시 영등포구 양평로 58, 당산 그랜드컨벤션센터"
        />
      </div>
    </section>
  );
}
