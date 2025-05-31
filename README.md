# 결혼 청첩장 웹사이트

이태호 ❤️ 박성혜의 결혼 청첩장 웹사이트입니다. Next.js로 구축되었으며, 다양한 테마와 사진 업로드 기능을 제공합니다.

## 주요 기능

- 🎨 **다양한 테마**: 메인, 미니멀, 클래식, 익스클루시브, 매거진 스타일
- 📸 **사진 갤러리**: 연도별, 계절별 필터링 가능한 갤러리
- 📤 **사진 업로드**: 하객들이 결혼식 사진을 업로드할 수 있는 기능
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두 최적화
- 🗺️ **위치 정보**: 카카오맵 연동
- ⏰ **실시간 카운트다운**: 결혼식까지 남은 시간

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Google Sheets API
- **Storage**: AWS S3 (사진 저장)
- **Maps**: Kakao Map API
- **Animation**: Framer Motion
- **Image Slider**: Swiper.js

## 환경 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd wedding-card
npm install
```

### 2. 환경 변수 설정

#### 로컬 개발 환경

`.env.local` 파일을 생성하고 다음 정보를 입력하세요:

```env
# Google Sheets API 설정
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n여기에_실제_프라이빗_키_입력\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="your_spreadsheet_id_here"

# AWS S3 설정
AWS_ACCESS_KEY_ID="your_aws_access_key_here"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key_here"
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"

# 카카오 맵 API 키
NEXT_PUBLIC_KAKAO_MAP_API_KEY="your_kakao_map_api_key_here"
```

⚠️ **보안 주의사항**:

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `.env.example` 파일을 참고하여 필요한 환경 변수를 확인하세요

#### Vercel 배포 환경

Vercel에 배포할 때는 대시보드에서 환경 변수를 설정하세요:

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 다음 환경 변수들을 추가:
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET_NAME`
   - `NEXT_PUBLIC_KAKAO_MAP_API_KEY`

### 3. Google Sheets API 설정

참석자 정보와 사진 메타데이터 저장을 위해 Google Sheets API를 설정해야 합니다.

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성 및 JSON 키 다운로드
4. Google Sheets 문서를 서비스 계정과 공유

### 4. AWS S3 설정

사진 업로드를 위해 AWS S3 버킷을 설정해야 합니다. 자세한 설정 방법은 [AWS_SETUP.md](./AWS_SETUP.md)를 참조하세요.

## 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

## 프로젝트 구조

```
wedding-card/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지
│   ├── minimal/           # 미니멀 테마
│   ├── classic/           # 클래식 테마
│   ├── exclusive/         # 익스클루시브 테마
│   ├── magazine/          # 매거진 테마
│   ├── gallery/           # 갤러리 페이지
│   ├── admin/             # 관리자 페이지
│   └── api/               # API 엔드포인트
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 함수
├── public/                # 정적 파일
└── styles/                # 스타일 파일
```

## 배포

### Vercel 배포

1. GitHub 저장소를 Vercel에 연결
2. 환경 변수를 Vercel 대시보드에서 설정
3. 자동 배포 완료

⚠️ **중요**: 배포 전에 모든 환경 변수가 Vercel에 올바르게 설정되었는지 확인하세요.

## 사용법

### 사진 업로드 기능

- 결혼식 당일(2025년 7월 19일 11:30 AM) 이후부터 사진 업로드 버튼이 표시됩니다
- 하객들은 최대 10MB 크기의 이미지 파일을 업로드할 수 있습니다
- 업로드된 사진은 AWS S3에 저장되고 갤러리 페이지에서 확인할 수 있습니다

### 갤러리 기능

- 연도별, 계절별로 사진을 필터링할 수 있습니다
- 모바일과 데스크톱에서 각각 최적화된 레이아웃을 제공합니다
- 터치/마우스 제스처로 사진을 탐색할 수 있습니다

## 문제 해결

일반적인 문제와 해결 방법은 [AWS_SETUP.md](./AWS_SETUP.md)의 문제 해결 섹션을 참조하세요.

## 라이선스

이 프로젝트는 개인적인 용도로 제작되었습니다.
