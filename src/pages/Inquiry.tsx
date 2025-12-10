import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle, Trash2 } from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  useAdminInquiriesQuery,
  useAdminInquiryDetailQuery,
  useCreateAdminAnswerMutation,
  useDeleteAdminAnswerMutation,
} from "@/lib/queries";
import { CATEGORY_ENUM_TO_KR } from "@/constants/inquiry";
import { useQueryClient } from "@tanstack/react-query";

type AdminInquiry = {
  id: number | string;
  title: string;
  category: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  content?: string | null;
  answer?: string | null;
  name?: string | null;
  email?: string | null;
};

const Inquiry = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // 페이지네이션 및 상태 필터
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined
  >(undefined);

  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const { data: list } = useAdminInquiriesQuery(
    statusFilter,
    currentPage,
    PAGE_SIZE
  );
  const totalPages = list?.totalPages ?? 1;
  useEffect(() => {
    const items: AdminInquiry[] =
      list?.inquiries?.map((it) => ({
        id: it.id,
        title: it.title,
        category: CATEGORY_ENUM_TO_KR[it.inquiryCategory] || it.inquiryCategory,
        status: (it.status === "COMPLETED"
          ? "completed"
          : it.status === "IN_PROGRESS"
            ? "in_progress"
            : "pending") as "completed" | "in_progress" | "pending",
        createdAt: it.createdAt?.slice(0, 10) ?? "",
        name: it.userName,
        email: it.userEmail,
      })) ?? [];
    setInquiries(items);
  }, [list]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<AdminInquiry | null>(null);
  const { data: detail, isLoading: isDetailLoading } =
    useAdminInquiryDetailQuery(active?.id);
  const [answerDraft, setAnswerDraft] = useState("");
  const createAnswerMutation = useCreateAdminAnswerMutation();
  const deleteAnswerMutation = useDeleteAdminAnswerMutation();

  useEffect(() => {
    // 새로운 문의를 열면 입력값 초기화
    setAnswerDraft("");
  }, [active]);

  const openDetail = (item: AdminInquiry) => {
    setActive(item);
    setOpen(true);
  };

  const saveAnswer = () => {
    if (!active) return;
    if (detail?.answer) return;
    if (!answerDraft.trim()) {
      toast({
        title: "답변 내용을 입력하세요",
        description: "빈 답변은 등록할 수 없습니다.",
      });
      return;
    }
    createAnswerMutation.mutate(
      { id: active.id, answerContent: answerDraft.trim() },
      {
        onSuccess: () => {
          setOpen(false);
          setAnswerDraft("");
          // 추가 보강: 목록 전체 무효화 (status/page/size 조합 전체)
          queryClient.invalidateQueries({
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === "admin" &&
              q.queryKey[1] === "inquiries",
          });
        },
      }
    );
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">고객 문의 관리</h1>

        <Card className="shadow-elevated min-h-[700.5px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>문의 관리</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">상태</label>
                <select
                  className="border rounded px-2 py-1 text-sm bg-background"
                  value={statusFilter ?? ""}
                  onChange={(e) => {
                    const v = e.target.value as
                      | "PENDING"
                      | "IN_PROGRESS"
                      | "COMPLETED"
                      | "";
                    setStatusFilter(v === "" ? undefined : v);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">전체</option>
                  <option value="PENDING">미답변</option>
                  <option value="IN_PROGRESS">답변중</option>
                  <option value="COMPLETED">답변완료</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                확인할 문의가 없습니다.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">작성일</TableHead>
                    <TableHead className="w-[140px]">카테고리</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead className="w-[120px]">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((q) => (
                    <TableRow
                      key={q.id}
                      className="cursor-pointer"
                      onClick={() => openDetail(q)}
                    >
                      <TableCell className="whitespace-nowrap">
                        {q.createdAt}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {q.category}
                      </TableCell>
                      <TableCell className="truncate">{q.title}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={
                            q.status === "completed"
                              ? "default"
                              : q.status === "in_progress"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {q.status === "completed" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              답변완료
                            </span>
                          ) : q.status === "in_progress" ? (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              답변중
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              대기중
                            </span>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
          pagesPerGroup={5}
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {active?.title}
                {active && (
                  <Badge
                    variant={
                      active.status === "completed"
                        ? "default"
                        : active.status === "in_progress"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {active.status === "completed"
                      ? "답변완료"
                      : active.status === "in_progress"
                        ? "답변중"
                        : "대기중"}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                {active ? `${active.createdAt} • ${active.category}` : ""}
              </DialogDescription>
            </DialogHeader>

            {isDetailLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                상세를 불러오는 중...
              </div>
            ) : active ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {active.name || active.email ? (
                      <>
                        문의자: {active.name ?? "알수없음"}{" "}
                        {active.email ? `(${active.email})` : ""}
                      </>
                    ) : null}
                  </p>
                  {(detail?.content || active.content) && (
                    <div className="bg-muted/30 p-3 rounded-md text-sm text-foreground whitespace-pre-wrap">
                      {detail?.content ?? active.content}
                    </div>
                  )}
                </div>

                {detail?.answer && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      기존 답변
                    </p>
                    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900 whitespace-pre-wrap">
                      {detail.answer?.answerContent}
                      <div className="mt-2 text-xs opacity-70">
                        답변일시:{" "}
                        {((detail.answer as any)?.createdAt ?? "") as string}
                      </div>
                    </div>
                  </div>
                )}

                {!detail?.answer && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      답변 작성
                    </label>
                    <Textarea
                      value={answerDraft}
                      onChange={(e) => setAnswerDraft(e.target.value)}
                      placeholder="문의에 대한 답변을 작성하세요"
                      className="min-h-[160px]"
                    />
                  </div>
                )}
              </div>
            ) : null}

            <DialogFooter className="flex items-center gap-2">
              {!detail?.answer && active && (
                <Button
                  onClick={saveAnswer}
                  disabled={createAnswerMutation.status === "pending"}
                >
                  답변하기
                </Button>
              )}
              {detail?.answer && active && (
                <Button
                  variant="destructive"
                  disabled={deleteAnswerMutation.status === "pending"}
                  onClick={() =>
                    deleteAnswerMutation.mutate(active.id, {
                      onSuccess: () => {
                        setOpen(false);
                        // closed after deletion
                        // 추가 보강: 목록 전체 무효화 (status/page/size 조합 전체)
                        queryClient.invalidateQueries({
                          predicate: (q) =>
                            Array.isArray(q.queryKey) &&
                            q.queryKey[0] === "admin" &&
                            q.queryKey[1] === "inquiries",
                        });
                      },
                    })
                  }
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  답변 삭제
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Inquiry;
