# 소셜 미디어 API 테스트 프로젝트

Instagram API를 필터링, 정렬, 상세 포스트 정보 기능과 함께 테스트할 수 있는 Next.js 프로젝트입니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 Instagram API 자격 증명을 설정하세요:

```bash
# Windows
copy env.example .env.local

# Mac/Linux
cp env.example .env.local
```

그런 다음 `.env.local` 파일을 편집하여 Instagram API 자격 증명을 추가하세요:

```env
# Instagram API 설정
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_USER_ID=your_instagram_user_id_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 테스트 페이지에 접속하세요.

## 📋 Instagram API 설정

### 사전 요구사항

1. [Facebook for Developers](https://developers.facebook.com/)에 접속하여 로그인
2. 새 앱 생성
3. **Instagram Graph API** 제품 추가
4. 앱 검토 및 승인 완료 (프로덕션 사용 시 필요)
5. Access Token 및 User ID 생성

### 필수 환경 변수

- `INSTAGRAM_ACCESS_TOKEN`: Instagram Access Token
- `INSTAGRAM_USER_ID`: Instagram User ID

### API 문서

- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)

## ✨ 기능

### 현재 구현된 기능

- ✅ **사용자 정보**: 사용자 프로필 데이터 가져오기 (id, username, account_type, media_count)
- ✅ **포스트 목록**: 상세 정보가 포함된 모든 미디어 포스트 가져오기
- ✅ **포스트 상세 정보**: 포스트를 클릭하여 모든 필드를 포함한 완전한 API 데이터 보기
- ✅ **필터링 옵션**:
  - 해시태그 필터 (예: #travel)
  - 키워드 필터 (캡션에서 검색)
  - 미디어 타입 필터 (IMAGE, VIDEO, CAROUSEL_ALBUM)
  - 포스트 ID 필터 (특정 포스트 가져오기)
- ✅ **정렬 옵션**:
  - 최근 등록 순 (timestamp 기준)
  - 댓글 많은 순 (comments_count 기준)
  - 좋아요 많은 순 (like_count 기준)
  - 조회수 많은 순 (impressions 기준, Business/Creator 계정 필요)
- ✅ **Insights 통합**: impressions, reach, engagement, saved, video_views 보기 (Business/Creator 계정 필요)
- ✅ **API 데이터 정보 모달**: 사용 가능한 모든 API 필드 및 기능 보기

### 사용 가능한 API 필드

#### 사용자 필드
- `id` - 사용자 ID
- `username` - 사용자 이름
- `account_type` - 계정 유형 (BUSINESS, CREATOR, PERSONAL)
- `media_count` - 총 미디어 수

#### 미디어/포스트 필드
- `id` - 미디어 ID
- `caption` - 포스트 캡션
- `media_type` - IMAGE, VIDEO, CAROUSEL_ALBUM
- `media_url` - 미디어 URL
- `permalink` - Instagram 포스트 링크
- `thumbnail_url` - 썸네일 URL
- `timestamp` - 포스트 시간 (ISO 8601)
- `like_count` - 좋아요 수
- `comments_count` - 댓글 수
- `is_comment_enabled` - 댓글 활성화 여부
- `shortcode` - URL용 짧은 코드
- `children` - 캐러셀 하위 미디어
- `location` - 위치 정보 (있는 경우)

#### Insights 필드 (Business/Creator 계정 필요)
- `impressions` - 조회수
- `reach` - 도달 수
- `engagement` - 참여 수
- `saved` - 저장 수
- `video_views` - 비디오 조회수
- `video_view_time` - 비디오 시청 시간 (초)

## 🧪 API 테스트

### 웹 인터페이스

웹 인터페이스를 사용하여 Instagram API를 테스트할 수 있습니다:

1. **Test API**: 기본 API 연결 테스트
2. **Get Posts**: 모든 포스트 가져오기
3. **Apply Filter**: 필터 및 정렬 옵션 적용
4. **View Post Details**: 포스트를 클릭하여 완전한 API 데이터 보기

### API 엔드포인트

- `GET /api/instagram` - Instagram API 연결 테스트
- `GET /api/instagram?posts=true` - 모든 포스트 가져오기
- `GET /api/instagram?posts=true&hashtag=travel` - 해시태그로 필터링
- `GET /api/instagram?posts=true&keyword=keyword` - 키워드로 필터링
- `GET /api/instagram?posts=true&mediaType=IMAGE` - 미디어 타입으로 필터링
- `GET /api/instagram?posts=true&sortBy=likes` - 좋아요 순으로 정렬
- `GET /api/instagram?postId={post_id}` - 특정 포스트 상세 정보 가져오기

### 쿼리 파라미터

- `posts` (boolean): 응답에 포스트 포함
- `hashtag` (string): 캡션의 해시태그로 필터링
- `keyword` (string): 캡션의 키워드로 필터링
- `mediaType` (string): 미디어 타입으로 필터링 (IMAGE, VIDEO, CAROUSEL_ALBUM)
- `postId` (string): ID로 특정 포스트 가져오기
- `sortBy` (string): 정렬 순서 (recent, comments, likes, views)

## 📁 프로젝트 구조

```
social/
├── app/
│   ├── api/
│   │   └── instagram/
│   │       └── route.ts          # Instagram API 라우트
│   ├── logs/
│   │   └── page.tsx              # 로그 페이지
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.module.css           # 페이지 스타일
│   └── page.tsx                  # 메인 페이지
├── env.example                   # 환경 변수 예제
├── .gitignore                    # Git 무시 규칙
├── next.config.js                # Next.js 설정
├── package.json                  # 의존성
├── README.md                     # 이 파일
├── INSTAGRAM_API_FIELDS.md      # Instagram API 필드 문서
└── tsconfig.json                 # TypeScript 설정
```

## ⚠️ 주의사항

### 보안

1. **`.env.local` 파일을 절대 커밋하지 마세요**: `.env.local` 파일은 이미 `.gitignore`에 포함되어 있습니다
2. **토큰 관리**: Access Token은 만료될 수 있습니다. 토큰 갱신 로직 구현을 고려하세요
3. **API 키**: API 키, 토큰 또는 시크릿을 공유하거나 커밋하지 마세요
4. **환경 변수**: 민감한 데이터에는 항상 환경 변수를 사용하세요

### API 제한사항

1. **속도 제한**: Instagram API에는 속도 제한이 있습니다 (일반적으로 시간당 ~200회 요청)
2. **Insights API**: Business 또는 Creator 계정이 필요합니다
3. **해시태그 검색**: Business 계정이 필요합니다
4. **데이터 접근**: 앱 권한이 있는 데이터만 접근 가능합니다
5. **캡션 길이**: 최대 2,200자입니다

### 프로덕션 고려사항

1. **에러 처리**: 포괄적인 에러 처리 추가
2. **로깅**: 디버깅을 위한 적절한 로깅 구현
3. **토큰 갱신**: 자동 토큰 갱신 구현
4. **캐싱**: API 호출을 줄이기 위해 API 응답 캐싱 고려
5. **검증**: 필터 및 파라미터에 대한 입력 검증 추가

## 🔧 기술 스택

- **Next.js 14**: App Router를 사용한 React 프레임워크
- **TypeScript**: 타입 안정성
- **CSS Modules**: 범위가 지정된 스타일링
- **Instagram Graph API**: 소셜 미디어 API 통합

## 📝 라이선스

이 프로젝트는 테스트 목적으로 만들어졌습니다.

## 🔗 참고 자료

- [Instagram Graph API 문서](https://developers.facebook.com/docs/instagram-api)
- [Next.js 문서](https://nextjs.org/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs/)
