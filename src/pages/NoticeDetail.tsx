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

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
  isNew?: boolean;
  isImportant?: boolean;
}

const mockNotices: Notice[] = [
  {
    id: 1,
    title: "서비스 정기 점검 안내 (12월 25일)",
    date: "2024.12.20",
    content: `안녕하세요. 서비스를 이용해 주시는 고객 여러분께 감사드립니다.

보다 안정적인 서비스 제공을 위해 아래와 같이 정기 점검을 실시하고자 합니다.

■ 점검 일시: 2024년 12월 25일 (수) 02:00 ~ 06:00 (4시간)

■ 점검 내용: 시스템 안정화 및 서버 증설 작업

■ 영향 범위: 점검 시간 동안 서비스 이용 불가

점검 시간 동안 서비스를 이용하실 수 없으니 양해 부탁드립니다.

더 나은 서비스로 보답하겠습니다.

감사합니다.`,
    isNew: true,
    isImportant: true,
  },
  {
    id: 2,
    title: "새로운 AI 기능 업데이트 안내",
    date: "2024.12.18",
    content: `안녕하세요.

새로운 AI 기능이 추가되었습니다.

■ 주요 기능

- AI 기반 글 작성 도우미

- 자동 맞춤법 검사

- 키워드 추천 기능

많은 이용 부탁드립니다.`,
    isNew: true,
  },
  {
    id: 3,
    title: "블로그 에디터 개선 사항 공지",
    date: "2024.12.15",
    content: `블로그 에디터가 개선되었습니다.

주요 개선 사항:
- 사용자 인터페이스 개선
- 성능 최적화
- 새로운 템플릿 추가`,
  },
  {
    id: 4,
    title: "개인정보 처리방침 변경 안내",
    date: "2024.12.10",
    content: `개인정보 처리방침이 변경되었습니다.

변경 사항을 확인해 주시기 바랍니다.`,
  },
  {
    id: 5,
    title: "크리스마스 이벤트 안내",
    date: "2024.12.05",
    content: `크리스마스 이벤트가 시작되었습니다.

많은 참여 부탁드립니다.`,
  },
  {
    id: 6,
    title: "서비스 이용약관 업데이트",
    date: "2024.12.01",
    content: `서비스 이용약관이 업데이트되었습니다.`,
  },
  {
    id: 7,
    title: "11월 서비스 업데이트 내역",
    date: "2024.11.25",
    content: `11월 서비스 업데이트 내역을 공지합니다.`,
  },
];

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notice, setNotice] = useState<Notice | undefined>(
    mockNotices.find((n) => n.id === Number(id))
  );

  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    toast({
      title: "공지사항이 삭제되었습니다",
      variant: "success",
    });
    navigate("/notices");
  };

  const handleEdit = (data: {
    title: string;
    content: string;
    isImportant: boolean;
  }) => {
    if (notice) {
      setNotice({
        ...notice,
        title: data.title,
        content: data.content,
        isImportant: data.isImportant,
      });
      setIsEditOpen(false);
      toast({
        title: "공지사항이 수정되었습니다",
        variant: "success",
      });
    }
  };

  if (!notice) {
    return (
      <div className="bg-gradient-subtle">
        <div className="w-full mx-auto p-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              공지사항을 찾을 수 없습니다
            </h2>
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
      <div className="w-full mx-auto p-8 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/notices")}
          className="mb-2"
        >
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
                <p className="text-sm text-muted-foreground">{notice.date}</p>
              </div>
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
          <NoticeForm
            initialData={{
              title: notice.title,
              content: notice.content,
              isImportant: notice.isImportant || false,
            }}
            onSubmit={handleEdit}
            onCancel={() => setIsEditOpen(false)}
            submitLabel="수정"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeDetail;

