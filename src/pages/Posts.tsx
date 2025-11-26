import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { useMyBlogsQuery, queryKeys } from "@/lib/queries";
import { formatDateKorean } from "@/lib/utils";

type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  isToday: boolean;
};

const CATEGORIES = [
  "전체",
  "남성 의류",
  "여성 의류",
  "생활용품",
  "신발",
  "메이크업 제품",
  "액세서리",
  "전자제품",
  "식품",
];

const Posts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  // 서버 데이터 (페이지 단위)
  const { data, isLoading } = useMyBlogsQuery(currentPage);
  // 오늘 추가된 글 고정용: 항상 page=1 응답 기준
  const { data: firstPageData } = useMyBlogsQuery(1);

  // 서버 응답을 로컬 포맷으로 동기화
  useEffect(() => {
    if (!data) return;
    const mapped: Post[] =
      (data.blogs ?? []).map((b: any) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        category: b.category,
        createdAt: b.createdAt,
        isToday: !!b.isToday,
      })) ?? [];
    setPosts(mapped);
  }, [data]);

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setMarkdown(post.content);
    setOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setMarkdown("");
    setEditingPost(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !markdown.trim()) {
      toast({
        title: "입력값을 확인해주세요",
        description: "제목과 본문을 모두 작성해야 합니다.",
      });
      return;
    }

    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id
            ? { ...post, title: title.trim(), content: markdown }
            : post
        )
      );
      // Query 캐시도 동기화 (현재 페이지 데이터)
      try {
        queryClient.setQueryData(
          queryKeys.blogs.my(currentPage),
          (old: any) => {
            if (!old || !old.blogs) return old;
            const next = {
              ...old,
              blogs: old.blogs.map((b: any) =>
                String(b.id) === String(editingPost.id)
                  ? { ...b, title: title.trim(), content: markdown }
                  : b
              ),
            };
            return next;
          }
        );
      } catch {}

      // 클립보드에 복사
      try {
        const textToCopy = `${title.trim()}\n\n${markdown}`;
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "저장 및 복사 완료",
          description: "게시글이 수정되고 클립보드에 복사되었습니다.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "게시글이 수정되었습니다",
          description: "클립보드 복사에 실패했습니다.",
          variant: "destructive",
        });
      }
    }

    resetForm();
    setOpen(false);
  };

  // 필터링
  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === "전체") return true;
    return post.category === selectedCategory;
  });

  // 오늘 추가된 글: page=1 데이터 기준 isToday === true 중 "가장 최근(목록 상 첫 번째)" 1개
  const todayFromFirstPage =
    (firstPageData?.blogs ?? [])
      .map((b: any) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        category: b.category,
        createdAt: b.createdAt,
        isToday: !!b.isToday,
      }))
      .filter((p: Post) => p.isToday) ?? [];
  const todayPost =
    todayFromFirstPage.length > 0 ? todayFromFirstPage[0] : undefined;

  // 전체 글 목록: 현재 페이지에서 받은 글 그대로 사용 (오늘 글과 중복 표시 허용)
  const listPosts = filteredPosts;

  // 페이지네이션 (서버 값 사용)
  const totalPages = data?.totalPages ?? 1;
  const paginatedPosts = listPosts; // 현재 페이지 데이터는 서버에서 분할됨

  // 카테고리 변경 시 페이지를 1로 리셋
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              블로그 글 관리
            </h1>
            <p className="text-muted-foreground mt-1">
              AI가 자동 생성한 글을 확인하고 수정하세요
            </p>
          </div>

          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 오늘 추가된 글 */}
        {todayPost && (
          <Card className="shadow-elevated border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                오늘 추가된 글<Badge variant="default">NEW</Badge>
              </CardTitle>
              <CardDescription>
                오늘 AI가 자동으로 생성한 최신 글입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {todayPost.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {todayPost.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDateKorean(todayPost.createdAt)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => openEditDialog(todayPost)}
                  className="ml-4 gap-2 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Edit className="w-4 h-4" />
                  수정하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 이전 글 목록 */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>전체 글 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[360px] max-h-[360px] overflow-y-auto pr-1">
              {paginatedPosts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground text-center">
                  해당 카테고리에 글이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between px-4 py-3 rounded-lg border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {post.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDateKorean(post.createdAt)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => openEditDialog(post)}
                        className="ml-4 gap-2 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <Edit className="w-4 h-4" />
                        수정하기
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* 수정 다이얼로그 */}
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>글 수정하기</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  placeholder="게시글 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="edit">편집</TabsTrigger>
                  <TabsTrigger value="preview">미리보기</TabsTrigger>
                </TabsList>

                <TabsContent value="edit">
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="마크다운으로 작성하세요..."
                    className="min-h-[420px] font-mono"
                  />
                </TabsContent>

                <TabsContent value="preview">
                  <Card className="min-h-[420px] p-6 bg-background">
                    <article className="prose prose-slate max-w-none dark:prose-invert">
                      <ReactMarkdown>
                        {markdown || "미리볼 내용이 없습니다."}
                      </ReactMarkdown>
                    </article>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-2"
                >
                  <Copy className="w-4 h-4" />
                  저장하고 복사하기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Posts;
