"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// dayjs 플러그인 로드
dayjs.extend(utc);
dayjs.extend(timezone);

interface AttendanceData {
  timestamp: string;
  name: string;
  phone: string;
  willAttend: boolean;
  attendCount: number;
  deviceId: string;
}

export default function AdminPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [summary, setSummary] = useState({
    totalAttendees: 0,
    totalDeclined: 0,
    totalPeople: 0,
  });
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
    fetchDebugInfo();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      console.log("API 호출 시작...");
      const response = await fetch("/api/get-attendance", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        cache: "no-store", // Next.js fetch 캐시 비활성화
      });
      console.log("API 응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API 응답 오류:", errorText);
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("받은 데이터:", data);
      console.log("참석자 수:", data.attendance?.length || 0);

      setAttendanceData(data.attendance);

      // 요약 정보 계산
      const attendees = data.attendance.filter(
        (item: AttendanceData) => item.willAttend
      );
      const declined = data.attendance.filter(
        (item: AttendanceData) => !item.willAttend
      );
      const totalPeople = attendees.reduce(
        (sum: number, item: AttendanceData) => sum + item.attendCount,
        0
      );

      console.log(
        "참석자:",
        attendees.length,
        "불참석자:",
        declined.length,
        "총 인원:",
        totalPeople
      );

      setSummary({
        totalAttendees: attendees.length,
        totalDeclined: declined.length,
        totalPeople,
      });
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      // 사용자에게도 에러 표시
      alert(`데이터 로드 실패: ${error}`);
    }
  };

  const fetchDebugInfo = async () => {
    try {
      const response = await fetch("/api/debug");
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error("디버그 정보 로드 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          결혼식 참석자 관리
        </h1>

        {/* 새로고침 버튼 */}
        <div className="text-center mb-6">
          <button
            onClick={fetchAttendanceData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mr-4"
          >
            데이터 새로고침
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {showDebug ? "디버그 숨기기" : "디버그 정보"}
          </button>
        </div>

        {/* 디버그 정보 */}
        {showDebug && debugInfo && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">디버그 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>환경:</strong> {debugInfo.environment}
              </div>
              <div>
                <strong>시간:</strong> {debugInfo.timestamp}
              </div>
              <div>
                <strong>Google Sheet ID:</strong>{" "}
                {debugInfo.hasGoogleSheetId ? "✅ 존재" : "❌ 누락"} (
                {debugInfo.googleSheetIdLength}자)
              </div>
              <div>
                <strong>서비스 계정 이메일:</strong>{" "}
                {debugInfo.hasServiceAccountEmail ? "✅ 존재" : "❌ 누락"} (
                {debugInfo.serviceAccountEmailDomain})
              </div>
              <div>
                <strong>Private Key:</strong>{" "}
                {debugInfo.hasPrivateKey ? "✅ 존재" : "❌ 누락"}
              </div>
              <div>
                <strong>Private Key 시작:</strong> {debugInfo.privateKeyPrefix}
              </div>
            </div>
          </div>
        )}

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-600">참석 응답</h3>
            <p className="text-3xl font-bold">{summary.totalAttendees}명</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-600">불참석 응답</h3>
            <p className="text-3xl font-bold">{summary.totalDeclined}명</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-600">
              총 참석 인원
            </h3>
            <p className="text-3xl font-bold">{summary.totalPeople}명</p>
          </div>
        </div>

        {/* 참석자 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">참석자 상세 목록</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    참석여부
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    인원
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    기기ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dayjs(item.timestamp)
                        .tz("Asia/Seoul")
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.phone}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.willAttend
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.willAttend ? "참석" : "불참석"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.willAttend ? `${item.attendCount}명` : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {item.deviceId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
