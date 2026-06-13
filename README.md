# CreatorBoard MVP

CreatorBoard는 유튜브 첫 영상을 못 정한 초보 사용자가 진단을 통해 주제를 좁히고, 뜨는 영상 3개를 참고해 제목/썸네일/5분 구성안/7일 실행 플랜을 저장하는 MVP입니다.

## MVP 범위

- 비로그인 진단
- 캐시 우선 영상 후보 15개 표시
- 영상 3개 선택
- 수익형 템플릿 1종 기반 생성
- 저장 시 Google 로그인
- 저장 결과 목록/상세/수정/삭제

## v2 후보

- 결제
- 알림
- 관리자 페이지
- 다국어
- 저장 결과 필터
- AI API 기반 생성
- 업로드 추적
- 성과 분석
- YouTube 자막/스크립트 연동

## 환경변수

`.env.example`을 기준으로 배포 환경에 값을 설정합니다. 실제 값은 저장소에 커밋하지 않습니다.

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `YOUTUBE_API_KEY`

## 실행

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

## 배포

Vercel 프로젝트에 환경변수를 등록하고 Neon PostgreSQL 연결 후 배포합니다.

빌드 명령:

```bash
npm run build
```
