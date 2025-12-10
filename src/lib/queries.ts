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
  getMyProfile,
  getUserProfile,
  updateProfile,
  getNotices,
  getNoticeDetail,
  createNotice,
  updateNotice,
  deleteNotice,
  getMyInquiries,
  getMyInquiryDetail,
  getAdminInquiries,
  getAdminInquiryDetail,
  createAdminInquiryAnswer,
  deleteAdminInquiryAnswer,
  createInquiry,
} from "./api";
import type {
  SignupRequest,
  LoginRequest,
  SignupResponse,
  LoginResponse,
  EmailCheckResponse,
  BlogsMyResponse,
  UserDetailResponse,
  UpdateProfileRequest,
  NoticesPageResponse,
  NoticeDetail,
  NoticeCreateRequest,
  NoticeCreateResponse,
  NoticeUpdateRequest,
  NoticeUpdateResponse,
  NoticeDeleteResponse,
  InquiriesResponse,
  MyInquiryListItem,
  InquiriesPageResponse,
  InquiryDetailResponse,
  CreateInquiryRequest,
  AdminAnswerRequest,
} from "./api.types";

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
    user: (userId: number) => ["profile", "user", userId] as const,
  },
  admin: {
    inquiries: ["admin", "inquiries"] as const,
    dashboard: ["admin", "dashboard"] as const,
    inquiriesList: (
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined,
      page: number,
      size: number
    ) => ["admin", "inquiries", status ?? "ALL", page, size] as const,
  },
  faqs: {
    all: ["faqs", "all"] as const,
  },
  notices: {
    list: (page: number, size: number) =>
      ["notices", "list", page, size] as const,
    detail: (id: number | string) => ["notices", "detail", id] as const,
  },
  inquiries: {
    my: (page: number, size: number) =>
      ["inquiries", "my", page, size] as const,
    myDetail: (id: number | string) =>
      ["inquiries", "my", "detail", id] as const,
    admin: ["inquiries", "admin"] as const,
    adminDetail: (id: number | string) =>
      ["inquiries", "admin", "detail", id] as const,
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
      // 프로필 캐시를 로그인 응답으로 먼저 프라임하여 초기 표시를 개선
      const seededProfile = {
        userId: data.userId,
        email: data.email,
        username: data.username,
        role: data.role,
        createdAt: data.createdAt,
      };
      queryClient.setQueryData(queryKeys.profile.me, seededProfile);
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
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    enabled: false, // 실제 API 구현 전까지 비활성화
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

// ===== Profile Queries =====

/**
 * 내 프로필 조회 Query
 */
export const useMyProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: (): Promise<UserDetailResponse> => getMyProfile(),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

/**
 * 다른 사용자 프로필 조회 Query
 */
export const useUserProfileQuery = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.profile.user(userId),
    queryFn: (): Promise<UserDetailResponse> => getUserProfile(userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};

/**
 * 프로필 수정 Mutation (낙관적 UI 업데이트 적용)
 */
export const useUpdateProfileMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest): Promise<UserDetailResponse> =>
      updateProfile(data),

    // 낙관적 업데이트: 서버 응답 전에 즉시 UI 반영
    onMutate: async (newData) => {
      // 진행 중인 쿼리 취소 (충돌 방지)
      await queryClient.cancelQueries({ queryKey: queryKeys.profile.me });

      // 이전 데이터 백업 (롤백용)
      const previousProfile = queryClient.getQueryData<UserDetailResponse>(
        queryKeys.profile.me
      );

      // 캐시를 새 데이터로 즉시 업데이트
      if (previousProfile) {
        queryClient.setQueryData(queryKeys.profile.me, {
          ...previousProfile,
          ...newData,
        });
      }

      // 롤백을 위해 이전 데이터 반환
      return { previousProfile };
    },

    // 성공 시: 서버 데이터로 캐시 동기화
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.me, data);
      toast({
        title: "프로필 수정 완료",
        description: "프로필 정보가 성공적으로 수정되었습니다.",
        variant: "success",
      });
    },

    // 실패 시: 이전 데이터로 롤백
    onError: async (error: unknown, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.profile.me, context.previousProfile);
      }
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "프로필 수정 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },

    // 완료 시: 서버와 동기화 보장
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });
};

/**
 * 공지사항 목록 조회 Query (페이지네이션)
 */
export const useNoticesQuery = (page: number, size: number = 10) => {
  return useQuery({
    queryKey: queryKeys.notices.list(page, size),
    queryFn: async (): Promise<NoticesPageResponse> => {
      try {
        return await getNotices(page, size);
      } catch (error) {
        const message = await getErrorMessage(error);
        throw new Error(message);
      }
    },
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
            url: `/api/notices/${id}`,
          });
        }
        const message = await getErrorMessage(error);
        throw new Error(message);
      }
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 1 * 60 * 1000, // 1분간 캐시 유지
  });
};

/**
 * 공지사항 생성 Mutation
 */
export const useCreateNoticeMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoticeCreateRequest) => createNotice(data),
    onSuccess: (data: NoticeCreateResponse) => {
      // 공지사항 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: ["notices", "list"],
      });
      toast({
        title: "공지사항이 작성되었습니다",
        description: "공지사항이 성공적으로 생성되었습니다.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "공지사항 작성 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

/**
 * 공지사항 수정 Mutation
 */
export const useUpdateNoticeMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: NoticeUpdateRequest;
    }) => updateNotice(id, data),
    onSuccess: (response: NoticeUpdateResponse, variables) => {
      // 공지사항 상세 및 목록 캐시 무효화
      // id를 문자열과 숫자 모두 무효화
      queryClient.invalidateQueries({
        queryKey: ["notices", "detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notices", "list"],
      });
      toast({
        title: "공지사항이 수정되었습니다",
        description:
          response.message || "공지사항이 성공적으로 수정되었습니다.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "공지사항 수정 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

/**
 * 공지사항 삭제 Mutation
 */
export const useDeleteNoticeMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteNotice(id),
    onSuccess: (response: NoticeDeleteResponse) => {
      // 공지사항 상세 및 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["notices", "detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notices", "list"],
      });
      toast({
        title: "공지사항이 삭제되었습니다",
        description:
          response.message || "공지사항이 성공적으로 삭제되었습니다.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const errorMessage = await getErrorMessage(error);
      toast({
        title: "공지사항 삭제 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

// ===== Inquiries Queries =====

export type MyInquiriesQueryData = {
  items: MyInquiryListItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    first: boolean;
    last: boolean;
  };
};

export const useMyInquiriesQuery = (
  page: number = 1,
  size: number = 5,
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED"
) => {
  // 타입 가드: 페이지 응답 여부 판별
  const isPage = (res: InquiriesResponse): res is InquiriesPageResponse => {
    return !Array.isArray(res) && "inquiries" in res;
  };

  return useQuery({
    queryKey: queryKeys.inquiries.my(page, size),
    queryFn: async (): Promise<MyInquiriesQueryData> => {
      try {
        const res = await getMyInquiries(page, size, status);
        if (Array.isArray(res)) {
          const items = res;
          const meta = {
            currentPage: page,
            totalPages: 1,
            totalElements: items.length,
            size,
            first: page === 1,
            last: true,
          };
          return { items, meta };
        } else if (isPage(res)) {
          const {
            inquiries,
            currentPage,
            totalPages,
            totalElements,
            size: pageSize,
            first,
            last,
          } = res;
          return {
            items: inquiries,
            meta: {
              currentPage,
              totalPages,
              totalElements,
              size: pageSize,
              first,
              last,
            },
          };
        }
        // 불명확 응답 대비: 보수적으로 빈 값 반환
        return {
          items: [],
          meta: {
            currentPage: page,
            totalPages: 1,
            totalElements: 0,
            size,
            first: page === 1,
            last: true,
          },
        };
      } catch (error) {
        const message = await getErrorMessage(error);
        throw new Error(message);
      }
    },
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateInquiryMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInquiryRequest): Promise<InquiryDetailResponse> =>
      createInquiry(data),
    onSuccess: () => {
      // 전체 'my inquiries' 쿼리 무효화 (모든 페이지/사이즈)
      queryClient.invalidateQueries({ queryKey: ["inquiries", "my"] });
      toast({
        title: "문의가 접수되었습니다",
        description: "빠른 시일 내에 답변 드리겠습니다.",
        variant: "success",
      });
    },
    onError: async (error: unknown) => {
      const message = await getErrorMessage(error);
      toast({
        title: "문의 등록 실패",
        description: message,
        variant: "destructive",
      });
    },
  });
};

export const useMyInquiryDetailQuery = (id: number | string | undefined) => {
  return useQuery({
    queryKey: queryKeys.inquiries.myDetail(id ?? ""),
    queryFn: async (): Promise<InquiryDetailResponse> => {
      if (!id) throw new Error("Inquiry ID is required");
      try {
        return await getMyInquiryDetail(id);
      } catch (error) {
        const message = await getErrorMessage(error);
        throw new Error(message);
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminInquiriesQuery = (
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined,
  page: number,
  size: number
) => {
  return useQuery({
    queryKey: queryKeys.admin.inquiriesList(status, page, size),
    queryFn: async () => {
      try {
        return await getAdminInquiries(page, size, status);
      } catch (error) {
        const message = await getErrorMessage(error);
        throw new Error(message);
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
};

export const useAdminInquiryDetailQuery = (id: number | string | undefined) => {
  return useQuery({
    queryKey: queryKeys.inquiries.adminDetail(id ?? ""),
    queryFn: async (): Promise<InquiryDetailResponse> => {
      if (!id) throw new Error("Admin Inquiry ID is required");
      try {
        return await getAdminInquiryDetail(id);
      } catch (error) {
        const message = await getErrorMessage(error);
        throw new Error(message);
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 관리자 답변 등록
 */
export const useCreateAdminAnswerMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number | string; answerContent: string }) =>
      createAdminInquiryAnswer(vars.id, {
        answerContent: vars.answerContent,
      } as AdminAnswerRequest),
    onSuccess: (_data, vars) => {
      // 상세/목록 동기화
      queryClient.invalidateQueries({
        queryKey: queryKeys.inquiries.adminDetail(vars.id),
      });
      // 모든 관리자 문의 목록 쿼리 무효화 (status/page/size 조합 전체)
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "admin" &&
          q.queryKey[1] === "inquiries",
      });
      toast({ title: "답변이 등록되었습니다", variant: "success" });
    },
    onError: async (error: unknown) => {
      const message = await getErrorMessage(error);
      toast({
        title: "답변 등록 실패",
        description: message,
        variant: "destructive",
      });
    },
  });
};

/**
 * 관리자 답변 삭제
 */
export const useDeleteAdminAnswerMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteAdminInquiryAnswer(id),
    onSuccess: (_data, id) => {
      // 목록과 상세를 모두 무효화하여 최신 상태로 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.inquiries.adminDetail(id),
      });
      // 모든 관리자 문의 목록 쿼리 무효화 (status/page/size 조합 전체)
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "admin" &&
          q.queryKey[1] === "inquiries",
      });
      toast({ title: "답변이 삭제되었습니다", variant: "success" });
    },
    onError: async (error: unknown) => {
      const message = await getErrorMessage(error);
      toast({
        title: "답변 삭제 실패",
        description: message,
        variant: "destructive",
      });
    },
  });
};
