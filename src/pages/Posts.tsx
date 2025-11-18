import { useState } from "react";
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

type Post = {
  id: string;
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

// 날짜 포맷 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

// AI가 자동으로 생성한 글 목록 (Mock 데이터)
const mockPosts: Post[] = [
  {
    id: "1",
    title: "여름 남성 반팔 티셔츠 추천 - 시원하고 스타일리시한",
    content:
      "# 여름 남성 반팔 티셔츠 추천\n\n여름철 필수 아이템인 반팔 티셔츠를 소개합니다...",
    category: "남성 의류",
    createdAt: "2025-11-15",
    isToday: true,
  },
  {
    id: "2",
    title: "메이크업 초보자를 위한 베이스 메이크업 제품 가이드",
    content:
      "# 베이스 메이크업 가이드\n\n초보자도 쉽게 따라할 수 있는 베이스 메이크업...",
    category: "메이크업 제품",
    createdAt: "2025-11-14",
    isToday: false,
  },
  {
    id: "3",
    title: "편안한 운동화 추천 - 일상에서 신기 좋은",
    content:
      "# 운동화 추천\n\n일상생활에서 편하게 신을 수 있는 운동화를 추천합니다...",
    category: "신발",
    createdAt: "2025-11-13",
    isToday: false,
  },
  {
    id: "4",
    title: "겨울 패딩 추천 - 따뜻하고 가벼운",
    content: "# 겨울 패딩 추천\n\n가볍고 따뜻한 겨울 패딩을 소개합니다...",
    category: "여성 의류",
    createdAt: "2025-11-12",
    isToday: false,
  },
  {
    id: "5",
    title: "스킨케어 루틴 완벽 가이드",
    content: "# 스킨케어 루틴\n\n올바른 스킨케어 순서와 제품 추천...",
    category: "메이크업 제품",
    createdAt: "2025-11-11",
    isToday: false,
  },
  {
    id: "6",
    title: "홈 인테리어 소품 추천",
    content: "# 인테리어 소품\n\n집을 더 아늑하게 만들어줄 소품들...",
    category: "생활용품",
    createdAt: "2025-11-10",
    isToday: false,
  },
  {
    id: "7",
    title: "최신 노트북 비교 리뷰",
    content: "# 노트북 리뷰\n\n2024년 최신 노트북 비교 분석...",
    category: "전자제품",
    createdAt: "2025-11-09",
    isToday: false,
  },
  {
    id: "8",
    title: "건강한 간식 추천",
    content: "# 건강 간식\n\n맛있고 건강한 간식 추천...",
    category: "식품",
    createdAt: "2025-11-08",
    isToday: false,
  },
  {
    id: "9",
    title: "남성 액세서리 추천 - 시계와 팔찌",
    content: "# 남성 액세서리\n\n스타일을 완성하는 액세서리...",
    category: "액세서리",
    createdAt: "2025-11-07",
    isToday: false,
  },
  {
    id: "10",
    title: "여성 가방 추천 - 실용적이고 예쁜",
    content: "# 여성 가방\n\n실용성과 디자인을 모두 갖춘 가방...",
    category: "액세서리",
    createdAt: "2025-11-06",
    isToday: false,
  },
  {
    id: "11",
    title: "주방 용품 추천 - 요리가 즐거워지는",
    content: "# 주방 용품\n\n요리를 더 편하게 만들어줄 용품들...",
    category: "생활용품",
    createdAt: "2025-11-05",
    isToday: false,
  },
  {
    id: "12",
    title: "무선 이어폰 추천 - 음질과 편의성",
    content: "# 무선 이어폰\n\n최고의 무선 이어폰 추천...",
    category: "전자제품",
    createdAt: "2025-11-04",
    isToday: false,
  },
];

const Posts = () => {
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

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

      // 클립보드에 복사
      try {
        const textToCopy = `${title.trim()}\n\n${markdown}`;
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "저장 및 복사 완료",
          description: "게시글이 수정되고 클립보드에 복사되었습니다.",
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

  // 오늘 글과 이전 글 분리 (오늘 글은 1개만)
  const todayPost = filteredPosts.find((post) => post.isToday);
  const previousPosts = filteredPosts.filter((post) => !post.isToday);

  // 페이지네이션
  const totalPages = Math.ceil(previousPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = previousPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

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
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
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
                    {formatDate(todayPost.createdAt)}
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
            <CardDescription>
              최신순으로 정렬된 블로그 글 목록입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paginatedPosts.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                해당 카테고리에 글이 없습니다.
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                          {formatDate(post.createdAt)}
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
              </>
            )}
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
