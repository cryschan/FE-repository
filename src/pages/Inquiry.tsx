import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Clock, CheckCircle } from "lucide-react";

type AdminInquiry = {
  id: string;
  title: string;
  category: string;
  status: "pending" | "answered";
  createdAt: string;
  content?: string | null;
  answer?: string | null;
  name?: string | null;
  email?: string | null;
};

const initialInquiries: AdminInquiry[] = [
  {
    id: "1",
    title: "블로그 글 생성 중 오류가 발생했습니다",
    category: "기술 문의",
    status: "answered",
    createdAt: "2024-11-15",
    content: "생성 과정에서 500 에러가 떠요",
    answer:
      "문의 주신 내용 확인했습니다. 해당 오류는 일시적인 서버 문제로 인한 것이었으며, 현재는 정상적으로 작동하고 있습니다. 불편을 드려 죄송합니다.",
    name: "홍길동",
    email: "hong@example.com",
  },
  {
    id: "2",
    title: "카테고리 추가가 가능한가요?",
    category: "기능 문의",
    status: "pending",
    createdAt: "2024-11-14",
    content: "스포츠 하위 카테고리를 더 추가하고 싶어요",
    answer: null,
    name: "김민수",
    email: "kim@example.com",
  },
  {
    id: "3",
    title: "결제 관련 문의",
    category: "결제/환불",
    status: "answered",
    createdAt: "2024-11-10",
    content: "결제 영수증을 재발급 받을 수 있을까요?",
    answer: "내 정보 > 결제 관리에서 영수증 재발급이 가능합니다.",
    name: "이영희",
    email: "lee@example.com",
  },
];

const Inquiry = () => {
  const { toast } = useToast();

  const [inquiries, setInquiries] = useState<AdminInquiry[]>(initialInquiries);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<AdminInquiry | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");

  // 미답변 우선 정렬, 동일 상태는 최신 작성일 순
  const sortedInquiries = useMemo(() => {
    return [...inquiries].sort((a, b) => {
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [inquiries]);

  useEffect(() => {
    setAnswerDraft(active?.answer ?? "");
  }, [active]);

  const openDetail = (item: AdminInquiry) => {
    setActive(item);
    setOpen(true);
  };

  const saveAnswer = () => {
    if (!active) return;
    if (!answerDraft.trim()) {
      toast({
        title: "답변 내용을 입력하세요",
        description: "빈 답변은 저장할 수 없습니다.",
      });
      return;
    }

    setInquiries((prev) =>
      prev.map((q) =>
        q.id === active.id
          ? { ...q, answer: answerDraft.trim(), status: "answered" }
          : q
      )
    );

    toast({
      title: "답변이 저장되었습니다",
      description: "문의 상태가 답변완료로 변경되었습니다.",
      variant: "success",
    });
    setOpen(false);
    setActive(null);
    setAnswerDraft("");
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">고객 문의 관리</h1>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>문의 관리</CardTitle>
            <CardDescription>미답변 문의가 상단에 표시됩니다</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedInquiries.length === 0 ? (
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
                  {sortedInquiries.map((q) => (
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
                            q.status === "answered" ? "default" : "secondary"
                          }
                        >
                          {q.status === "answered" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              답변완료
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {active?.title}
                {active && (
                  <Badge
                    variant={
                      active.status === "answered" ? "default" : "secondary"
                    }
                  >
                    {active.status === "answered" ? "답변완료" : "대기중"}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                {active ? `${active.createdAt} • ${active.category}` : ""}
              </DialogDescription>
            </DialogHeader>

            {active && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {active.name || active.email ? (
                      <>
                        문의자: {active.name ?? "알수없음"}{" "}
                        {active.email ? `(${active.email})` : ""}
                      </>
                    ) : (
                      "문의 상세"
                    )}
                  </p>
                  {active.content && (
                    <div className="bg-muted/30 p-3 rounded-md text-sm text-foreground">
                      {active.content}
                    </div>
                  )}
                </div>

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
              </div>
            )}

            <DialogFooter>
              <Button onClick={saveAnswer}>
                {active?.status === "answered" ? "답변 수정" : "답변 등록"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Inquiry;
