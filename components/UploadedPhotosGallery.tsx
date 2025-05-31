"use client";

interface Photo {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  fileSize: number;
  lastModified: Date;
}

interface UploadedPhotosGalleryProps {
  isWeddingTime: boolean;
  uploadedPhotos: Photo[];
  isLoadingPhotos: boolean;
}

export default function UploadedPhotosGallery({
  isWeddingTime,
  uploadedPhotos,
  isLoadingPhotos,
}: UploadedPhotosGalleryProps) {
  if (!isWeddingTime || uploadedPhotos.length === 0) return null;

  return (
    <section className="w-full py-12 sm:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-serif text-center mb-3 sm:mb-4">
          함께한 순간들
        </h2>
        <p className="text-gray-500 text-center mb-8 sm:mb-12 font-light text-sm sm:text-base">
          여러분이 공유해주신 소중한 추억들
        </p>

        {isLoadingPhotos ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            <p className="mt-2 text-gray-500">사진을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {uploadedPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="aspect-square overflow-hidden rounded-lg shadow-md"
              >
                {photo.fileType?.startsWith("video/") ? (
                  <video
                    src={photo.url}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={`업로드된 사진 ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => window.open(photo.url, "_blank")}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
