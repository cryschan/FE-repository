import ky from "ky";

import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  EmailCheckResponse,
  BlogTemplateResponse,
  BlogTemplateCreateRequest,
  BlogsMyResponse,
  DashboardResponse,
} from "./api.types";
// 배럴(Barrel) 패턴: 외부에서는 ./api만 참조해도 되도록 타입을 재노출
export type * from "./api.types";

// API 기본 설정
// 개발 환경에서는 Vite proxy를 사용하도록 기본값을 빈 문자열로 설정
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "";

// ky 인스턴스 생성
export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000, // 30초
  retry: {
    limit: 2,
    methods: ["get", "post", "put", "delete"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem("authToken");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 에러 시 로그아웃 처리
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/auth";
        }
        return response;
      },
    ],
  },
});

// ===== API 함수 =====

// ===== Blog Templates =====
export const getMyBlogTemplate = async (): Promise<BlogTemplateResponse> => {
  return api.get("api/blog-templates/me").json<BlogTemplateResponse>();
};

export const createBlogTemplate = async (
  data: BlogTemplateCreateRequest
): Promise<BlogTemplateResponse> => {
  return api
    .post("api/blog-templates", { json: data })
    .json<BlogTemplateResponse>();
};

/**
 * 회원가입 API
 * @param data 회원가입 정보
 * @returns 생성된 사용자 정보
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  return api.post("api/auth/signup", { json: data }).json<SignupResponse>();
};

/**
 * 로그인 API
 * @param data 로그인 정보
 * @returns 토큰 및 사용자 정보
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api
    .post("api/auth/login", { json: data })
    .json<LoginResponse>();

  // 토큰 저장
  if (response.token) {
    localStorage.setItem("authToken", response.token);
  }

  return response;
};

/**
 * 이메일 중복 확인 API
 * @param email 확인할 이메일
 * @returns 사용 가능 여부
 */
export const checkEmailAvailability = async (
  email: string
): Promise<EmailCheckResponse> => {
  return api
    .get(`api/auth/check-email?email=${encodeURIComponent(email)}`)
    .json<EmailCheckResponse>();
};

/**
 * 내 블로그 글 조회 (페이지)
 */
export const getMyBlogs = async (
  page: number = 1
): Promise<BlogsMyResponse> => {
  return api
    .get("api/blogs/my", {
      searchParams: { page: String(page) },
    })
    .json<BlogsMyResponse>();
};

/**
 * 관리자 대시보드 요약 조회
 */
export const getDashboard = async (): Promise<DashboardResponse> => {
  return api.get("api/admin/dashboard").json<DashboardResponse>();
};

/**
 * 로그아웃 (클라이언트 측)
 */
export const logout = () => {
  try {
    // 토큰 및 사용자 정보 제거
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  } catch {}

  setTimeout(() => {
    window.location.href = "/auth";
  }, 2000);
};

// ===== 에러 핸들링 유틸리티 =====

/**
 * API 에러 메시지 추출
 * @param error ky HTTPError
 * @returns 사용자에게 표시할 에러 메시지
 */
export const getErrorMessage = async (error: unknown): Promise<string> => {
  if (error instanceof Error) {
    // ky의 HTTPError인 경우
    if ("response" in error) {
      try {
        const errorResponse = await (error as any).response.json();
        return (
          errorResponse.message ||
          errorResponse.error ||
          "요청 처리 중 오류가 발생했습니다."
        );
      } catch {
        return "서버와의 통신 중 오류가 발생했습니다.";
      }
    }
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};
