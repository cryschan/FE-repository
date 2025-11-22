import { Navigate, useLocation } from "react-router-dom";

// 로그인 여부 확인
const isAuthenticated = (): boolean => {
  try {
    return !!localStorage.getItem("authToken");
  } catch {
    return false;
  }
};

// 역할 조회
const getUserRole = (): string => {
  try {
    return localStorage.getItem("userRole") || "";
  } catch {
    return "";
  }
};

// 인증 필요 가드
export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return children;
};

// 인증자 접근 금지 (예: 로그인 페이지)
export const PublicOnly = ({ children }: { children: JSX.Element }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// 관리자 전용 가드
export const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  const role = getUserRole();
  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
};
