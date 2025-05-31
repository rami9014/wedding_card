"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface MapProps {
  latitude: number;
  longitude: number;
  address: string;
}

function MapComponent({ latitude, longitude, address }: MapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // 카카오 맵 API 키 확인
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

    if (!apiKey || apiKey === "YOUR_KAKAO_MAP_API_KEY_HERE") {
      // API 키가 없으면 에러 상태로 설정하지 않고 대체 UI 표시
      setMapError(null);
      return;
    }

    // 이미 카카오 맵이 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;

    const onLoadKakaoMap = () => {
      try {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      } catch (error) {
        console.error("카카오 맵 로딩 오류:", error);
        setMapError("지도를 불러오는 중 오류가 발생했습니다.");
      }
    };

    const onErrorKakaoMap = () => {
      console.error("카카오 맵 스크립트 로딩 실패");
      setMapError("지도 스크립트를 불러올 수 없습니다.");
    };

    mapScript.addEventListener("load", onLoadKakaoMap);
    mapScript.addEventListener("error", onErrorKakaoMap);

    document.head.appendChild(mapScript);

    return () => {
      mapScript.removeEventListener("load", onLoadKakaoMap);
      mapScript.removeEventListener("error", onErrorKakaoMap);
    };
  }, [latitude, longitude]);

  const initializeMap = () => {
    try {
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
        setMapError(null);
      }
    } catch (error) {
      console.error("지도 초기화 오류:", error);
      setMapError("지도를 초기화할 수 없습니다.");
    }
  };

  // API 키가 없거나 에러가 있을 때 대체 UI 표시
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  if (!apiKey || apiKey === "YOUR_KAKAO_MAP_API_KEY_HERE" || mapError) {
    return (
      <div className="w-full" suppressHydrationWarning={true}>
        <div className="w-full h-[500px] rounded-lg shadow-md bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-6">
            {/* 위치 아이콘 */}
            <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                오시는 길
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{address}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(
                  address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#2DB400] text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
                네이버 지도
              </a>
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(
                  address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#FEE500] text-black py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
                카카오 지도
              </a>
            </div>

            {/* 교통 정보 */}
            <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-800 mb-3">
                교통 안내
              </h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start">
                  <span className="inline-block w-12 text-blue-600 font-medium">
                    지하철
                  </span>
                  <span>9호선 당산역 4번 출구 도보 5분</span>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-12 text-green-600 font-medium">
                    버스
                  </span>
                  <span>당산역 정류장 하차</span>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-12 text-purple-600 font-medium">
                    주차
                  </span>
                  <span>건물 내 주차장 이용 가능</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" suppressHydrationWarning={true}>
      <div id="map" className="w-full h-[500px] rounded-lg shadow-md" />
      <div className="mt-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">{address}</p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`https://map.naver.com/v5/search/${encodeURIComponent(
              address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#2DB400] text-white text-center py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            네이버 지도에서 보기
          </a>
          <a
            href={`https://map.kakao.com/link/search/${encodeURIComponent(
              address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#FEE500] text-black text-center py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            카카오 지도에서 보기
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-500">지도 로딩 중...</p>
        </div>
      </div>
    </div>
  ),
});
