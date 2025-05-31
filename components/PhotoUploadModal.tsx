"use client";

import React from "react";

interface PhotoUploadModalProps {
  showModal: boolean;
  selectedFiles: File[];
  isUploading: boolean;
  onClose: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onUpload: () => void;
}

export default function PhotoUploadModal({
  showModal,
  selectedFiles,
  isUploading,
  onClose,
  onFileSelect,
  onRemoveFile,
  onUpload,
}: PhotoUploadModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              저희의 결혼식을 함께 추억해주세요.
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일 선택 (여러 개 선택 가능)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={onFileSelect}
                  className="hidden"
                  id="photo-upload"
                  multiple
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length}개 파일 선택됨`
                      : "클릭하여 사진/영상을 선택하세요"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    이미지 및 영상 파일, 여러 개 선택 가능
                  </span>
                </label>
              </div>
            </div>

            {/* 선택된 파일 목록 */}
            {selectedFiles.length > 0 && (
              <div className="max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  선택된 파일:
                </p>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        {file.type.startsWith("video/") ? (
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024 / 1024).toFixed(1)}MB)
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-4 h-4"
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={onUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isUploading
                  ? `업로드 중... (${selectedFiles.length}개)`
                  : `업로드 (${selectedFiles.length}개)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
