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
