export const CATEGORY_ENUM_TO_KR: Record<string, string> = {
  FEATURE: "기능 문의",
  PAYMENT: "결제/환불",
  ACCOUNT: "계정 문의",
  ETC: "기타",
};

export const STATUS_ENUM_TO_KR: Record<
  string,
  { text: string; variant: "default" | "secondary" | "outline" }
> = {
  COMPLETED: { text: "답변완료", variant: "default" },
  IN_PROGRESS: { text: "답변중", variant: "outline" },
  PENDING: { text: "대기중", variant: "secondary" },
};
