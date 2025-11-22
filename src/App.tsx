import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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

// 인증 가드
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  let isAuthed = false;
  try {
    isAuthed = !!localStorage.getItem("authToken");
  } catch {
    isAuthed = false;
  }
  if (!isAuthed) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return children;
};

// 로그인 사용자는 공개 페이지 접근시 메인으로
const PublicOnly = ({ children }: { children: JSX.Element }) => {
  let isAuthed = false;
  try {
    isAuthed = !!localStorage.getItem("authToken");
  } catch {
    isAuthed = false;
  }
  if (isAuthed) {
    return <Navigate to="/" replace />;
  }
  return children;
};

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* 전역 404 (공개) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
