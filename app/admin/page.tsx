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

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch("/api/get-attendance");
      const data = await response.json();
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

      setSummary({
        totalAttendees: attendees.length,
        totalDeclined: declined.length,
        totalPeople,
      });
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          결혼식 참석자 관리
        </h1>

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
