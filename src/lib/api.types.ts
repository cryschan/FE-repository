// ===== Auth =====
export type SignupRequest = {
  username: string;
  email: string;
  department: string;
  password: string;
};

export type SignupResponse = {
  userId: number;
  email: string;
  username: string;
  createdAt: string;
  role: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: number;
  email: string;
  username: string;
  createdAt: string;
  role: string;
  accessToken: string;
  refreshToken: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
};

export type EmailCheckResponse = {
  available: boolean;
  message: string;
};

// ===== Blogs =====
export type Blog = {
  id: number;
  title: string;
  content: string;
  category: string;
  imgUrl?: string | null;
  blogTemplateId?: string | null;
  createdAt: string;
  updatedAt?: string;
  isToday?: boolean;
};

export type BlogsMyResponse = {
  blogs: Blog[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
};

export type BlogUpdateRequest = {
  title: string;
  content: string;
  category: string;
  blogTemplateId?: number | string | null;
};

// ===== Blog Templates =====
export type BlogTemplateResponse = {
  id: number;
  title: string;
  createdAt: string;
  categories: string[];
  platforms: string[];
  shopUrl: string;
  includeImages: boolean;
  imageCount: number | null;
  charLimit: number;
  dailyPostTime: string; // "HH:MM:SS"
};

export type BlogTemplateCreateRequest = {
  title: string;
  categories: string[];
  platforms: string[]; // slugs: e.g., ["naver","tistory"]
  shopUrl: string;
  includeImages: boolean;
  imageCount: number | null;
  charLimit: number;
  dailyPostTime: string; // "HH:MM:SS"
};

// ===== Uploads =====
export type CreateUploadRequest = {
  fileName: string;
  contentType: string;
};

export type CreateUploadResponse = {
  presignedUrl: string;
  finalUrl: string;
};

// ===== Dashboard =====
export type DashboardResponse = {
  todayBlogCount: number;
  activeUserCount: number;
  totalBlogCount: number;
  totalTokenUsage: number;
  categoryDistribution: Record<string, number>;
  platformUsage: Record<string, number>;
  todayBlogItemList: Array<{
    title: string;
    platform: string;
    category: string;
    createdAt: string;
    username: string;
    publishStatus: string;
    failureReason?: string;
  }>;
  comparison?: {
    todayBlogCountChangeRate: number;
    todayBlogCountChange: number;
    activeUserCountChangeRate: number;
    activeUserCountChange: number;
    totalTokenUsageChangeRate: number;
    totalTokenUsageChange: number;
  };
};

// ==== FAQs ====
export type FAQs = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: string;
};

export type FAQsResponse = FAQs[];

// ===== User Profile =====
export type UserDetailResponse = {
  userId: number;
  email: string;
  username: string;
  department: string;
  role: "ADMIN" | "USER";
  tokenUsage: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileRequest = {
  username: string;
  department: string;
};

// ==== Notices ====
export type Notice = {
  id: number;
  title: string;
  createdAt: string;
  isNew: boolean;
  isImportant: boolean;
};

export type NoticeDetail = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
  isImportant: boolean;
  canEdit: boolean;
};

export type NoticeCreateRequest = {
  title: string;
  content: string;
  isImportant: boolean;
};

export type NoticeCreateResponse = {
  id: number;
};

export type NoticeUpdateRequest = {
  title: string;
  content: string;
  isImportant: boolean;
};

export type NoticeUpdateResponse = {
  id: number;
  message: string;
};

export type NoticeDeleteResponse = {
  id: number;
  message: string;
};

export type NoticesPageResponse = {
  content: Notice[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

// ===== Inquiries (Customer Support) =====
// 내 문의 목록 아이템
export type MyInquiryListItem = {
  id: number;
  title: string;
  inquiryCategory: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  content?: string | null;
  hasAnswer: boolean;
};

// 내 문의 페이지 응답(페이지형)
export type InquiriesPageResponse = {
  inquiries: MyInquiryListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
};

// 백엔드 스펙이 배열/페이지형 둘 다 존재할 수 있어 유니온으로 허용
export type InquiriesResponse = InquiriesPageResponse;

// 내 문의 상세
export type InquiryDetailResponse = {
  id: number;
  userId: number;
  title: string;
  inquiryCategory: string;
  content: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | string;
  createdAt: string;
  updatedAt: string;
  answer: {
    id: number;
    adminUserId: number;
    answerContent: string;
    createdAt: string;
  } | null;
};

// 문의 생성 요청
export type CreateInquiryRequest = {
  title: string;
  inquiryCategory: string; // FEATURE | PAYMENT | ACCOUNT | ETC
  content: string;
};
