"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Map from "@/components/Map";
import MapSection from "@/components/MapSection";
import PhotoUploadButton from "../../components/PhotoUploadButton";
import PhotoUploadModal from "../../components/PhotoUploadModal";
import UploadedPhotosGallery from "../../components/UploadedPhotosGallery";
import { usePhotoUpload } from "../../hooks/usePhotoUpload";
import {
  CloseIcon,
  MobileIcon,
  ArrowRightIcon,
  PhoneIcon,
  MessageIcon,
  PhoneSmallIcon,
  MessageSmallIcon,
} from "../../components/Icons";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import ContactSection from "../../components/ContactSection";
import { ToastProvider, useToast } from "@/components/Toast";

// dayjs 플러그인 로드
dayjs.extend(utc);
dayjs.extend(timezone);

// 결혼식 날짜 옵션
const WEDDING_DATE_BEFORE = dayjs.tz("2025-07-19 11:30", "Asia/Seoul");
const WEDDING_DATE_AFTER = dayjs.tz("2025-05-19 11:30", "Asia/Seoul");

// 연락처 정보
const contactData = {
  groomFamily: {
    title: "신랑",
    main: { name: "이태호", phone: "010-6226-1157" },
    father: { name: "이인수", phone: "010-6226-1157" },
    mother: { name: "신성림", phone: "010-7777-6402" },
  },
  brideFamily: {
    title: "신부",
    main: { name: "박성혜", phone: "010-2662-5517" },
    father: { name: "박범수", phone: "010-6226-1157" },
    mother: { name: "박정옥", phone: "010-7777-6402" },
  },
};

function ExclusiveComponent() {
  const [weddingDate, setWeddingDate] = useState(WEDDING_DATE_AFTER); // 기본값은 이후 날짜
  const [isWeddingTime, setIsWeddingTime] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMobileView, setIsMobileView] = React.useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceInfo, setAttendanceInfo] = useState({
    name: "",
    phone: "",
    willAttend: null as boolean | null,
  });

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

  const { showToast, showConfirm } = useToast();

  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    // 모바일 감지 함수
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg 브레이크포인트 (1024px)
    };

    // 초기 체크
    checkMobile();

    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const difference = weddingDate.diff(now, "ms");

      // 결혼식 시간 체크
      setIsWeddingTime(now.isAfter(weddingDate));

      if (difference > 0) {
        const days = weddingDate.diff(now, "day");
        const hours = weddingDate.diff(now, "hour") % 24;
        const minutes = weddingDate.diff(now, "minute") % 60;
        const seconds = weddingDate.diff(now, "second") % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    // 초기 계산
    calculateTimeLeft();

    // 1초마다 업데이트
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  // 참석 여부 체크 모달 관리 - 결혼식 이전에만 표시
  useEffect(() => {
    if (!mounted) return; // 마운트되기 전에는 실행하지 않음

    // 결혼식 이전에만 참석 여부 체크 모달 표시
    if (!isWeddingTime) {
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
    }
  }, [mounted, isWeddingTime]);

  // 결혼식 후 자동으로 업로드 모달 표시
  useEffect(() => {
    if (mounted && isWeddingTime) {
      // 결혼식 이후에는 바로 업로드 모달 표시 (참석 체크 여부와 관계없이)
      const timer = setTimeout(() => {
        setShowUploadModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, isWeddingTime, setShowUploadModal]);

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
            await new Promise<void>((resolve, reject) => {
              showConfirm(
                `앗, 이미 소중한 마음을 전해주셨네요! 💝\n혹시 내용을 수정하고 싶으시다면 다시 등록하실 수 있어요.`,
                () => {
                  resolve();
                },
                () => {
                  // 취소시 모달 닫기
                  setShowAttendanceModal(false);
                  reject(new Error("사용자가 취소했습니다"));
                }
              );
            });
          }
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "사용자가 취소했습니다"
        ) {
          return; // 사용자가 취소한 경우 함수 종료
        }
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
          showToast(
            dataToSubmit.willAttend
              ? `${dataToSubmit.name}님의 참석 의사를 전달해주셔서 감사합니다! 💕`
              : `${dataToSubmit.name}님, 알려주셔서 감사합니다. 마음만으로도 충분합니다. 💝`,
            "success"
          );
        } else {
          throw new Error("서버 오류");
        }
      } catch (error) {
        console.error("참석 정보 전송 실패:", error);
        showToast("참석 정보 전송에 실패했습니다. 다시 시도해주세요.", "error");
      }
    } else {
      showToast("참석 여부를 선택해주세요.", "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main
      className={`min-h-screen bg-white ${
        isMobileView ? "max-w-[430px] mx-auto shadow-2xl" : ""
      }`}
    >
      {/* 참석 여부 체크 모달 - 클라이언트에서만 표시 */}
      {mounted && showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAttendanceModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon className="w-6 h-6" />
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
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참석 여부 <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      // 불참석으로 설정하고 바로 제출
                      const updatedInfo = {
                        name: "익명",
                        phone: "",
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
                    불참석
                  </button>
                  <button
                    onClick={async () => {
                      // 참석으로 설정하고 바로 제출
                      const updatedInfo = {
                        name: "익명",
                        phone: "",
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
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {/* 날짜 변경 버튼들 */}
        <div className="flex flex-col gap-2 mb-4">
          <button
            onClick={() => setWeddingDate(WEDDING_DATE_BEFORE)}
            className={`px-4 py-2 rounded-full shadow-lg transition-colors flex items-center gap-2 backdrop-blur-sm text-sm ${
              weddingDate.isSame(WEDDING_DATE_BEFORE)
                ? "bg-rose-500 text-white"
                : "bg-white/80 text-black hover:bg-white/90"
            }`}
          >
            <span>결혼식 이전</span>
          </button>
          <button
            onClick={() => setWeddingDate(WEDDING_DATE_AFTER)}
            className={`px-4 py-2 rounded-full shadow-lg transition-colors flex items-center gap-2 backdrop-blur-sm text-sm ${
              weddingDate.isSame(WEDDING_DATE_AFTER)
                ? "bg-rose-500 text-white"
                : "bg-white/80 text-black hover:bg-white/90"
            }`}
          >
            <span>결혼식 이후</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="bg-white/80 text-black px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
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
            className="bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
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

        <button
          onClick={() => setIsMobileView(!isMobileView)}
          className="bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <MobileIcon className="w-5 h-5" />
          <span className="text-sm">
            {isMobileView ? "데스크톱으로 보기" : "모바일로 보기"}
          </span>
        </button>
      </div>

      {/* 헤더 섹션 */}
      <header
        className={`fixed ${
          isMobileView ? "max-w-[430px]" : "w-full"
        } top-0 left-0 right-0 z-50 px-8 py-6 bg-white/80 backdrop-blur-md ${
          isMobileView ? "left-1/2 -translate-x-1/2" : ""
        }`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase">
            Wedding
          </h1>
          <span className="text-sm font-light tracking-[0.15em]">
            2025.07.19
          </span>
        </div>
      </header>

      {/* 메인 섹션 */}
      <section className="min-h-screen pt-32 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* 왼쪽 컬럼 */}
          <div className="lg:col-span-4 space-y-8 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="aspect-[3/4] relative rounded-none overflow-hidden"
            >
              <Image
                src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image1.jpg"
                alt="웨딩 사진 1"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="aspect-square relative rounded-none overflow-hidden"
            >
              <Image
                src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image2.jpg"
                alt="웨딩 사진 2"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="py-8 border-t border-b border-gray-200">
              <div className="text-2xl font-light tracking-[0.15em] text-rose-500 mb-4">
                D-{timeLeft.days}
              </div>
              <div className="flex gap-8 text-gray-600">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-light">{timeLeft.days}</span>
                  <span className="text-xs tracking-[0.1em] mt-1">DAYS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-light">{timeLeft.hours}</span>
                  <span className="text-xs tracking-[0.1em] mt-1">HOURS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-light">{timeLeft.minutes}</span>
                  <span className="text-xs tracking-[0.1em] mt-1">MINUTES</span>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="aspect-[3/4] relative rounded-none overflow-hidden hidden lg:block"
            >
              <Image
                src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image8.jpg"
                alt="웨딩 사진 8"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* 중앙 컬럼 */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:sticky lg:top-32 space-y-12"
            >
              <div className="aspect-[3/4] relative rounded-none overflow-hidden">
                <Image
                  src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image4.jpg"
                  alt="메인 웨딩 사진"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image6.jpg"
                    alt="웨딩 사진 6"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image7.jpg"
                    alt="웨딩 사진 7"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-32 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h2 className="text-3xl lg:text-5xl font-light tracking-[0.1em] leading-tight">
                    우리의
                    <br />
                    결혼식에
                    <br />
                    초대합니다
                  </h2>
                  <div className="w-12 h-0.5 bg-gray-900" />
                  <div className="space-y-4">
                    <p className="text-base lg:text-lg text-gray-600 tracking-[0.1em]">
                      이태호 ❤️ 박성혜
                    </p>
                    <p className="text-sm lg:text-base text-gray-500 tracking-[0.05em] leading-relaxed">
                      2025년 7월 19일 토요일
                      <br />
                      오전 11시 30분
                    </p>
                    <p className="text-sm lg:text-base text-gray-500 tracking-[0.05em]">
                      당산 그랜드컨벤션센터 3층 리젠시 홀
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <Link
                  href="/gallery"
                  className="inline-flex items-center px-8 py-4 bg-black text-white hover:bg-gray-900 transition-colors text-sm tracking-[0.15em] uppercase"
                >
                  <span>View Gallery</span>
                  <ArrowRightIcon className="w-4 h-4 ml-3" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="aspect-[3/4] relative rounded-none overflow-hidden hidden lg:block"
              >
                <Image
                  src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image8.jpg"
                  alt="웨딩 사진 8"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 결혼식 시간이 되었을 때 */}
      {isWeddingTime && (
        <div className="text-center py-12 px-4">
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            소중한 순간을 함께 나누어 주세요
          </p>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <PhotoUploadButton
              isWeddingTime={isWeddingTime}
              onUploadClick={() => setShowUploadModal(true)}
            />
          </div>
        </div>
      )}

      {/* 업로드된 사진 갤러리 */}
      <UploadedPhotosGallery
        isWeddingTime={isWeddingTime}
        uploadedPhotos={uploadedPhotos}
        isLoadingPhotos={isLoadingPhotos}
      />

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
                    그때의 설렘이 지금도 생생합니다.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`처음 본 순간부터 태호의 따뜻한 미소가 인상적이었어요.`}
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
                    힘든 순간에도 서로를 생각하며 웃을 수 있게 해주죠.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`태호는 책임감이 강하고 성실해요.
                    무엇보다 서로를 향한 믿음과 존중하는 마음이 크답니다.`}
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
                    {`함께한 작은 순간들이 모여 큰 확신이 되었어요.
                    성혜와 함께라면 어떤 미래도 행복할 거라 믿게 되었죠.`}
                  </p>
                </div>
                <div className="pl-4 border-l-2 border-rose-200">
                  <p className="text-rose-500 font-medium mb-2">성혜</p>
                  <p className="whitespace-pre-line">
                    {`태호와 함께 보낸 평범한 날들이 특별해지고,
                    일상의 작은 순간들이 소중한 추억이 되어갔죠.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 매거진 스타일 갤러리 섹션 */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-20"
          >
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-light tracking-[0.2em] uppercase">
                  Our Story
                </h2>
                <p className="text-gray-500 tracking-[0.1em] uppercase text-sm">
                  The Journey of Love
                </p>
              </div>

              {/* 갤러리 이동 버튼 */}
              <div className="flex justify-center">
                <Link
                  href="/gallery"
                  className="inline-flex items-center px-6 py-3 bg-rose-500 text-white hover:bg-rose-600 transition-colors rounded-full text-sm tracking-[0.1em] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>전체 갤러리 보기</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* 조건부 렌더링 - 모바일과 데스크톱 구분 */}
            {isMobile ? (
              // 모바일 - 2열 그리드로 모든 사진 표시
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image9.jpg"
                    alt="웨딩 스토리 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image10.jpg"
                    alt="웨딩 스토리 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image11.jpg"
                    alt="웨딩 스토리 3"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image12.jpg"
                    alt="웨딩 스토리 4"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image13.jpg"
                    alt="웨딩 스토리 5"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image14.jpg"
                    alt="웨딩 스토리 6"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image15.jpg"
                    alt="웨딩 스토리 7"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image16.jpg"
                    alt="웨딩 스토리 8"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image17.jpg"
                    alt="웨딩 스토리 9"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image18.jpg"
                    alt="웨딩 스토리 10"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image19.jpg"
                    alt="웨딩 스토리 11"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image20.jpg"
                    alt="웨딩 스토리 12"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-none overflow-hidden col-span-2">
                  <Image
                    src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image3.jpg"
                    alt="웨딩 스토리 13"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              // 데스크톱 - 매거진 스타일 레이아웃
              <>
                {/* 첫 번째 행 */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-8">
                    <div className="aspect-[16/9] relative rounded-none overflow-hidden">
                      <Image
                        src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image9.jpg"
                        alt="웨딩 스토리 1"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="col-span-4 space-y-4">
                    <div className="aspect-square relative rounded-none overflow-hidden">
                      <Image
                        src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image10.jpg"
                        alt="웨딩 스토리 2"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="aspect-square relative rounded-none overflow-hidden">
                      <Image
                        src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image11.jpg"
                        alt="웨딩 스토리 3"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* 두 번째 행 */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="aspect-[3/4] relative rounded-none overflow-hidden">
                    <Image
                      src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image12.jpg"
                      alt="웨딩 스토리 4"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] relative rounded-none overflow-hidden">
                    <Image
                      src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image13.jpg"
                      alt="웨딩 스토리 5"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] relative rounded-none overflow-hidden">
                    <Image
                      src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image14.jpg"
                      alt="웨딩 스토리 6"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 세 번째 행 */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-4 space-y-4">
                    <div className="aspect-square relative rounded-none overflow-hidden">
                      <Image
                        src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image15.jpg"
                        alt="웨딩 스토리 7"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="aspect-square relative rounded-none overflow-hidden">
                      <Image
                        src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image16.jpg"
                        alt="웨딩 스토리 8"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="col-span-8">
                    <div className="aspect-square relative rounded-none overflow-hidden">
                      <Image
                        src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image17.jpg"
                        alt="웨딩 스토리 9"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* 네 번째 행 */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="aspect-square relative rounded-none overflow-hidden">
                    <Image
                      src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image18.jpg"
                      alt="웨딩 스토리 10"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative rounded-none overflow-hidden">
                    <Image
                      src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image19.jpg"
                      alt="웨딩 스토리 11"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative rounded-none overflow-hidden">
                    <Image
                      src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image20.jpg"
                      alt="웨딩 스토리 12"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-square relative rounded-none overflow-hidden">
                    <Image
                      src="https://d11ay48rmhjgmh.cloudfront.net/wedding/image3.jpg"
                      alt="웨딩 스토리 13"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="text-center mt-12">
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  더 많은 아름다운 순간들을 만나보세요
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link
                    href="/gallery"
                    className="inline-flex items-center px-6 py-3 bg-rose-500 text-white hover:bg-rose-600 transition-colors rounded-full text-sm tracking-[0.1em] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span>전체 갤러리 보기</span>
                    <ArrowRightIcon className="w-4 h-4 ml-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 연락처 섹션 */}
      <div id="contact-section">
        <ContactSection
          groomFamily={contactData.groomFamily}
          brideFamily={contactData.brideFamily}
        />
      </div>

      {/* 지도 섹션 */}
      <MapSection />

      {/* 계좌번호 섹션 */}
      <section className="py-40 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-20"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-light tracking-[0.2em] uppercase">
                Gift
              </h2>
              <p className="text-gray-500 tracking-[0.1em] uppercase text-sm">
                With Gratitude
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="bg-white p-8 space-y-4">
                <p className="text-gray-600 mb-2 tracking-[0.1em] uppercase text-sm">
                  신랑측 계좌번호
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 tracking-[0.05em]">
                    신한은행 111-455-555555
                  </p>
                  <button
                    onClick={() => copyToClipboard("111-455-555555")}
                    className="text-black hover:text-gray-600 transition-colors uppercase text-sm tracking-[0.1em]"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-2xl font-light tracking-[0.2em] uppercase">
              Taeho & Sunghye
            </p>
            <p className="text-gray-500 tracking-[0.15em] uppercase text-sm">
              19 July 2025
            </p>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}

export default function ExclusiveLayout() {
  return (
    <ToastProvider>
      <ExclusiveComponent />
    </ToastProvider>
  );
}
