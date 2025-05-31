import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

interface Photo {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  fileSize: number;
  lastModified: Date;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    const folderPrefix = "attendance/";

    // S3에서 attendance 폴더의 파일 목록 가져오기
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderPrefix,
      MaxKeys: 1000, // 최대 1000개 파일
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
      return NextResponse.json([]);
    }

    // 파일 정보를 Photo 형태로 변환
    const photos: Photo[] = response.Contents.filter((object) => {
      // 폴더 자체는 제외하고 실제 파일만 포함
      return object.Key !== folderPrefix && object.Size! > 0;
    })
      .map((object, index) => {
        const fileName = object.Key!.replace(folderPrefix, "");
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

        // 파일 확장자로 MIME 타입 추정
        let fileType = "";
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
          fileType = `image/${
            fileExtension === "jpg" ? "jpeg" : fileExtension
          }`;
        } else if (["mp4", "mov", "avi", "webm"].includes(fileExtension)) {
          fileType = `video/${fileExtension}`;
        } else {
          fileType = "application/octet-stream";
        }

        return {
          id: object.Key!,
          fileName: fileName,
          fileType: fileType,
          url: `https://${process.env.CLOUDFRONT_DOMAIN}/${object.Key}`,
          fileSize: object.Size || 0,
          lastModified: object.LastModified || new Date(),
        };
      })
      // 최신 업로드 순으로 정렬
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

    return NextResponse.json(photos);
  } catch (error) {
    console.error("S3에서 사진 목록을 가져오는 중 오류 발생:", error);
    return NextResponse.json(
      { error: "사진 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
