"use client";

import React, { useState, useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "confirm";
  duration?: number;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type !== "confirm") {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // 애니메이션 완료 후 제거
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "confirm":
        return "bg-white text-gray-800 border border-gray-200 shadow-lg";
      default:
        return "bg-gray-800 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "confirm":
        return (
          <svg
            className="w-6 h-6 text-amber-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const handleCancel = () => {
    onCancel?.();
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) return null;

  if (type === "confirm") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 font-apple">
        <div
          className={`bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transition-all duration-300 transform ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex items-start gap-5">
            <div className="w-8 h-8 flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                {message}
              </p>
              <div className="flex gap-4 mt-8 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-base text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[80px]"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 text-base bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors min-w-[80px]"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl transition-all duration-300 transform max-w-md font-apple ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${getToastStyles()}`}
    >
      <div className="w-6 h-6 flex-shrink-0">{getIcon()}</div>
      <span className="text-base font-medium leading-relaxed flex-1">
        {message}
      </span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="ml-2 text-current hover:opacity-70 transition-opacity w-5 h-5 flex-shrink-0"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

// Toast Provider 컴포넌트
export interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      type: "success" | "error" | "info" | "confirm";
      onConfirm?: () => void;
      onCancel?: () => void;
    }>
  >([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      { id, message, type: "confirm", onConfirm, onCancel },
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
