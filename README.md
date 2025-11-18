# AI 콘텐츠 자동화 플랫폼

쇼핑몰 제품을 위한 AI 기반 블로그 콘텐츠 자동 생성 및 관리 플랫폼입니다.

## 📋 프로젝트 개요

이 플랫폼은 쇼핑몰 운영자가 제품 정보를 기반으로 블로그 콘텐츠를 자동으로 생성하고, 여러 블로그 플랫폼에 배포하며, 트래픽을 분석할 수 있도록 돕는 서비스입니다.

## ✨ 주요 기능

1. 대시보드
2. 블로그 글 관리
3. 고객 지원 (QnA)
4. 관리자페이지
5. 내 정보 수정
6. 회원가입 / 로그인

## 🛠 기술 스택

### Frontend

- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.8.3** - 타입 안정성
- **Vite 5.4.19** - 빌드 도구

### 상태 관리 & 데이터

- **TanStack React Query 5.83.0** - 서버 상태 관리
- **Sonner** - 토스트 알림

### UI/UX

- **shadcn/ui** - 컴포넌트 라이브러리 (Radix UI 기반)
- **Tailwind CSS 3.4.17** - 스타일링
- **Recharts 2.15.4** - 차트 라이브러리

### 마크다운 & 폼

- **React Markdown 10.1.0** - 마크다운 렌더링
- **React Hook Form 7.61.1** - 폼 관리
- **Zod 3.25.76** - 스키마 검증

## 📦 설치 및 실행

### 사전 요구사항

- Node.js 18+ 및 npm 10+ 설치 필요
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

# 5. 개발 서버 실행
npm run dev
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트
│   ├── AppLayout.tsx   # 레이아웃 컴포넌트
│   ├── Sidebar.tsx     # 사이드바 네비게이션
│   └── Topbar.tsx      # 상단바
├── pages/              # 페이지 컴포넌트
│   ├── Auth.tsx        # 로그인/회원가입
│   ├── Dashboard.tsx   # 대시보드
│   ├── Posts.tsx       # 블로그 글 목록
│   ├── Editor.tsx      # 블로그 글 편집기
│   ├── Support.tsx     # 고객 지원 (QnA)
│   ├── Admin.tsx       # 관리자페이지
│   ├── Profile.tsx     # 내 정보 수정
│   └── NotFound.tsx    # 404 페이지
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 함수
├── App.tsx             # 앱 라우팅
└── main.tsx            # 진입점
```

## 🔐 인증 및 권한

- 일반 사용자: 대시보드, 블로그 글 관리, 고객 지원, 내 정보 수정
- 관리자: 추가로 관리자페이지 접근 (문의 관리)

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
