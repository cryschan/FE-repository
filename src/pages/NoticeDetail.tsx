import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoticeForm from "@/components/NoticeForm";
import { useToast } from "@/hooks/use-toast";
import {
  useNoticeDetailQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} from "@/lib/queries";

// 날짜 포맷팅: "YYYY.MM.DD"
const formatNoticeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return dateString;
  }
};

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // API 연동
  const { data: notice, isLoading, isError, error } = useNoticeDetailQuery(id);

  // 공지사항 수정 Mutation
  const updateNoticeMutation = useUpdateNoticeMutation();

  // 공지사항 삭제 Mutation
  const deleteNoticeMutation = useDeleteNoticeMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    if (!id) return;
    deleteNoticeMutation.mutate(id, {
      onSuccess: () => {
        navigate("/notices");
      },
    });
  };

  const handleEdit = (data: {
    title: string;
    content: string;
    isImportant: boolean;
  }) => {
    if (!id) return;
    updateNoticeMutation.mutate(
      {
        id,
        data,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-subtle">
        <div className="w-full mx-auto p-8">
          <div className="text-center py-20">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !notice) {
    // 에러 상세 정보 로깅
    if (isError && import.meta.env.DEV) {
      console.error("[NoticeDetail Error]", {
        error,
        id,
        message: error instanceof Error ? error.message : String(error),
      });
    }

    return (
      <div className="bg-gradient-subtle">
        <div className="w-full mx-auto p-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              공지사항을 찾을 수 없습니다
            </h2>
            {isError && (
              <p className="text-sm text-destructive mb-2">
                {error instanceof Error
                  ? error.message
                  : "알 수 없는 오류가 발생했습니다."}
              </p>
            )}
            {id && (
              <p className="text-sm text-muted-foreground mb-4">
                공지사항 ID: {id}
              </p>
            )}
            <Button onClick={() => navigate("/notices")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 pt-4 pb-24 space-y-4">
        <Button variant="ghost" onClick={() => navigate("/notices")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Button>

        <Card className="shadow-card">
          <CardHeader className="border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {notice.isNew && (
                    <Badge variant="default" className="bg-primary">
                      NEW
                    </Badge>
                  )}
                  {notice.isImportant && (
                    <Badge variant="destructive">중요</Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {notice.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {formatNoticeDate(notice.createdAt)}
                </p>
              </div>
              {notice.canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수
                          없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {notice.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>공지사항 수정</DialogTitle>
          </DialogHeader>
          {notice && (
            <NoticeForm
              key={notice.id}
              initialData={{
                title: notice.title,
                content: notice.content,
                isImportant: notice.isImportant,
              }}
              onSubmit={handleEdit}
              onCancel={() => setIsEditOpen(false)}
              submitLabel="수정"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeDetail;
