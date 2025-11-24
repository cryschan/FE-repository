import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  signup,
  login,
  checkEmailAvailability,
  getDashboard,
  getErrorMessage,
  type SignupRequest,
  type LoginRequest,
  type SignupResponse,
  type LoginResponse,
  type EmailCheckResponse,
  type DashboardResponse,
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
  profile: {
    me: ["profile", "me"] as const,
  },
  admin: {
    inquiries: ["admin", "inquiries"] as const,
    dashboard: ["admin", "dashboard"] as const,
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

// ===== 사용 예시 (다른 페이지에서 사용할 수 있는 패턴) =====

/**
 * 게시글 목록 조회 Query (예시)
 * 실제 API가 구현되면 사용
 */
export const usePostsQuery = () => {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: async () => {
      // TODO: 실제 API 호출로 교체
      // return api.get("api/posts").json();
      return [];
    },
    staleTime: 1 * 60 * 1000, // 1분간 캐시 유지
    enabled: false, // 실제 API 구현 전까지 비활성화
  });
};

/**
 * 게시글 생성 Mutation (예시)
 */
export const useCreatePostMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      // TODO: 실제 API 호출로 교체
      // return api.post("api/posts", { json: data }).json();
      return data;
    },
    onSuccess: () => {
      // 게시글 목록 캐시 무효화 (새로고침)
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast({
        title: "게시글 생성 완료",
        description: "새 게시글이 성공적으로 생성되었습니다.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "게시글 생성 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
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
  });
};
