import {
  FileText,
  HelpCircle,
  User,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type SidebarSection = {
  label: string;
  icon: LucideIcon | null;
  items: Array<{ title: string; to: string }>;
};

export const SECTIONS: SidebarSection[] = [
  {
    label: "AI 글쓰기",
    icon: Sparkles,
    items: [{ title: "AI 글쓰기 설정", to: "/ai-settings" }],
  },
  {
    label: "블로그 글 관리",
    icon: FileText,
    items: [{ title: "블로그 글 목록", to: "/posts" }],
  },
  {
    label: "고객 지원",
    icon: HelpCircle,
    items: [
      { title: "QnA (자주 묻는 질문 / 내 문의)", to: "/support" },
      { title: "공지사항", to: "/notices" },
    ],
  },
  {
    label: "마이페이지",
    icon: User,
    items: [{ title: "내 정보 수정", to: "/profile" }],
  },
  {
    label: "관리자",
    icon: ShieldCheck,
    items: [
      { title: "대시보드", to: "/dashboard" },
      { title: "고객 문의 관리", to: "/inquiry" },
    ],
  },
];
