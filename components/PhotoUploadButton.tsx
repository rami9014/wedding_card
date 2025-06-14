"use client";

interface PhotoUploadButtonProps {
  isWeddingTime: boolean;
  onUploadClick: () => void;
}

export default function PhotoUploadButton({
  isWeddingTime,
  onUploadClick,
}: PhotoUploadButtonProps) {
  if (!isWeddingTime) return null;

  return (
    <button
      onClick={onUploadClick}
      className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors text-sm sm:text-base"
    >
      <span>📸저희의 스냅 작가님이 되어주세요!📸</span>
    </button>
  );
}
