export const CATEGORIES = [
  "남성 의류",
  "여성 의류",
  "생활용품",
  "신발",
  "메이크업 제품",
  "액세서리",
  "전자제품",
  "식품",
] as const;

export const BLOG_PLATFORMS = [
  "네이버 블로그",
  "티스토리",
  "미디움",
  "브런치",
  "벨로그",
] as const;

export const PLATFORM_DISPLAY_TO_SLUG: Record<string, string> = {
  "네이버 블로그": "naver",
  티스토리: "tistory",
  미디움: "medium",
  브런치: "brunch",
  벨로그: "velog",
};

export const PLATFORM_TO_DISPLAY: Record<string, string> = {
  naver: "네이버 블로그",
  Naver: "네이버 블로그",
  tistory: "티스토리",
  Tistory: "티스토리",
  medium: "미디움",
  Medium: "미디움",
  brunch: "브런치",
  Brunch: "브런치",
  velog: "벨로그",
  Velog: "벨로그",
};
