import { useState, useMemo } from "react";
import { useFAQsQuery } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MessageSquare, Clock, CheckCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Inquiry = {
  id: string;
  title: string;
  category: string;
  status: "answered" | "pending";
  createdAt: string;
  answer?: string | null;
  content?: string | null;
};

const initialInquiries: Inquiry[] = [
  {
    id: "1",
    title: "블로그 글 생성 중 오류가 발생했습니다",
    category: "기술 문의",
    status: "answered",
    createdAt: "2024-11-15",
    answer:
      "문의 주신 내용 확인했습니다. 해당 오류는 일시적인 서버 문제로 인한 것이었으며, 현재는 정상적으로 작동하고 있습니다. 불편을 드려 죄송합니다.",
  },
  {
    id: "2",
    title: "카테고리 추가가 가능한가요?",
    category: "기능 문의",
    status: "pending",
    createdAt: "2024-11-14",
    answer: null,
  },
  {
    id: "3",
    title: "결제 관련 문의",
    category: "결제/환불",
    status: "answered",
    createdAt: "2024-11-10",
    answer:
      "결제 내역은 내 정보 > 결제 관리에서 확인하실 수 있습니다. 추가 문의사항이 있으시면 언제든지 연락 주세요.",
  },
];

const CATEGORIES = ["기술 문의", "기능 문의", "결제/환불", "계정/보안", "기타"];

const Support = () => {
  const { toast } = useToast();

  const [selectedTab, setSelectedTab] = useState("faq");
  const [open, setOpen] = useState(false);

  const {
    data: faqsData,
    isError: isFAQsError,
  } = useFAQsQuery();

  // FAQ 데이터를 메모이제이션하여 안정적인 참조 유지
  const faqs = useMemo(() => faqsData ?? [], [faqsData]);

  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState("");

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category.trim()) {
      toast({
        title: "입력값을 확인해주세요",
        description: "제목과 카테고리를 입력해 주세요.",
      });
      return;
    }

    const newItem: Inquiry = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
      answer: null,
      content: content || null,
    };

    setInquiries((prev) => [newItem, ...prev]);
    toast({
      title: "문의가 접수되었습니다",
      description: "빠른 시일 내에 답변 드리겠습니다.",
      variant: "success",
    });
    resetForm();
    setOpen(false);
    setSelectedTab("my-inquiries");
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">고객 지원</h1>
            <p className="text-gray-600 mt-1">
              자주 묻는 질문과 나의 문의 내역을 확인하세요
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              문의하기
            </Button>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>문의 생성</DialogTitle>
                <DialogDescription>
                  아래 항목을 작성해 주세요.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    placeholder="문의 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">문의 내용 (선택)</Label>
                  <Textarea
                    id="content"
                    placeholder="상세한 내용을 작성해 주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[160px]"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    문의 생성
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">자주 묻는 질문</TabsTrigger>
            <TabsTrigger value="my-inquiries">내 문의</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>자주 묻는 질문</CardTitle>
                <CardDescription>
                  일반적인 질문에 대한 답변을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isFAQsError ? (
                  <div className="text-center py-8 text-red-500">
                    FAQ를 불러오는 중 오류가 발생했습니다.
                  </div>
                ) : faqs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    등록된 FAQ가 없습니다.
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => {
                      // 타입 안정성을 위해 명시적으로 문자열 변환
                      const itemValue =
                        typeof faq.id === "number" ? String(faq.id) : faq.id;

                      return (
                        <AccordionItem key={faq.id} value={itemValue}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-inquiries" className="mt-6">
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              inquiry.status === "answered"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {inquiry.status === "answered" ? (
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
                          <Badge variant="outline">{inquiry.category}</Badge>
                        </div>
                        <CardTitle>{inquiry.title}</CardTitle>
                        <CardDescription className="mt-2">
                          작성일: {inquiry.createdAt}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  {inquiry.answer && (
                    <CardContent>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-900">
                          <strong>답변:</strong> {inquiry.answer}
                        </p>
                      </div>
                    </CardContent>
                  )}

                  {inquiry.content && !inquiry.answer && (
                    <CardContent>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-muted-foreground">
                          {inquiry.content}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {inquiries.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    아직 문의 내역이 없습니다.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Support;
