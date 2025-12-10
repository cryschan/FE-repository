import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { useNoticesQuery, useCreateNoticeMutation } from "@/lib/queries";
import { formatDateDot } from "@/lib/utils";
import { getUserRole } from "@/routes/guards";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoticeForm from "@/components/NoticeForm";
import { PaginationControls } from "@/components/ui/pagination-controls";

// Pagination constants
const NOTICES_PAGE_SIZE = 10;

// 날짜 포맷팅: "YYYY.MM.DD" -> 공용 유틸 사용
const formatNoticeDate = formatDateDot;

const Notices = () => {
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 관리자 권한 확인
  const isAdmin = getUserRole() === "ADMIN";

  // API 연동
  const {
    data: noticesData,
    isLoading,
    isError,
    error,
  } = useNoticesQuery(currentPage, NOTICES_PAGE_SIZE);

  const notices = noticesData?.content ?? [];
  const totalPages = noticesData?.totalPages ?? 1;

  // 공지사항 생성 Mutation
  const createNoticeMutation = useCreateNoticeMutation();

  // 그룹 계산은 공통 컴포넌트에서 처리

  const handleCreate = (data: {
    title: string;
    content: string;
    isImportant: boolean;
  }) => {
    createNoticeMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
        // 첫 페이지로 이동하여 새로 생성된 공지사항 확인
        setCurrentPage(1);
      },
    });
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">공지사항</h1>
            <p className="text-muted-foreground mt-1">
              서비스 관련 주요 소식을 확인하세요
            </p>
          </div>
          {isAdmin && (
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              공지 작성
            </Button>
          )}
        </div>

        {/* Notices List */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                로딩 중...
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-destructive">
                공지사항을 불러오는 중 오류가 발생했습니다.
                {error instanceof Error && (
                  <p className="text-sm mt-2">{error.message}</p>
                )}
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                공지사항이 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-center justify-between px-4 py-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/notices/${notice.id}`)}
                  >
                    <div className="flex items-center gap-3 flex-1 pl-2">
                      <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                        {notice.title}
                      </h3>
                      <div className="flex gap-2">
                        {notice.isNew && (
                          <Badge variant="default" className="bg-primary">
                            NEW
                          </Badge>
                        )}
                        {notice.isImportant && (
                          <Badge variant="destructive">중요</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-muted-foreground">
                        {formatNoticeDate(notice.createdAt)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
          pagesPerGroup={5}
          className="pt-4"
        />
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>공지사항 작성</DialogTitle>
          </DialogHeader>
          <NoticeForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notices;
