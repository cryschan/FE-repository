import ky from "ky";

// API 기본 설정
// 개발 환경에서는 Vite proxy를 사용하도록 기본값을 빈 문자열로 설정
const API_BASE_URL =
  import.meta.env.DEV ? "" : (import.meta.env.VITE_API_BASE_URL || "");

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

// ===== 타입 정의 =====

// 회원가입 요청
export type SignupRequest = {
  username: string;
  email: string;
  department: string;
  password: string;
};

// 회원가입 응답
export type SignupResponse = {
  userId: number;
  email: string;
  username: string;
  createdAt: string;
  role: string;
};

// 로그인 요청
export type LoginRequest = {
  email: string;
  password: string;
};

// 로그인 응답
export type LoginResponse = {
  userId: number;
  email: string;
  username: string;
  createdAt: string;
  role: string;
  token: string;
};

// 이메일 중복 확인 응답
export type EmailCheckResponse = {
  available: boolean;
  message: string;
};

// ===== API 함수 =====

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
  const response = await api.post("api/auth/login", { json: data }).json<LoginResponse>();
  
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
export const checkEmailAvailability = async (email: string): Promise<EmailCheckResponse> => {
  return api.get(`api/auth/check-email?email=${encodeURIComponent(email)}`).json<EmailCheckResponse>();
};

/**
 * 로그아웃 (클라이언트 측)
 */
export const logout = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/auth";
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
        return errorResponse.message || errorResponse.error || "요청 처리 중 오류가 발생했습니다.";
      } catch {
        return "서버와의 통신 중 오류가 발생했습니다.";
      }
    }
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};

