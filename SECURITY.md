# 보안 가이드라인

## 환경 변수 보안

### ✅ 해야 할 것

1. **Vercel 대시보드에서 환경 변수 설정**

   - 모든 민감한 정보는 Vercel 대시보드의 Environment Variables에서 설정
   - Production, Preview, Development 환경별로 적절히 설정

2. **로컬 개발 환경**

   - `.env.local` 파일 사용 (Git에 커밋되지 않음)
   - `.env.example` 파일로 필요한 변수 목록 공유

3. **Git 보안**
   - `.gitignore`에 모든 `.env*` 파일 추가
   - 커밋 전 `git status`로 민감한 파일이 포함되지 않았는지 확인

### ❌ 하지 말아야 할 것

1. **절대 Git에 커밋하면 안 되는 것들**

   - `.env` 파일
   - API 키, 비밀번호, 토큰
   - AWS 액세스 키
   - Google 서비스 계정 키

2. **코드에 하드코딩 금지**
   - API 키를 코드에 직접 작성
   - 데이터베이스 연결 정보 하드코딩

## 환경 변수 목록

### 필수 환경 변수

```env
# Google Sheets API
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="1234567890abcdef"

# AWS S3
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET_NAME="wedding-photos-bucket"

# 카카오 맵 (공개 키)
NEXT_PUBLIC_KAKAO_MAP_API_KEY="your_kakao_api_key"
```

### 환경 변수 검증

각 환경 변수가 올바르게 설정되었는지 확인하는 방법:

1. **로컬 개발 환경**

   ```bash
   npm run dev
   ```

   - 콘솔에서 환경 변수 관련 오류 확인

2. **Vercel 배포 환경**
   - Vercel 대시보드 → Functions → 로그 확인
   - 빌드 로그에서 환경 변수 오류 확인

## 보안 체크리스트

### 배포 전 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] 모든 환경 변수가 Vercel 대시보드에 설정되어 있는가?
- [ ] API 키가 코드에 하드코딩되어 있지 않은가?
- [ ] `.env.example` 파일이 최신 상태인가?

### 정기 보안 점검

- [ ] 사용하지 않는 API 키 삭제
- [ ] AWS IAM 권한 최소화 원칙 적용
- [ ] Google 서비스 계정 권한 검토
- [ ] 환경 변수 로테이션 (필요시)

## 문제 해결

### 일반적인 오류

1. **"Environment variable not found" 오류**

   - Vercel 대시보드에서 환경 변수 설정 확인
   - 변수명 오타 확인
   - 재배포 필요할 수 있음

2. **Google Sheets API 오류**

   - 서비스 계정 이메일이 스프레드시트에 공유되어 있는지 확인
   - Private Key 형식 확인 (줄바꿈 문자 포함)

3. **AWS S3 업로드 오류**
   - IAM 사용자 권한 확인
   - 버킷 CORS 설정 확인
   - 리전 설정 확인

### 긴급 상황 대응

만약 민감한 정보가 Git에 커밋된 경우:

1. **즉시 해당 키/토큰 무효화**
2. **새로운 키 생성**
3. **Git 히스토리에서 완전 제거**
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
   ```
4. **모든 환경에서 새 키로 업데이트**

## 연락처

보안 관련 문제 발견 시 즉시 개발팀에 연락하세요.
