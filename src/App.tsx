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

const queryClient = new QueryClient();

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
