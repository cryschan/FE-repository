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
import Admin from "./pages/Admin";
import AISettings from "./pages/AISettings";

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
          {/* auth만 레이아웃 제외 */}
          <Route path="/auth" element={<Auth />} />

          {/* 공용 레이아웃: 모든 페이지에 사이드바 */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<AISettings />} />
            <Route path="/ai-settings" element={<AISettings />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/support" element={<Support />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            {/* 레이아웃 내 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
