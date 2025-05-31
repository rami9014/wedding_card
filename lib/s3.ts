import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `attendance/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: contentType,
    // ACL: "public-read", // 공개 읽기 권한
  });

  try {
    await s3Client.send(command);
    // 기본 S3 URL 또는 CloudFront URL 반환
    const baseUrl =
      process.env.S3_BUCKET_URL ||
      `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    return `${baseUrl}/${key}`;
  } catch (error) {
    console.error("S3 업로드 실패:", error);
    throw new Error("파일 업로드에 실패했습니다.");
  }
}

export async function getSignedUrlForUpload(
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `wedding/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    // ACL: "public-read",
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1시간
    });
    return signedUrl;
  } catch (error) {
    console.error("서명된 URL 생성 실패:", error);
    throw new Error("업로드 URL 생성에 실패했습니다.");
  }
}

export { s3Client };
