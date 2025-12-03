import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoticeForm from "@/components/NoticeForm";
import { useToast } from "@/hooks/use-toast";

interface Notice {
  id: number;
  title: string;
  date: string;
  isNew?: boolean;
  isImportant?: boolean;
}

const Notices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: "서비스 정기 점검 안내 (12월 25일)",
      date: "2024.12.20",
      isNew: true,
      isImportant: true,
    },
    {
      id: 2,
      title: "새로운 AI 기능 업데이트 안내",
      date: "2024.12.18",
      isNew: true,
    },
    {
      id: 3,
      title: "블로그 에디터 개선 사항 공지",
      date: "2024.12.15",
    },
    {
      id: 4,
      title: "개인정보 처리방침 변경 안내",
      date: "2024.12.10",
    },
    {
      id: 5,
      title: "크리스마스 이벤트 안내",
      date: "2024.12.05",
    },
    {
      id: 6,
      title: "서비스 이용약관 업데이트",
      date: "2024.12.01",
    },
    {
      id: 7,
      title: "11월 서비스 업데이트 내역",
      date: "2024.11.25",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = (data: {
    title: string;
    content: string;
    isImportant: boolean;
  }) => {
    const newNotice: Notice = {
      id: notices.length + 1,
      title: data.title,
      date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
      isNew: true,
      isImportant: data.isImportant,
    };

    setNotices([newNotice, ...notices]);
    setIsCreateOpen(false);
    toast({
      title: "공지사항이 작성되었습니다",
      variant: "success",
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
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            공지 작성
          </Button>
        </div>

        {/* Notices List */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/notices/${notice.id}`)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-sm text-muted-foreground w-8">
                      {notice.id}
                    </span>
                    <div className="flex items-center gap-3 flex-1">
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
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-muted-foreground">
                      {notice.date}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center pt-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={page === 1 ? "bg-primary" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
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
