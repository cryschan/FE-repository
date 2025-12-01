import ky from "ky";

import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  EmailCheckResponse,
  BlogsMyResponse,
  DashboardResponse,
  BlogTemplateResponse,
  BlogTemplateCreateRequest,
  CreateUploadRequest,
  CreateUploadResponse,
  BlogUpdateRequest,
  Blog,
  RefreshRequest,
  RefreshResponse,
  FAQsResponse,
} from "./api.types";
// 배럴(Barrel) 패턴: 외부에서는 ./api만 참조해도 되도록 타입을 재노출
export type * from "./api.types";

// API 기본 설정
// 개발 환경에서는 Vite proxy를 사용하도록 기본값을 빈 문자열로 설정
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "";

// 내부 헬퍼: 토큰 키
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

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
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 에러 시 토큰 갱신 시도 후 재시도
        if (response.status === 401) {
          const isRetry = (options as any).__isRetry;
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (!isRetry && refreshToken) {
            try {
              const { accessToken } = await refreshAccessToken({
                refreshToken,
              });
              if (accessToken) {
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                (options as any).__isRetry = true;
                return api(request);
              }
            } catch {}
          }
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
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

export type GenerateNowResponse = {
  message: string;
  templateTitle: string;
};

/**
 * 블로그 글 즉시 생성
 * 현재 템플릿 설정 기반으로 크롤링 + AI 요약 + 블로그 저장 수행
 */
export const generateBlogNow = async (): Promise<GenerateNowResponse> => {
  return api.post("api/blog-templates/generate-now").json<GenerateNowResponse>();
};

// ===== Uploads =====
export const createUpload = async (
  data: CreateUploadRequest
): Promise<CreateUploadResponse> => {
  return api.post("api/uploads", { json: data }).json<CreateUploadResponse>();
};

// ===== Blogs =====
export const updateBlog = async (
  blogId: number | string,
  data: BlogUpdateRequest
): Promise<Blog> => {
  return api.put(`api/blogs/${blogId}`, { json: data }).json<Blog>();
};

// ===== Auth =====
export const refreshAccessToken = async (
  data: RefreshRequest
): Promise<RefreshResponse> => {
  return api.post("api/auth/refresh", { json: data }).json<RefreshResponse>();
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
  if (response.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
  }
  if (response.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
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
  page: number = 1,
  category?: string
): Promise<BlogsMyResponse> => {
  const searchParams: Record<string, string> = { page: String(page) };
  // category가 존재하고 "전체"가 아닌 경우에만 쿼리 파라미터로 추가
  if (category && category.trim() && category !== "전체") {
    searchParams.category = category;
  }
  return api.get("api/blogs/my", { searchParams }).json<BlogsMyResponse>();
};

/**
 * 관리자 대시보드 요약 조회
 */
export const getDashboard = async (): Promise<DashboardResponse> => {
  return api.get("api/admin/dashboard").json<DashboardResponse>();
};

/**
 * FAQ 자주 묻는 질문 목록 조회
 */
export const getFAQs = async (): Promise<FAQsResponse> => {
  return api.get("api/faqs").json<FAQsResponse>();
};

/**
 * 로그아웃 (클라이언트 측)
 */
export const logout = async () => {
  const refreshToken = (() => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
    } catch {
      return "";
    }
  })();

  // 서버에 로그아웃 알림 (refreshToken 무효화)
  try {
    if (refreshToken) {
      await api.post("api/auth/logout", { json: { refreshToken } });
    }
  } catch {
    // 서버 로그아웃 실패는 무시하고 클라이언트 로그아웃 계속 진행
  }

  try {
    // 토큰 및 사용자 정보 제거
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
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
