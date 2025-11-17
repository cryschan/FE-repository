import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const Editor = () => {
  const [markdown, setMarkdown] = useState(
    `# 여름 남성 반팔 티셔츠 추천

## 시원하고 스타일리시한 여름 필수 아이템

여름철 필수 아이템인 반팔 티셔츠! 시원하면서도 스타일리시한 제품들을 소개합니다.

### 추천 제품 특징

- **통풍성**: 땀 흡수가 빠른 소재
- **편안한 핏**: 활동하기 편한 디자인
- **다양한 색상**: 어떤 스타일에도 매치 가능

### 코디 팁

1. 데님 팬츠와 함께 캐주얼하게
2. 반바지와 매치해서 여름 느낌 UP
3. 가디건을 걸쳐 레이어드 스타일

더 많은 제품을 보려면 [여기를 클릭](https://example.com)하세요!`
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // TODO: Implement AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving:", markdown);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              대시보드로 돌아가기
            </Link>
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? "생성 중..." : "AI로 생성"}
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              저장
            </Button>
          </div>
        </div>

        {/* Editor */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>블로그 글 편집</CardTitle>
            <CardDescription>
              마크다운으로 작성하고 미리보기에서 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="edit">편집</TabsTrigger>
                <TabsTrigger value="preview">미리보기</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="마크다운으로 작성하세요..."
                  className="min-h-[600px] font-mono"
                />
              </TabsContent>

              <TabsContent value="preview">
                <Card className="min-h-[600px] p-6 bg-background">
                  <article className="prose prose-slate max-w-none">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  </article>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>AI 생성 설정</CardTitle>
            <CardDescription>
              키워드와 타겟을 지정하여 더 정확한 콘텐츠를 생성하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  키워드
                </label>
                <Textarea
                  placeholder="예: 남성 티셔츠, 여름 패션"
                  className="h-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  타겟 제품 URL
                </label>
                <Textarea
                  placeholder="https://yourshop.com/product"
                  className="h-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Editor;
