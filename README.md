# AI 콘텐츠 자동화 플랫폼

쇼핑몰 제품을 위한 AI 기반 블로그 콘텐츠 자동 생성 및 관리 플랫폼입니다.

## 📋 프로젝트 개요

이 플랫폼은 쇼핑몰 운영자가 제품 정보를 기반으로 블로그 콘텐츠를 자동으로 생성하고, 여러 블로그 플랫폼에 배포하며, 트래픽을 분석할 수 있도록 돕는 서비스입니다.

## ✨ 주요 기능

1. 회원가입 / 로그인
2. 블로그 템플릿 설정
3. 블로그 글 관리
4. 고객 지원 (QnA, 내 문의)
5. 내 정보 수정
6. 관리자페이지

## 🛠 기술 스택

### Frontend

- React 18.3.1 - UI 라이브러리
- TypeScript 5.8.3 - 타입 안정성
- Vite 5.4.19 - 빌드 도구

### 상태 관리 & 데이터

- TanStack React Query 5.83.0 - 서버 상태 관리 (캐싱, 자동 재검증)
- ky 1.14.0 - HTTP 클라이언트 (Axios보다 가볍고 빠른 성능)
- Zod 3.25.76 - 스키마 검증
- React Hook Form 7.61.1 - 폼 관리

### UI/UX

- Tailwind CSS 3.4.17 - 스타일링
- shadcn/ui - 컴포넌트 라이브러리 (Radix UI 기반)

## 📦 설치 및 실행

### 사전 요구사항

- Node.js 20+ 및 npm 10+ 설치 필요
- [nvm 설치 가이드](https://github.com/nvm-sh/nvm#installing-and-updating)

### 설치 방법

```bash
# 1. 저장소 클론
git clone <YOUR_GIT_URL>

# 2. 프로젝트 디렉토리로 이동
cd FE-repository

# 3. 노드 버전 설정
nvm use

# 4. 의존성 설치
npm install

# 5. 환경 변수 설정
cp .env.example .env

# 6. 개발 서버 실행
npm run dev
```

## 🧹 코드 포맷팅 (Prettier)

기본: 확장(Extension) 설치 후 설정 두 가지

1. Prettier 확장 설치: “Prettier - Code formatter”

2. 기본 포맷팅 설정

- 설정 열기(Cmd+,) → “default formatter” 검색 → “Prettier - Code formatter” 선택

3. “format on save” 켜기

- 설정 열기(Cmd+,) → “format on save” 검색 → 켜기

- 동작 확인
  - 파일 저장 시 자동 정렬 or “Format Document”(Shift+Alt+F) 실행

- 주의 사항
  - 우리가 추가한 `.vscode/settings.json`이 자동 적용됩니다. 개인 사용자 설정이 우선하면 덮어쓸 수 있으니, 위 메뉴에서 확인하세요.

## 🌐 환경 변수

프로젝트는 다음 환경 변수를 사용합니다:

| 변수명              | 설명                | 기본값                  |
| ------------------- | ------------------- | ----------------------- |
| `VITE_API_BASE_URL` | 백엔드 API 서버 URL | `http://localhost:8080` |

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정하세요.

```bash
cp .env.example .env
```

## 🤖 자동 PR 코드리뷰 (ChatGPT)

이 저장소는 PR이 생성/업데이트될 때 ChatGPT로 자동 코드리뷰를 남깁니다.

- 워크플로우 파일: `.github/workflows/code_review_from_chatgpt.yml`

- 설정 방법
  - GitHub 시크릿에 `OPENAI_API_KEY` 추가 (Organization 또는 Repository Secret)
  - 모델 교체: Repository Variables에 `MODEL` 변경해 원하는 모델로 지정

### 번들 사이즈 분석(rollup-plugin-visualizer)

빌드 후 번들 크기를 시각화한 `stats.html`이 루트에 생성됩니다.

```bash
# 프로덕션 빌드
npm run build

# Mac에서 열기
open stats.html

# 특정 브라우저로 열기 (예: Chrome)
open -a "Google Chrome" stats.html
```

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
