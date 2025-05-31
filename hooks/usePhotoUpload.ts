"use client";

import { useState, useEffect } from "react";

interface Photo {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  fileSize: number;
  lastModified: Date;
}

export function usePhotoUpload(isWeddingTime: boolean) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  // 업로드된 사진들을 가져오는 함수
  const fetchUploadedPhotos = async () => {
    if (!isWeddingTime) return;

    setIsLoadingPhotos(true);
    try {
      const response = await fetch("/api/get-photos");
      if (response.ok) {
        const photos = await response.json();
        setUploadedPhotos(photos);
      }
    } catch (error) {
      console.error("사진을 가져오는 중 오류 발생:", error);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  // 사진 업로드 핸들러
  const handlePhotoUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploaderName", "익명"); // 기본값으로 익명 설정

        const response = await fetch("/api/upload-photo", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`${file.name}: ${error.error}`);
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      alert(`${selectedFiles.length}개의 파일이 성공적으로 업로드되었습니다!`);
      setShowUploadModal(false);
      setSelectedFiles([]);

      // 업로드 후 갤러리 새로고침
      await fetchUploadedPhotos();
    } catch (error) {
      console.error("업로드 오류:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      alert(`업로드 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      // 미디어 파일인지 체크 (이미지 또는 비디오)
      const validFiles = files.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/")
      );

      if (validFiles.length !== files.length) {
        alert("이미지 또는 영상 파일만 업로드 가능합니다.");
      }

      setSelectedFiles(validFiles);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFiles([]);
  };

  // 결혼식 시간이 되면 업로드된 사진들을 가져오기
  useEffect(() => {
    if (isWeddingTime) {
      fetchUploadedPhotos();
    }
  }, [isWeddingTime]);

  return {
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
    fetchUploadedPhotos,
  };
}
