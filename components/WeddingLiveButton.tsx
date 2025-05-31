"use client";

export default function WeddingLiveButton() {
  return (
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
  );
}
