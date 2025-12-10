import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useMyInquiryDetailQuery } from "@/lib/queries";

const CATEGORY_ENUM_TO_KR: Record<string, string> = {
  FEATURE: "기능 문의",
  PAYMENT: "결제/환불",
  ACCOUNT: "계정 문의",
  ETC: "기타",
};

const STATUS_ENUM_TO_KR: Record<string, { text: string; variant: "default" | "secondary" | "outline" }> = {
  COMPLETED: { text: "답변완료", variant: "default" },
  IN_PROGRESS: { text: "답변중", variant: "outline" },
  PENDING: { text: "대기중", variant: "secondary" },
};

type MyInquiryDetailDialogProps = {
  inquiryId?: number | string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MyInquiryDetailDialog({
  inquiryId,
  open,
  onOpenChange,
}: MyInquiryDetailDialogProps) {
  const { data, isLoading, isError } = useMyInquiryDetailQuery(inquiryId);

  const statusInfo =
    (data && STATUS_ENUM_TO_KR[data.status]) || STATUS_ENUM_TO_KR.PENDING;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {data?.title ?? "문의 상세"}
            {data && (
              <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
            )}
          </DialogTitle>
          {data && (
            <DialogDescription>
              {data.createdAt?.slice(0, 10)} •{" "}
              {CATEGORY_ENUM_TO_KR[data.inquiryCategory] ||
                data.inquiryCategory}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">불러오는 중...</div>
        ) : isError ? (
          <div className="py-8 text-center text-destructive">
            문의 상세 정보를 불러오지 못했습니다.
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">문의 내용</p>
              <div className="bg-muted/30 p-3 rounded-md text-sm text-foreground whitespace-pre-wrap">
                {data.content}
              </div>
            </div>

            {data.answer && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">답변</p>
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900 whitespace-pre-wrap">
                  {data.answer.answerContent}
                  <div className="mt-2 text-xs opacity-70">
                    답변일시: {data.answer.answeredAt?.slice(0, 16) ?? ""}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}


