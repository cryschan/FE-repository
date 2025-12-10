import { useState, useMemo } from "react";
import {
  useFAQsQuery,
  useMyInquiriesQuery,
  useCreateInquiryMutation,
} from "@/lib/queries";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import FAQSection from "@/components/support/FAQSection";
import MyInquiriesSection from "@/components/support/MyInquiriesSection";
import CreateInquiryDialog from "@/components/support/CreateInquiryDialog";
import MyInquiryDetailDialog from "@/components/support/MyInquiryDetailDialog";
import { CATEGORY_ENUM_TO_KR } from "@/constants/inquiry";

const Support = () => {
  const [selectedTab, setSelectedTab] = useState("faq");
  const [open, setOpen] = useState(false);
  const { data: faqsData, isError: isFAQsError } = useFAQsQuery();

  // FAQ 데이터를 메모이제이션하여 안정적인 참조 유지
  const faqs = useMemo(() => faqsData ?? [], [faqsData]);

  // 페이지네이션
  const PAGES_PER_GROUP = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | string>();
  // API: 내 문의 목록 (기본 size=5)
  const {
    data: myInquiriesData,
    isLoading: isInquiriesLoading,
    isError: isInquiriesError,
    error: inquiriesError,
  } = useMyInquiriesQuery(currentPage, 5);
  const createMutation = useCreateInquiryMutation();
  // API 결과를 화면 모델로 매핑 (컴포넌트 기대 타입)
  const apiInquiries = useMemo(
    () =>
      (myInquiriesData?.items ?? []).map((i) => ({
        id: String(i.id),
        title: i.title,
        category: CATEGORY_ENUM_TO_KR[i.inquiryCategory] || i.inquiryCategory,
        status: (i.status === "COMPLETED"
          ? "completed"
          : i.status === "IN_PROGRESS"
            ? "in_progress"
            : "pending") as "completed" | "in_progress" | "pending",
        createdAt: i.createdAt.slice(0, 10),
        answer: null,
        content: i.content ?? null,
      })),
    [myInquiriesData]
  );
  const totalPages = myInquiriesData?.meta.totalPages ?? 1;
  // 그룹 시작 페이지 계산
  const groupStart =
    Math.floor((currentPage - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1;
  if (groupStart !== startPage) {
    // 상태 동기화
    setStartPage(groupStart);
  }

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

          <CreateInquiryDialog
            open={open}
            onOpenChange={setOpen}
            onCreated={() => {
              setCurrentPage(1);
              setSelectedTab("my-inquiries");
            }}
          />
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            문의하기
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">자주 묻는 질문</TabsTrigger>
            <TabsTrigger value="my-inquiries">내 문의</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <FAQSection faqs={faqs} isError={isFAQsError} />
          </TabsContent>

          <TabsContent value="my-inquiries" className="mt-6">
            {isInquiriesLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                로딩 중...
              </div>
            ) : isInquiriesError ? (
              <div className="text-center py-8 text-destructive">
                문의 목록을 불러오는 중 오류가 발생했습니다.
                {inquiriesError instanceof Error && (
                  <p className="text-sm mt-2">{inquiriesError.message}</p>
                )}
              </div>
            ) : (
              <>
                <MyInquiriesSection
                  inquiries={apiInquiries}
                  onSelect={(id) => {
                    setSelectedInquiryId(id);
                    setDetailOpen(true);
                  }}
                />
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
                  pagesPerGroup={PAGES_PER_GROUP}
                  className="pt-6"
                />
              </>
            )}
          </TabsContent>
        </Tabs>

        <MyInquiryDetailDialog
          inquiryId={selectedInquiryId}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </div>
    </div>
  );
};

export default Support;
