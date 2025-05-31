import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// 닫기 아이콘 (X)
export const CloseIcon: React.FC<IconProps> = ({
  className = "w-6 h-6",
  size,
}) => (
  <svg
    className={size ? `w-${size} h-${size}` : className}
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
);

// 모바일 아이콘
export const MobileIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    className={size ? `w-${size} h-${size}` : className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

// 화살표 오른쪽 아이콘
export const ArrowRightIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  size,
}) => (
  <svg
    className={size ? `w-${size} h-${size}` : className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

// 전화 아이콘
export const PhoneIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    className={size ? `w-${size} h-${size}` : className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// 메시지 아이콘
export const MessageIcon: React.FC<IconProps> = ({
  className = "w-5 h-5",
  size,
}) => (
  <svg
    className={size ? `w-${size} h-${size}` : className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

// 작은 전화 아이콘
export const PhoneSmallIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  size,
}) => (
  <svg
    className={size ? `w-${size} h-${size}` : className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// 작은 메시지 아이콘
export const MessageSmallIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  size,
}) => (
  <svg
    className={size ? `w-${size} h-${size}` : className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
