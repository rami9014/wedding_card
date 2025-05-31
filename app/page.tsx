"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Map from "@/components/Map";
import Gallery from "@/components/Gallery";
import Link from "next/link";
import MapSection from "@/components/MapSection";
import PhotoUploadButton from "@/components/PhotoUploadButton";
import WeddingLiveButton from "@/components/WeddingLiveButton";
import PhotoUploadModal from "@/components/PhotoUploadModal";
import UploadedPhotosGallery from "@/components/UploadedPhotosGallery";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dynamic from "next/dynamic";

// dayjs 플러그인 로드
dayjs.extend(utc);
dayjs.extend(timezone);

// 갤러리 이미지 목록
const galleryImages = [
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image1.jpg",
    alt: "웨딩 사진 1",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image2.jpg",
    alt: "웨딩 사진 2",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image3.jpg",
    alt: "웨딩 사진 3",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image4.jpg",
    alt: "웨딩 사진 4",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image5.jpg",
    alt: "웨딩 사진 5",
  },
  {
    src: "https://d11ay48rmhjgmh.cloudfront.net/wedding/image6.jpg",
    alt: "웨딩 사진 6",
  },
];

// 결혼식 날짜 설정
const WEDDING_DATE = dayjs.tz("2025-05-19 11:30", "Asia/Seoul");

function HomeComponent() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceInfo, setAttendanceInfo] = useState({
    name: "",
    phone: "",
    willAttend: null as boolean | null,
  });
  const [mounted, setMounted] = useState(false);
  const [isWeddingTime, setIsWeddingTime] = useState(false);

  // 사진 업로드 관련 훅 사용
  const {
    showUploadModal,
    setShowUploadModal,
    selectedFiles,
    isUploading,
    uploadedPhotos,
    isLoadingPhotos,
    handlePhotoUpload,
    handleFileSelect,
    removeFile,
    closeModal,
  } = usePhotoUpload(isWeddingTime);

  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const difference = WEDDING_DATE.diff(now, "ms");

      // 결혼식 시간 체크 (7월 19일 오전 11시 30분)
      // setIsWeddingTime(now.isAfter(WEDDING_DATE));
      setIsWeddingTime(true); // 테스트용

      if (difference > 0) {
        const days = WEDDING_DATE.diff(now, "day");
        const hours = WEDDING_DATE.diff(now, "hour") % 24;
        const minutes = WEDDING_DATE.diff(now, "minute") % 60;

        setTimeLeft({ days, hours, minutes });
      }
    };

    // 초기 계산
    calculateTimeLeft();

    // 1분마다 업데이트
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

  // 참석 여부 체크 모달 관리 - 클라이언트에서만 실행
  useEffect(() => {
    if (!mounted) return; // 마운트되기 전에는 실행하지 않음

    const hasCheckedAttendance = localStorage.getItem("hasCheckedAttendance");

    // 기존 참석 정보가 있으면 불러오기
    const savedAttendanceInfo = localStorage.getItem("attendanceInfo");
    const savedName = localStorage.getItem("attendeeName");
    const savedPhone = localStorage.getItem("attendeePhone");

    if (savedAttendanceInfo) {
      try {
        const parsedInfo = JSON.parse(savedAttendanceInfo);
        setAttendanceInfo(parsedInfo);
      } catch (error) {
        console.log("저장된 참석 정보 파싱 실패:", error);
      }
    } else if (savedName) {
      // 이전 버전 호환성을 위해 개별 저장된 정보도 확인
      setAttendanceInfo((prev) => ({
        ...prev,
        name: savedName,
        phone: savedPhone || "",
      }));
    }

    if (!hasCheckedAttendance) {
      // 페이지 로드 후 1초 뒤에 모달 표시
      setTimeout(() => {
        setShowAttendanceModal(true);
      }, 1000);
    }
  }, [mounted]);

  // 결혼식 후 자동으로 업로드 모달 표시
  useEffect(() => {
    if (mounted && isWeddingTime) {
      const hasCheckedAttendance = localStorage.getItem("hasCheckedAttendance");
      if (hasCheckedAttendance) {
        const timer = setTimeout(() => {
          setShowUploadModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [mounted, isWeddingTime]);

  const handleAttendanceSubmit = async (
    submissionData?: typeof attendanceInfo
  ) => {
    const dataToSubmit = submissionData || attendanceInfo;

    if (dataToSubmit.willAttend !== null) {
      // Device ID 생성 (강화된 브라우저 fingerprint 기반)
      const generateDeviceId = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx!.textBaseline = "top";
        ctx!.font = "14px Arial";
        ctx!.fillText("Device fingerprint", 2, 2);

        // 추가 브라우저 정보 수집
        const getAdditionalFingerprint = () => {
          const additional = [];

          // 플랫폼 정보
          additional.push(navigator.platform || "unknown");

          // 하드웨어 동시성 (CPU 코어 수)
          additional.push(navigator.hardwareConcurrency || "unknown");

          // 메모리 정보 (있는 경우)
          additional.push((navigator as any).deviceMemory || "unknown");

          // 색상 깊이
          additional.push(screen.colorDepth || "unknown");

          // 픽셀 비율
          additional.push(window.devicePixelRatio || "unknown");

          // 사용 가능한 화면 크기
          additional.push(`${screen.availWidth}x${screen.availHeight}`);

          // 브라우저 플러그인 수 (있는 경우)
          additional.push(navigator.plugins?.length || "unknown");

          // 터치 지원 여부
          additional.push("ontouchstart" in window ? "touch" : "no-touch");

          // WebGL 정보
          try {
            const gl =
              canvas.getContext("webgl") ||
              canvas.getContext("experimental-webgl");
            if (gl && gl instanceof WebGLRenderingContext) {
              const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
              if (debugInfo) {
                additional.push(
                  gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "unknown"
                );
                additional.push(
                  gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ||
                    "unknown"
                );
              }
            }
          } catch (e) {
            additional.push("webgl-error");
          }

          return additional.join("|");
        };

        const fingerprint = [
          navigator.userAgent,
          navigator.language,
          screen.width + "x" + screen.height,
          new Date().getTimezoneOffset(),
          canvas.toDataURL(),
          getAdditionalFingerprint(),
          // 세션 시작 시간도 추가 (같은 세션 내에서는 동일)
          sessionStorage.getItem("sessionStart") || Date.now().toString(),
        ].join("|");

        // 세션 시작 시간 저장 (처음 방문시에만)
        if (!sessionStorage.getItem("sessionStart")) {
          sessionStorage.setItem("sessionStart", Date.now().toString());
        }

        // 간단한 해시 생성
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
          const char = fingerprint.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // 32bit 정수로 변환
        }
        return Math.abs(hash).toString(36);
      };

      const currentDeviceId = generateDeviceId();

      // 중복 참석 체크
      try {
        const checkResponse = await fetch("/api/check-duplicate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: dataToSubmit.name,
            phone: dataToSubmit.phone,
            deviceId: currentDeviceId,
          }),
        });

        if (checkResponse.ok) {
          const checkResult = await checkResponse.json();
          if (checkResult.isDuplicate) {
            const confirmSubmit = confirm(
              `이미 이 기기에서 참석 의사를 등록하셨습니다.\n그래도 다시 등록하시겠습니까?`
            );
            if (!confirmSubmit) {
              return;
            }
          }
        }
      } catch (error) {
        console.log("중복 체크 실패, 계속 진행:", error);
      }

      // Google Sheets에 데이터 전송
      try {
        const response = await fetch("/api/submit-attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp: dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
            name: dataToSubmit.name || "익명",
            phone: dataToSubmit.phone || "",
            willAttend: dataToSubmit.willAttend,
            attendCount: dataToSubmit.willAttend ? 1 : 0,
            userAgent: navigator.userAgent,
            deviceId: currentDeviceId,
          }),
        });

        if (response.ok) {
          // 로컬 스토리지에 참석 정보 저장 (이름과 전화번호 포함)
          localStorage.setItem("hasCheckedAttendance", "true");
          localStorage.setItem("attendanceInfo", JSON.stringify(dataToSubmit));
          localStorage.setItem("attendeeName", dataToSubmit.name);
          localStorage.setItem("attendeePhone", dataToSubmit.phone || "");

          setShowAttendanceModal(false);

          // 성공 메시지 표시
          alert(
            dataToSubmit.willAttend
              ? `${dataToSubmit.name}님의 참석 의사를 전달해주셔서 감사합니다! 💕`
              : `${dataToSubmit.name}님, 알려주셔서 감사합니다. 마음만으로도 충분합니다. 💝`
          );
        } else {
          throw new Error("서버 오류");
        }
      } catch (error) {
        console.error("참석 정보 전송 실패:", error);
        alert("참석 정보 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("참석 여부를 선택해주세요.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 마운트되기 전에는 아무것도 렌더링하지 않음
  if (!mounted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* 참석 여부 체크 모달 - 클라이언트에서만 표시 */}
      {mounted && showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAttendanceModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-serif mb-2">참석 여부 체크</h2>
              <p className="text-sm text-gray-600">이태호 💕 박성혜</p>
              <p className="text-xs text-gray-500 mt-2">
                2025년 07월 19일 토요일 AM 11시 30분
              </p>
              <p className="text-xs text-gray-500">당산 그랜드컨벤션센터</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 (선택사항)
                </label>
                <input
                  type="text"
                  value={attendanceInfo.name}
                  onChange={(e) =>
                    setAttendanceInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="성함을 입력해주세요 (선택사항)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연락처 (선택사항)
                </label>
                <input
                  type="tel"
                  value={attendanceInfo.phone}
                  onChange={(e) =>
                    setAttendanceInfo((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="010-0000-0000 (선택사항)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참석 여부 <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      // 불참석으로 설정하고 바로 제출
                      const updatedInfo = {
                        ...attendanceInfo,
                        willAttend: false,
                      };
                      setAttendanceInfo(updatedInfo);

                      // 바로 제출 처리
                      await handleAttendanceSubmit(updatedInfo);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      attendanceInfo.willAttend === false
                        ? "bg-gray-500 text-white border-gray-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    닫기
                  </button>
                  <button
                    onClick={async () => {
                      // 참석으로 설정하고 바로 제출
                      const updatedInfo = {
                        ...attendanceInfo,
                        willAttend: true,
                      };
                      setAttendanceInfo(updatedInfo);

                      // 바로 제출 처리
                      await handleAttendanceSubmit(updatedInfo);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      attendanceInfo.willAttend === true
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-rose-300"
                    }`}
                  >
                    참석
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-gray-500 text-center mb-4">
                  특별한날 귀하신 그 발걸음을
                  <br />
                  참석 여부로 전달해 주세요.
                  <br />
                  <span className="text-gray-400 mt-2 block">
                    익명으로도 참석 의사를 전달하실 수 있습니다.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">메인</span>
          </Link>

          <Link
            href="/minimal"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">미니멀</span>
          </Link>

          <Link
            href="/classic"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">클래식</span>
          </Link>

          <Link
            href="/exclusive"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">익스클루시브</span>
          </Link>

          <Link
            href="/magazine"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <span className="text-sm">매거진</span>
          </Link>
        </div>
      </div>

      {/* 메인 섹션 */}
      <section className="w-full min-h-screen flex flex-col items-center justify-between">
        <div className="relative w-full h-[60vh] sm:h-[70vh]">
          <Image
            src="/main-image.jpg"
            alt="이태호 ❤️ 박성혜 웨딩 이미지"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="text-center py-6 sm:py-8 px-4 relative">
          {/* D-day 카운터 */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold text-rose-500 mb-2">
                D-{timeLeft.days}
              </div>
              <div className="flex gap-3 sm:gap-4 text-gray-600">
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-semibold">
                    {timeLeft.days}
                  </span>
                  <span className="text-xs sm:text-sm">일</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-semibold">
                    {timeLeft.hours}
                  </span>
                  <span className="text-xs sm:text-sm">시간</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-semibold">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-xs sm:text-sm">분</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif mb-3 sm:mb-4">
            우리 결혼합니다
          </h1>
          <p className="text-base sm:text-lg text-gray-600">이태호 ❤️ 박성혜</p>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">
            2025년 7월 19일 토요일 오전 11시 30분
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            당산 그랜드컨벤션센터 5층
          </p>
        </div>
      </section>

      {/* 초대글 섹션 */}
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {`서로가 마주보며 다져온 사랑을
            이제 함께 한 곳을 바라보며
            걸어가고자 합니다.
            
            저희 두 사람이 사랑으로 만나
            진실과 이해로써 하나 되는 날입니다.
            
            오셔서 축복해 주시면
            감사하겠습니다.`}
          </p>
        </div>
      </section>

      {/* 갤러리 섹션 */}
      <section className="w-full py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-serif text-center mb-6 sm:mb-8">
            갤러리
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {galleryImages.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12 space-y-4">
            <a
              href="/gallery"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors text-sm sm:text-base"
            >
              <span>더 많은 사진 보기</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>

            {/* 결혼현장 보러가기 버튼 */}
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>결혼현장 보러가기</span>
            </a>

            {/* 결혼식 시간 이후 사진 업로드 버튼 */}
            {isWeddingTime && (
              <PhotoUploadButton
                isWeddingTime={isWeddingTime}
                onUploadClick={() => setShowUploadModal(true)}
              />
            )}
          </div>
        </div>
      </section>

      {/* 우리의 이야기 섹션 */}
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-serif text-center mb-3 sm:mb-4">
            Our Story
          </h2>
          <p className="text-gray-500 text-center mb-8 sm:mb-12 font-light text-sm sm:text-base">
            태호와 성혜의 설레는 이야기
          </p>
          <div className="space-y-8 sm:space-y-12">
            {/* 첫 번째 질문 */}
            <div className="bg-neutral-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg font-medium text-rose-500 mb-4 sm:mb-6">
                첫 만남의 설렘이 아직도 생생해요 💝
              </p>
              <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {`2022년 여름, 공통 친구의 소개로 처음 만났어요.
                    카페에서 마주 앉아 이야기를 나누는데, 성혜가 웃을 때마다 
                    주변이 환해지는 것 같았죠. 그때의 설렘이 지금도 생생합니다.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`처음 본 순간부터 태호의 따뜻한 미소가 인상적이었어요.
                    대화를 나누면서 서로의 가치관이 잘 맞는다는 걸 느꼈고,
                    이야기를 나눌수록 시간 가는 줄 몰랐던 기억이 나요.`}
                  </p>
                </div>
              </div>
            </div>

            {/* 두 번째 질문 */}
            <div className="bg-neutral-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg font-medium text-rose-500 mb-4 sm:mb-6">
                서로가 서로에게 반한 순간들 ✨
              </p>
              <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {`성혜는 늘 긍정적이고 다정한 마음을 가졌어요.
                    힘든 순간에도 서로를 생각하며 웃을 수 있게 해주죠.
                    그런 성혜를 보면서 '이런 사람과 함께라면 어떤 어려움도 이겨낼 수 있겠다'는 
                    확신이 들었어요.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`태호는 책임감이 강하고 성실해요.
                    무엇보다 서로를 향한 믿음과 존중하는 마음이 크답니다.
                    작은 일상에서도 늘 배려하는 모습을 보여주는 태호를 보며
                    '평생 함께하고 싶다'는 마음이 커져갔어요.`}
                  </p>
                </div>
              </div>
            </div>

            {/* 세 번째 질문 */}
            <div className="bg-neutral-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg font-medium text-rose-500 mb-4 sm:mb-6">
                우리의 특별한 순간 ❤️
              </p>
              <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">태호</p>
                  <p className="whitespace-pre-line">
                    {`함께한 시간 동안의 작은 순간들이 모여 큰 확신이 되었어요.
                    퇴근 후 늦은 저녁을 함께 먹으며 나눈 대화들,
                    주말 아침 커피 한 잔을 나누며 꾸린 소소한 계획들...
                    성혜와 함께라면 어떤 미래도 행복할 거라 믿게 되었죠.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`서로를 더 깊이 이해하고 아끼는 마음이 자라날수록,
                    자연스럽게 '이 사람과 함께 나이 들어가고 싶다'는 생각이 들었어요.
                    태호와 함께 보낸 평범한 날들이 특별해지고,
                    일상의 작은 순간들이 소중한 추억이 되어갔죠.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 업로드된 사진 갤러리 섹션 */}
      <UploadedPhotosGallery
        isWeddingTime={isWeddingTime}
        uploadedPhotos={uploadedPhotos}
        isLoadingPhotos={isLoadingPhotos}
      />

      {/* 연락처 섹션 */}
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
            <div className="text-center space-y-8">
              <div>
                <p className="text-gray-600 mb-2">신랑</p>
                <p className="text-gray-800 font-medium mb-2">이태호</p>
                <a
                  href="tel:010-6226-1157"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                  aria-label="신랑에게 전화하기"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </a>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">신랑 아버지</p>
                  <p className="text-gray-800 font-medium mb-2">이인수</p>
                  <a
                    href="tel:010-6226-1157"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    aria-label="신랑 아버지께 전화하기"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">신랑 어머니</p>
                  <p className="text-gray-800 font-medium mb-2">신성림</p>
                  <a
                    href="tel:010-7777-6402"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    aria-label="신랑 어머니께 전화하기"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center space-y-8">
              <div>
                <p className="text-gray-600 mb-2">신부</p>
                <p className="text-gray-800 font-medium mb-2">박성혜</p>
                <a
                  href="tel:010-2662-5517"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                  aria-label="신부에게 전화하기"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </a>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1">신부 아버지</p>
                  <p className="text-gray-800 font-medium mb-2">박범수</p>
                  <a
                    href="tel:010-6226-1157"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    aria-label="신부 아버지께 전화하기"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">신부 어머니</p>
                  <p className="text-gray-800 font-medium mb-2">박정옥</p>
                  <a
                    href="tel:010-7777-6402"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    aria-label="신부 어머니께 전화하기"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 지도 섹션 */}
      <MapSection />

      {/* 계좌번호 섹션 */}
      <section className="w-full py-12 sm:py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-serif text-center mb-6 sm:mb-8">
            마음 전하실 곳
          </h2>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="mb-4">
              <p className="text-gray-600 mb-2 text-sm sm:text-base">
                신랑측 계좌번호
              </p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800 text-sm sm:text-base">
                  신한은행 110-452-570231
                </p>
                <button
                  onClick={() => copyToClipboard("110-452-570231")}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  복사
                </button>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2 text-sm sm:text-base">
                신부측 계좌번호
              </p>
              <div className="flex justify-between items-center">
                <p className="text-gray-800 text-sm sm:text-base">
                  국민은행 010-7777-6402
                </p>
                <button
                  onClick={() => copyToClipboard("010-7777-6402")}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  복사
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사진 업로드 모달 */}
      <PhotoUploadModal
        showModal={showUploadModal}
        onClose={closeModal}
        selectedFiles={selectedFiles}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        onRemoveFile={removeFile}
        onUpload={handlePhotoUpload}
      />
    </main>
  );
}

export default dynamic(() => Promise.resolve(HomeComponent), {
  ssr: false,
});
