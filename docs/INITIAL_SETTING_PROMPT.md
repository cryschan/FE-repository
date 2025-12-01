# 리액트 프로젝트 초기설정 프롬프트

```text
You are a senior full‑stack engineer. Build a modern React (Vite+TS) frontend with shadcn/ui and Tailwind for an AI 콘텐츠 자동화 플랫폼. Implement exactly the following scope, behavior, routing, and styles. Use client-only mock state where APIs are not specified; otherwise call the APIs as described.

Tech + foundations

- React 18 + Vite + TypeScript
- Tailwind + shadcn/ui (Radix) components; Sonner or shadcn toast with top-right viewport
- State: React hooks + TanStack React Query v5 (queries, mutations, placeholderData: keepPreviousData, query keys grouped by domain)
- HTTP: ky (prefixUrl from VITE_API_BASE_URL in prod; empty in dev to use Vite proxy)
- Routing: React Router v6; protected routes via guards
- Date util: simple formatter “YYYY년 MM월 DD일”
- Icons: lucide-react

Build + Dev

- Vite dev on 5173 with proxy:
  - /api → http://localhost:8080 (changeOrigin, secure: false)
- rollup-plugin-visualizer to emit stats.html (gitignored)
- Toaster: fixed at top-right; toast variants success/info/warning/destructive

Auth & guards

- Auth page at /auth:
  - Login form; on success: toast success; store authToken; set userEmail/userName/userRole in localStorage; after 1s navigate("/", { replace: true })
  - “회원가입하기” opens a 1‑step modal: Name, Email, Password, Confirm Password, Department
- Guards:
  - RequireAuth: if no token → /auth
  - PublicOnly: if token → /
  - RequireAdmin: token + role === "ADMIN" only; else redirect to /
- Routes:
  - Public: /auth, 404
  - Protected (inside AppLayout with sidebar/topbar): /, /ai-settings, /posts, /support, /profile, /dashboard(ADMIN), /inquiry(ADMIN)
- Topbar greeting: “👋🏻 안녕하세요, {userName}님” else userEmail


APIs to implement in client (ky + React Query)

- Auth:
  - POST /api/auth/signup → { userId, email, username, createdAt, role }
  - POST /api/auth/login → { userId, email, username, createdAt, role, token }; store token to localStorage.authToken; ky beforeRequest adds Authorization: Bearer {token}
  - GET /api/auth/check-email?email=... (temporarily disabled in UI)

Dev/infra

- Vite proxy for /api (CORS-free local dev)
- Visualizer emits stats.html (ignored by git). Add README section on how to open it
- GitHub Actions: optional “Code Review From ChatGPT” workflow
  - Uses anc95/ChatGPT-CodeReview@main
  - ENV: GITHUB_TOKEN, OPENAI_API_KEY, LANGUAGE=Korean, MODEL=${{ vars.MODEL || 'gpt-4o-mini' }}

Acceptance criteria (high level)

- Auth flow: success → 1s delay → navigate("/", { replace: true })
- Toaster shows at top-right; variant colors applied

Deliverables

- Working React app with the above routes, components, guards, hooks, and styles
- README covering setup, proxy/CORS, visualizer usage, and workflow note
```
