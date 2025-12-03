import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import Inquiry from "./pages/Inquiry";
import AISettings from "./pages/AISettings";
import Notices from "./pages/Notices";
import NoticeDetail from "./pages/NoticeDetail";
import { RequireAuth, PublicOnly, RequireAdmin } from "@/routes/guards";

// QueryClient 설정 최적화
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1분 - 데이터가 신선한 상태로 유지되는 시간
      gcTime: 5 * 60 * 1000, // 5분 - 캐시가 메모리에 유지되는 시간 (구 cacheTime)
      retry: 1, // 실패 시 1번만 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
      refetchOnReconnect: true, // 네트워크 재연결 시 자동 재요청
    },
    mutations: {
      retry: 0, // Mutation은 재시도하지 않음
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 공개 라우트 */}
          <Route
            path="/auth"
            element={
              <PublicOnly>
                <Auth />
              </PublicOnly>
            }
          />

          {/* 보호 라우트: 로그인 필요 */}
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<AISettings />} />
            <Route path="/ai-settings" element={<AISettings />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/support" element={<Support />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/notices/:id" element={<NoticeDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/dashboard"
              element={
                <RequireAdmin>
                  <Dashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/inquiry"
              element={
                <RequireAdmin>
                  <Inquiry />
                </RequireAdmin>
              }
            />
          </Route>

          {/* 전역 404 (공개) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
