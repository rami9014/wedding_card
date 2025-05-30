"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";

interface MapProps {
  latitude: number;
  longitude: number;
  address: string;
}

function MapComponent({ latitude, longitude, address }: MapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (container) {
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(latitude, longitude),
          });
          marker.setMap(map);
          setMapLoaded(true);
        }
      });
    };

    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  }, [latitude, longitude]);

  return (
    <div className="w-full" suppressHydrationWarning={true}>
      <div id="map" className="w-full h-[500px] rounded-lg shadow-md" />
      <div className="mt-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">{address}</p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
  );
}

export default dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full">
      <div className="w-full h-[500px] rounded-lg shadow-md bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">지도 로딩 중...</p>
      </div>
    </div>
  ),
});
