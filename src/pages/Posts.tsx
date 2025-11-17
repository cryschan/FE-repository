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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const Posts = () => {
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");

  const resetForm = () => {
    setTitle("");
    setMarkdown("");
  };

  const handleSave = () => {
    if (!title.trim() || !markdown.trim()) {
      toast({
        title: "입력값을 확인해주세요",
        description: "제목과 본문을 모두 작성해야 합니다.",
      });
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: title.trim(),
      content: markdown,
      createdAt: new Date().toLocaleString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    toast({
      title: "게시글이 생성되었습니다",
      description: "블로그 글 목록에서 확인할 수 있습니다.",
    });
    resetForm();
    setOpen(false);
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">블로그 글 관리</h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                생성하기
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">새 글 생성</h2>
                </div>
              </div>

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
                    className="min-h[420px] md:min-h-[420px] font-mono"
                  />
                </TabsContent>

                <TabsContent value="preview">
                  <Card className="min-h-[420px] p-6 bg-background">
                    <article className="prose prose-slate max-w-none">
                      <ReactMarkdown>
                        {markdown || "미리볼 내용이 없습니다."}
                      </ReactMarkdown>
                    </article>
                  </Card>
                </TabsContent>
              </Tabs>

              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                저장
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-elevated">
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                아직 데이터가 없습니다. 우측 상단의 ‘생성하기’ 버튼으로 새 글을
                만들어보세요.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">작성일</TableHead>
                    <TableHead className="w-[280px]">제목</TableHead>
                    <TableHead>내용</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="whitespace-nowrap">
                        {post.createdAt}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {post.title}
                      </TableCell>
                      <TableCell className="max-w-[560px] truncate">
                        {post.content}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Posts;
