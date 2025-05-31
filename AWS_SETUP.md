# AWS S3 및 CloudFront 설정 가이드

이 가이드는 결혼 청첩장 웹사이트의 사진 업로드 기능을 위한 AWS S3 버킷과 CloudFront 설정 방법을 설명합니다.

## 목차

- [1. AWS S3 버킷 생성](#1-aws-s3-버킷-생성)
- [2. IAM 사용자 생성](#2-iam-사용자-생성)
- [3. CloudFront 배포 설정](#3-cloudfront-배포-설정)
- [4. 비용 최적화](#4-비용-최적화)
- [5. 환경 변수 설정](#5-환경-변수-설정)
- [6. 문제 해결](#6-문제-해결)

## 1. AWS S3 버킷 생성

1. AWS 콘솔에 로그인하고 S3 서비스로 이동합니다.
2. "버킷 만들기" 버튼을 클릭합니다.
3. 버킷 설정:

   - **버킷 이름**: `wedding-card-photos` (전역적으로 고유한 이름 사용)
   - **리전**: `ap-northeast-2` (서울)
   - **객체 소유권**: ACL 비활성화됨 (권장)
   - **퍼블릭 액세스 차단**: 모든 퍼블릭 액세스 차단 해제 (CloudFront를 통해서만 접근하도록 나중에 수정)

4. CORS 설정을 위해 버킷의 "권한" 탭에서 CORS 구성을 추가합니다:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## 2. IAM 사용자 생성

1. IAM 콘솔로 이동합니다.
2. "사용자" → "사용자 추가"를 클릭합니다.
3. 사용자 세부 정보:

   - **사용자 이름**: `wedding-card-s3-user`
   - **액세스 유형**: 프로그래밍 방식 액세스

4. 권한 설정:
   - "기존 정책 직접 연결" 선택
   - 다음 정책을 생성하거나 기존 정책 사용:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::wedding-card-photos",
        "arn:aws:s3:::wedding-card-photos/*"
      ]
    }
  ]
}
```

5. 액세스 키 ID와 비밀 액세스 키를 안전하게 저장합니다.

## 3. CloudFront 배포 설정

### 3.1 기본 배포 생성

1. CloudFront 콘솔로 이동합니다.
2. "배포 생성"을 클릭합니다.
3. 원본 설정:
   - **원본 도메인**: S3 버킷 선택 (`wedding-card-photos.s3.ap-northeast-2.amazonaws.com`)
   - **원본 액세스**: Origin Access Control (OAC) 사용 권장

### 3.2 비용 최적화 설정

4. 기본 캐시 동작 설정:
   - **뷰어 프로토콜 정책**: Redirect HTTP to HTTPS
   - **허용된 HTTP 메서드**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - **캐시 키 및 원본 요청**: 캐시 정책 사용
5. **압축 활성화**:

   - "Compress objects automatically" 체크 ✅
   - 이미지 파일 크기를 20-80% 줄일 수 있습니다

6. **캐시 정책 설정**:

   ```
   이미지 파일 (.jpg, .jpeg, .png, .webp):
   - TTL: 31536000초 (1년)
   - 헤더: None
   ```

7. **가격 클래스 설정**:
   - 한국 사용자가 대부분이라면 "Price Class 100" 선택
   - 전 세계 사용자라면 "Price Class All" 선택

### 3.3 추가 최적화 설정

8. **Response Headers Policy 생성**:

```json
{
  "Cache-Control": "public, max-age=31536000, immutable",
  "Vary": "Accept-Encoding"
}
```

9. **Origin Request Policy**:
   - 불필요한 헤더 전송 방지로 비용 절약

## 4. 비용 최적화

### 4.1 전송 비용 절약 방법

1. **엣지 캐싱 최적화**:

   - 이미지 파일의 캐시 TTL을 최대 1년으로 설정
   - 캐시 히트율을 높여 원본 서버 요청 감소

2. **압축 활성화**:

   - CloudFront에서 자동 압축 활성화
   - 평균 30-50% 대역폭 절약 가능

3. **적절한 가격 클래스 선택**:

   ```
   Price Class 100: 북미, 유럽, 아시아 (가장 저렴)
   Price Class 200: + 일본, 호주, 인도 등
   Price Class All: 전 세계 모든 엣지 로케이션
   ```

4. **이미지 최적화**:
   - WebP 형식 사용 권장
   - 적절한 해상도로 업로드

### 4.2 예상 비용 절약

```
기존 S3 직접 접근:
- 아시아 태평양: $0.12/GB
- 데이터 전송: 매월 10GB = $1.20

CloudFront 사용 시:
- 아시아 태평양: $0.085/GB
- 캐시 히트율 80% 가정: 2GB만 원본에서 전송
- 실제 비용: $0.85 + (2GB × $0.12) = $1.09
- 월 절약: 약 30-50%
```

## 5. 환경 변수 설정

`.env` 파일에 다음 변수들을 설정합니다:

```env
# AWS S3 설정
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=wedding-card-photos

# CloudFront 설정
S3_BUCKET_URL=https://your-cloudfront-id.cloudfront.net
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
```

## 6. 문제 해결

### 일반적인 문제들

1. **CORS 오류**:

   - S3 버킷의 CORS 설정 확인
   - CloudFront 배포에서 OPTIONS 메서드 허용 여부 확인

2. **업로드 실패**:

   - IAM 사용자 권한 확인
   - 버킷 정책과 퍼블릭 액세스 설정 확인

3. **이미지 로딩 실패**:

   - CloudFront 배포 상태 확인 (Deployed 상태여야 함)
   - 캐시 무효화 시도: AWS CLI에서 `aws cloudfront create-invalidation`

4. **높은 비용**:
   - CloudWatch에서 캐시 히트율 모니터링
   - 불필요한 리전의 엣지 로케이션 비활성화 고려
   - 이미지 압축 및 최적화 확인

### 모니터링 및 최적화

1. **CloudWatch 메트릭 확인**:

   - 캐시 히트율 (높을수록 좋음)
   - 원본 요청 수 (낮을수록 좋음)
   - 대역폭 사용량

2. **월별 비용 검토**:

   - AWS Cost Explorer 사용
   - 예상보다 높은 비용 발생 시 설정 재검토

3. **성능 최적화**:
   - 이미지 lazy loading 구현
   - Progressive JPEG 사용
   - 적절한 이미지 크기 설정

이 설정을 통해 안정적이고 비용 효율적인 이미지 저장 및 배포 시스템을 구축할 수 있습니다.
