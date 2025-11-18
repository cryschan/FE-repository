import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "남성 의류",
  "여성 의류",
  "생활용품",
  "신발",
  "메이크업 제품",
  "액세서리",
  "전자제품",
  "식품",
];

const BLOG_PLATFORMS = [
  "네이버 블로그",
  "티스토리",
  "미디움",
  "브런치",
  "벨로그",
];

const AISettings = () => {
  const { toast } = useToast();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [shopUrl, setShopUrl] = useState("");
  const [includeImage, setIncludeImage] = useState(false);
  const [imageCount, setImageCount] = useState("1");
  const [wordCount, setWordCount] = useState("500");
  const [generationTime, setGenerationTime] = useState("08:00");

  const toggleCategory = (value: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked
        ? Array.from(new Set([...prev, value]))
        : prev.filter((v) => v !== value)
    );
  };

  const toggleBlog = (value: string, checked: boolean) => {
    setSelectedBlogs((prev) =>
      checked
        ? Array.from(new Set([...prev, value]))
        : prev.filter((v) => v !== value)
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0 || selectedBlogs.length === 0) {
      toast({
        title: "선택 필요",
        description: "관심 카테고리와 블로그를 최소 1개 이상 선택해주세요.",
      });
      return;
    }
    if (!shopUrl.trim()) {
      toast({
        title: "입력값을 확인해주세요",
        description: "쇼핑몰 URL을 입력해주세요.",
      });
      return;
    }

    // TODO: API 연동
    console.log("AI Settings:", {
      categories: selectedCategories,
      blogs: selectedBlogs,
      shopUrl,
      includeImage,
      imageCount: includeImage ? imageCount : null,
      wordCount,
      generationTime,
    });

    toast({
      title: "설정이 저장되었습니다",
      description: "AI 글쓰기 설정이 성공적으로 저장되었습니다.",
    });
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI 글쓰기 설정</h1>
          <p className="text-muted-foreground mt-1">
            블로그 콘텐츠 자동 생성을 위한 프롬프트를 설정하세요
          </p>
        </div>

        <Card className="shadow-elevated max-w-4xl">
          <CardHeader>
            <CardTitle>블로그 프롬프트 설정</CardTitle>
            <CardDescription>
              AI가 블로그 글을 생성할 때 사용할 설정을 지정하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-3">
                <Label>관심 카테고리 (복수 선택)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => {
                    const checked = selectedCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => toggleCategory(cat, !!c)}
                        />
                        <span className="text-sm text-foreground">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label>포스팅할 블로그 (복수 선택)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BLOG_PLATFORMS.map((blog) => {
                    const checked = selectedBlogs.includes(blog);
                    return (
                      <label
                        key={blog}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => toggleBlog(blog, !!c)}
                        />
                        <span className="text-sm text-foreground">{blog}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shop-url">쇼핑몰 URL</Label>
                <Input
                  id="shop-url"
                  type="url"
                  placeholder="https://yourshop.com"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-image">이미지 포함</Label>
                    <p className="text-sm text-muted-foreground">
                      블로그 글에 이미지를 포함할지 선택하세요
                    </p>
                  </div>
                  <Switch
                    id="include-image"
                    checked={includeImage}
                    onCheckedChange={setIncludeImage}
                  />
                </div>

                {includeImage && (
                  <div className="space-y-2">
                    <Label htmlFor="image-count">이미지 개수</Label>
                    <Select value={imageCount} onValueChange={setImageCount}>
                      <SelectTrigger id="image-count">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1개</SelectItem>
                        <SelectItem value="2">2개</SelectItem>
                        <SelectItem value="3">3개</SelectItem>
                        <SelectItem value="4">4개</SelectItem>
                        <SelectItem value="5">5개</SelectItem>
                        <SelectItem value="6">6개</SelectItem>
                        <SelectItem value="7">7개</SelectItem>
                        <SelectItem value="8">8개</SelectItem>
                        <SelectItem value="9">9개</SelectItem>
                        <SelectItem value="10">10개</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="word-count">글자수</Label>
                <Select value={wordCount} onValueChange={setWordCount}>
                  <SelectTrigger id="word-count">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">500자 이하</SelectItem>
                    <SelectItem value="1000">1000자 이하</SelectItem>
                    <SelectItem value="1500">1500자 이하</SelectItem>
                    <SelectItem value="2000">2000자 이하</SelectItem>
                    <SelectItem value="2500">2500자 이하</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="generation-time">매일 글 생성 시간</Label>
                <Select
                  value={generationTime}
                  onValueChange={setGenerationTime}
                >
                  <SelectTrigger id="generation-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00:00">오전 12시 (자정)</SelectItem>
                    <SelectItem value="01:00">오전 1시</SelectItem>
                    <SelectItem value="02:00">오전 2시</SelectItem>
                    <SelectItem value="03:00">오전 3시</SelectItem>
                    <SelectItem value="04:00">오전 4시</SelectItem>
                    <SelectItem value="05:00">오전 5시</SelectItem>
                    <SelectItem value="06:00">오전 6시</SelectItem>
                    <SelectItem value="07:00">오전 7시</SelectItem>
                    <SelectItem value="08:00">오전 8시</SelectItem>
                    <SelectItem value="09:00">오전 9시</SelectItem>
                    <SelectItem value="10:00">오전 10시</SelectItem>
                    <SelectItem value="11:00">오전 11시</SelectItem>
                    <SelectItem value="12:00">오후 12시 (정오)</SelectItem>
                    <SelectItem value="13:00">오후 1시</SelectItem>
                    <SelectItem value="14:00">오후 2시</SelectItem>
                    <SelectItem value="15:00">오후 3시</SelectItem>
                    <SelectItem value="16:00">오후 4시</SelectItem>
                    <SelectItem value="17:00">오후 5시</SelectItem>
                    <SelectItem value="18:00">오후 6시</SelectItem>
                    <SelectItem value="19:00">오후 7시</SelectItem>
                    <SelectItem value="20:00">오후 8시</SelectItem>
                    <SelectItem value="21:00">오후 9시</SelectItem>
                    <SelectItem value="22:00">오후 10시</SelectItem>
                    <SelectItem value="23:00">오후 11시</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  매일 선택한 시간에 AI가 자동으로 블로그 글을 생성합니다
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  설정 저장
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AISettings;
