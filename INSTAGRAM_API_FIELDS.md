# Instagram API 사용 가능한 필드 및 기능 전체 목록

## 📋 목차
1. [사용자(User) 필드](#사용자user-필드)
2. [미디어(Media/Post) 필드](#미디어mediapost-필드)
3. [Insights 필드](#insights-필드)
4. [필터링 옵션](#필터링-옵션)
5. [정렬 옵션](#정렬-옵션)
6. [API 엔드포인트](#api-엔드포인트)

---

## 사용자(User) 필드

### Instagram Graph API - User 필드

```typescript
{
  id: string                    // 사용자 ID
  username: string              // 사용자 이름
  account_type: string          // 계정 유형: BUSINESS, CREATOR, PERSONAL
  media_count: number           // 총 미디어 수
  ig_id: number                 // Instagram ID (숫자)
}
```

**사용 예시:**
```
GET /{user-id}?fields=id,username,account_type,media_count
```

---

## 미디어(Media/Post) 필드

### 기본 미디어 필드

```typescript
{
  id: string                    // 미디어 ID
  caption: string               // 캡션 (게시물 설명)
  media_type: string            // 미디어 유형: IMAGE, VIDEO, CAROUSEL_ALBUM
  media_url: string             // 미디어 URL (이미지/비디오)
  permalink: string              // Instagram 게시물 링크
  thumbnail_url: string          // 썸네일 URL (비디오/캐러셀)
  timestamp: string              // 게시 시간 (ISO 8601)
  username: string              // 게시한 사용자 이름
  owner: {                      // 소유자 정보
    id: string
  }
}
```

### 통계 필드

```typescript
{
  like_count: number            // 좋아요 수
  comments_count: number         // 댓글 수
  children?: {                   // 캐러셀의 하위 미디어
    data: Array<{
      id: string
      media_type: string
      media_url: string
    }>
  }
}
```

### 추가 필드 (Instagram Graph API)

```typescript
{
  is_comment_enabled: boolean   // 댓글 활성화 여부
  is_shared_to_feed: boolean    // 피드 공유 여부
  shortcode: string              // 짧은 코드 (URL에서 사용)
  thumbnail_url: string          // 썸네일 URL
  video_title?: string           // 비디오 제목 (있는 경우)
  product_type?: string         // 제품 타입
  location?: {                   // 위치 정보
    id: string
    name: string
    latitude: number
    longitude: number
  }
  mentions?: {                  // 멘션된 사용자
    data: Array<{
      id: string
      username: string
    }>
  }
  hashtags?: {                  // 해시태그
    data: Array<{
      id: string
      name: string
    }>
  }
}
```

**사용 예시:**
```
GET /{user-id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count,is_comment_enabled,shortcode
```

---

## Insights 필드

### 미디어 Insights (Business/Creator 계정 필요)

```typescript
{
  impressions: number           // 노출 수 (조회수)
  reach: number                 // 도달 수
  engagement: number            // 참여 수
  saved: number                 // 저장 수
  video_views?: number          // 비디오 조회수 (비디오만)
  video_view_time?: number      // 비디오 시청 시간 (초)
  replies?: number              // 답글 수
  taps_forward?: number         // 앞으로 넘기기 (스토리)
  taps_back?: number            // 뒤로 넘기기 (스토리)
  exits?: number                // 나가기 수
}
```

**사용 예시:**
```
GET /{media-id}/insights?metric=impressions,reach,engagement,saved
```

### 계정 Insights

```typescript
{
  followers_count: number       // 팔로워 수
  follows_count: number         // 팔로잉 수
  media_count: number           // 미디어 수
  profile_views: number          // 프로필 조회수
  website_clicks: number         // 웹사이트 클릭 수
}
```

---

## 필터링 옵션

### 1. 해시태그 필터
- **필드**: `caption`
- **방법**: 캡션에서 해시태그 검색
- **예시**: `#travel`, `travel`

### 2. 키워드 필터
- **필드**: `caption`
- **방법**: 캡션에서 키워드 검색
- **예시**: "여행", "food"

### 3. 미디어 타입 필터
- **필드**: `media_type`
- **옵션**:
  - `IMAGE`: 이미지
  - `VIDEO`: 비디오
  - `CAROUSEL_ALBUM`: 캐러셀 (여러 이미지/비디오)

### 4. 날짜 범위 필터
- **필드**: `timestamp`
- **방법**: 타임스탬프 비교
- **예시**: 최근 7일, 최근 30일

### 5. 좋아요/댓글 수 필터
- **필드**: `like_count`, `comments_count`
- **방법**: 최소값/최대값 설정
- **예시**: 좋아요 100개 이상

### 6. 특정 게시물 ID
- **필드**: `id`
- **방법**: 특정 미디어 ID로 조회

---

## 정렬 옵션

### 1. 최근 등록 순
- **필드**: `timestamp`
- **방향**: 내림차순 (최신순)

### 2. 댓글 많은 순
- **필드**: `comments_count`
- **방향**: 내림차순

### 3. 좋아요 많은 순
- **필드**: `like_count`
- **방향**: 내림차순

### 4. 조회수 많은 순
- **필드**: `impressions` (Insights API)
- **방향**: 내림차순
- **참고**: Business/Creator 계정 필요

### 5. 오래된 순
- **필드**: `timestamp`
- **방향**: 오름차순

---

## API 엔드포인트

### 1. 사용자 정보
```
GET /{user-id}?fields={fields}&access_token={token}
```

### 2. 미디어 목록
```
GET /{user-id}/media?fields={fields}&limit={limit}&access_token={token}
```

### 3. 특정 미디어
```
GET /{media-id}?fields={fields}&access_token={token}
```

### 4. 미디어 Insights
```
GET /{media-id}/insights?metric={metrics}&access_token={token}
```

### 5. 계정 Insights
```
GET /{user-id}/insights?metric={metrics}&period={period}&access_token={token}
```

### 6. 해시태그 검색 (Business 계정)
```
GET /ig_hashtag_search?user_id={user-id}&q={hashtag}&access_token={token}
```

### 7. 해시태그 미디어
```
GET /{hashtag-id}/top_media?user_id={user-id}&access_token={token}
GET /{hashtag-id}/recent_media?user_id={user-id}&access_token={token}
```

---

## 현재 구현된 기능

### ✅ 구현 완료
- [x] 사용자 정보 조회 (`id`, `username`, `account_type`)
- [x] 미디어 목록 조회
- [x] 기본 미디어 필드 (`id`, `caption`, `media_type`, `media_url`, `permalink`, `thumbnail_url`, `timestamp`)
- [x] 통계 필드 (`like_count`, `comments_count`)
- [x] 해시태그 필터
- [x] 키워드 필터
- [x] 미디어 타입 필터
- [x] 특정 게시물 ID 조회
- [x] 정렬 기능 (최근순, 댓글순, 좋아요순, 조회수순)
- [x] Insights API 연동 (조회수)

### 🔄 추가 가능한 기능

#### 필터링
- [ ] 날짜 범위 필터 (최근 7일, 30일 등)
- [ ] 좋아요/댓글 수 범위 필터 (최소값/최대값)
- [ ] 위치 기반 필터
- [ ] 멘션 필터

#### 필드 확장
- [ ] 캐러셀 하위 미디어 (`children`)
- [ ] 위치 정보 (`location`)
- [ ] 해시태그 목록 (`hashtags`)
- [ ] 멘션 목록 (`mentions`)
- [ ] 댓글 활성화 여부 (`is_comment_enabled`)
- [ ] 짧은 코드 (`shortcode`)

#### Insights 확장
- [ ] 도달 수 (`reach`)
- [ ] 참여 수 (`engagement`)
- [ ] 저장 수 (`saved`)
- [ ] 비디오 조회수 (`video_views`)
- [ ] 비디오 시청 시간 (`video_view_time`)
- [ ] 계정 Insights (팔로워 수, 프로필 조회수 등)

#### 해시태그 기능
- [ ] 해시태그 검색
- [ ] 해시태그별 인기 미디어
- [ ] 해시태그별 최근 미디어

---

## 사용 예시

### 모든 필드 가져오기
```typescript
const fields = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'permalink',
  'thumbnail_url',
  'timestamp',
  'like_count',
  'comments_count',
  'is_comment_enabled',
  'shortcode',
  'children',  // 캐러셀의 경우
  'location',  // 위치 정보
].join(',')

const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${token}`
```

### Insights 정보 가져오기
```typescript
const metrics = [
  'impressions',    // 조회수
  'reach',          // 도달 수
  'engagement',     // 참여 수
  'saved',          // 저장 수
  'video_views',    // 비디오 조회수
].join(',')

const url = `https://graph.instagram.com/${mediaId}/insights?metric=${metrics}&access_token=${token}`
```

---

## 제한사항

1. **Insights API**: Business 또는 Creator 계정 필요
2. **해시태그 검색**: Business 계정 필요
3. **API 제한**: 시간당 요청 수 제한 (일반적으로 200회)
4. **데이터 접근**: 사용자가 앱에 권한을 부여한 데이터만 접근 가능
5. **캡션 길이**: 캡션은 최대 2,200자

---

## 참고 자료

- [Instagram Graph API 공식 문서](https://developers.facebook.com/docs/instagram-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Insights API](https://developers.facebook.com/docs/instagram-api/guides/insights)

