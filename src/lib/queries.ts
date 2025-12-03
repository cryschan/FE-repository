import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  signup,
  login,
  checkEmailAvailability,
  getDashboard,
  getErrorMessage,
  getMyBlogs,
  getFAQs,
  getNotices,
  getNoticeDetail,
  type SignupRequest,
  type LoginRequest,
  type SignupResponse,
  type LoginResponse,
  type EmailCheckResponse,
  type DashboardResponse,
  type BlogsMyResponse,
  type NoticesPageResponse,
  type NoticeDetail,
} from "./api";

// ===== Query Keys =====
export const queryKeys = {
  auth: {
    user: ["auth", "user"] as const,
    emailCheck: (email: string) => ["auth", "email-check", email] as const,
  },
  posts: {
    all: ["posts"] as const,
    detail: (id: string) => ["posts", id] as const,
  },
  blogs: {
    my: (page: number, category?: string) =>
      ["blogs", "my", page, category ?? "전체"] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
  },
  admin: {
    inquiries: ["admin", "inquiries"] as const,
    dashboard: ["admin", "dashboard"] as const,
  },
  faqs: {
    all: ["faqs", "all"] as const,
  },
  notices: {
    list: (page: number, size: number) =>
      ["notices", "list", page, size] as const,
    detail: (id: number | string) => ["notices", "detail", id] as const,
  },
} as const;

// ===== Auth Mutations =====

/**
 * 회원가입 Mutation
 */
export const useSignupMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
    onSuccess: (data: SignupResponse) => {
      toast({
        title: "회원가입 완료",
        description: "환영합니다! 로그인 후 AI 글쓰기 설정을 완료해주세요.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "회원가입 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

/**
 * 로그인 Mutation
 */
export const useLoginMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data: LoginResponse) => {
      // 사용자 정보를 캐시에 저장 (응답 스키마에 맞춰 정규화)
      const user = {
        userId: data.userId,
        email: data.email,
        username: data.username,
        createdAt: data.createdAt,
        role: data.role,
      };
      queryClient.setQueryData(queryKeys.auth.user, user);
      // 로컬 스토리지에 역할 저장 (사이드바 표시/가드에 사용)
      try {
        localStorage.setItem("userRole", data.role || "");
      } catch {}
      toast({
        title: "로그인 성공",
        description: `환영합니다, ${data.username}님!`,
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "로그인 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

/**
 * 이메일 중복 확인 Mutation
 */
export const useEmailCheckMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => checkEmailAvailability(email),
    onSuccess: (data: EmailCheckResponse, email: string) => {
      // 결과를 캐시에 저장
      queryClient.setQueryData(queryKeys.auth.emailCheck(email), data);

      if (data.available) {
        toast({
          title: "사용 가능한 이메일입니다",
          description:
            data.message || "해당 이메일로 회원가입을 진행할 수 있습니다.",
        });
      } else {
        toast({
          title: "이미 사용 중인 이메일입니다",
          description: data.message || "다른 이메일을 사용해주세요.",
          variant: "destructive",
        });
      }
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "이메일 확인 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

/**
 * 내 블로그 글 조회 (페이지)
 */
export const useMyBlogsQuery = (page: number, category?: string) => {
  return useQuery({
    queryKey: queryKeys.blogs.my(page, category),
    queryFn: (): Promise<BlogsMyResponse> => getMyBlogs(page, category),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
};

/**
 * 게시글 수정 Mutation (예시)
 */
export const useUpdatePostMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      content: string;
    }) => {
      // TODO: 실제 API 호출로 교체
      // return api.put(`api/posts/${data.id}`, { json: data }).json();
      return data;
    },
    onSuccess: (data) => {
      // 특정 게시글 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(data.id),
      });
      // 전체 목록도 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast({
        title: "게시글 수정 완료",
        description: "게시글이 성공적으로 수정되었습니다.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "게시글 수정 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

/**
 * 프로필 조회 Query (예시)
 */
export const useProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: async () => {
      // TODO: 실제 API 호출로 교체
      // return api.get("api/profile/me").json();
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    enabled: false, // 실제 API 구현 전까지 비활성화
  });
};

/**
 * 프로필 수정 Mutation (예시)
 */
export const useUpdateProfileMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      department: string;
    }) => {
      // TODO: 실제 API 호출로 교체
      // return api.put("api/profile/me", { json: data }).json();
      return data;
    },
    onSuccess: () => {
      // 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
      toast({
        title: "프로필 수정 완료",
        description: "프로필 정보가 성공적으로 수정되었습니다.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "프로필 수정 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// ===== Dashboard Query =====

/**
 * Dashboard 데이터 조회 Query
 */
export const useDashboardQuery = () => {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: () => getDashboard(),
    staleTime: 1 * 60 * 1000, // 1분간 캐시 유지
    retry: 2, // 네트워크 에러 시 최대 2회 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프 (최대 30초)
  });
};

/**
 * FAQ 목록 조회 Query
 */
export const useFAQsQuery = () => {
  return useQuery({
    queryKey: queryKeys.faqs.all,
    queryFn: () => getFAQs(),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

/**
 * 공지사항 목록 조회 Query (페이지네이션)
 */
export const useNoticesQuery = (page: number, size: number = 10) => {
  return useQuery({
    queryKey: queryKeys.notices.list(page, size),
    queryFn: (): Promise<NoticesPageResponse> => getNotices(page, size),
    staleTime: 30 * 1000, // 30초간 캐시 유지
    placeholderData: keepPreviousData,
  });
};

/**
 * 공지사항 상세 조회 Query
 */
export const useNoticeDetailQuery = (id: number | string | undefined) => {
  return useQuery({
    queryKey: queryKeys.notices.detail(id ?? ""),
    queryFn: async (): Promise<NoticeDetail> => {
      if (!id) throw new Error("Notice ID is required");
      try {
        return await getNoticeDetail(id);
      } catch (error) {
        // 개발 환경에서 에러 로깅
        if (import.meta.env.DEV) {
          console.error("[useNoticeDetailQuery Error]", {
            error,
            id,
            url: `api/notices/${id}`,
          });
        }
        throw error;
      }
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 1 * 60 * 1000, // 1분간 캐시 유지
  });
};
