import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  createBlogTemplate,
  getErrorMessage,
  getMyBlogTemplate,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TemplateTitleSection,
  CategoriesSection,
  PlatformsSection,
  ShopUrlSection,
  ImagesSection,
  WordCountSection,
  TimeSection,
} from "@/components/AISettings";
import {
  PLATFORM_DISPLAY_TO_SLUG,
  PLATFORM_TO_DISPLAY,
} from "@/constants/AISettings";

const AISettings = () => {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [shopUrl, setShopUrl] = useState("");
  const [includeImage, setIncludeImage] = useState(false);
  const [imageCount, setImageCount] = useState("1");
  const [wordCount, setWordCount] = useState("500");
  const [generationTime, setGenerationTime] = useState("08:00");
  const [hasTemplate, setHasTemplate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const data = await getMyBlogTemplate();
        // 성공적으로 템플릿 조회됨 → 편집 모드
        setHasTemplate(true);
        setTitle(data.title || "");
        setSelectedCategories(
          Array.isArray(data.categories) ? data.categories : []
        );
        setSelectedBlogs(
          (Array.isArray(data.platforms) ? data.platforms : []).map(
            (p) => PLATFORM_TO_DISPLAY[p] || p
          )
        );
        setShopUrl(data.shopUrl || "");
        setIncludeImage(!!data.includeImages);
        setImageCount(
          data.includeImages && data.imageCount != null
            ? String(data.imageCount)
            : "1"
        );
        setWordCount(String(data.charLimit || 500));
        const time = (data.dailyPostTime || "08:00:00").slice(0, 5);
        setGenerationTime(time);
      } catch (err) {
        // 템플릿이 없거나 에러
        // 기본 제목: "{userName}의 템플릿"
        const storedName =
          (typeof window !== "undefined" &&
            (localStorage.getItem("userName") ||
              localStorage.getItem("username"))) ||
          "사용자";
        setTitle(`${storedName}의 템플릿`);
        setHasTemplate(false);
        // 에러가 404가 아닌 경우에만 안내
        try {
          const msg = await getErrorMessage(err);
          // 404나 템플릿 없음 메시지는 조용히 무시
          if (msg && !/not found|없습니다|존재하지/i.test(msg)) {
            toast({
              title: "템플릿 조회 실패",
              description: msg,
              variant: "destructive",
            });
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasTemplate) {
      toast({
        title: "수정 모드",
        description: "수정 API는 추후에 연동될 예정입니다.",
      });
      return;
    }

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

    const charLimit = Number(wordCount);
    const includeImages = !!includeImage;
    const parsedImageCount = includeImages ? Number(imageCount) : null;
    const apiDailyPostTime =
      generationTime && generationTime.length === 5
        ? `${generationTime}:00`
        : generationTime || "08:00:00";

    const validImageCount = includeImages ? (parsedImageCount || 0) >= 1 : true;
    const validCharLimit = Number.isFinite(charLimit) && charLimit > 0;
    const validDailyPostTime = /^\d{2}:\d{2}(:\d{2})?$/.test(apiDailyPostTime);

    if (!validCharLimit || !validDailyPostTime || !validImageCount) {
      toast({
        title: "입력값을 확인해주세요",
        description: "설정 값이 유효한지 확인 후 다시 시도해주세요.",
        variant: "destructive",
      });
      return;
    }

    const platformSlugs = selectedBlogs.map(
      (b) => PLATFORM_DISPLAY_TO_SLUG[b] || b
    );

    try {
      setSubmitting(true);
      await createBlogTemplate({
        title: title?.trim() || "블로그 템플릿",
        categories: selectedCategories,
        platforms: platformSlugs,
        shopUrl: shopUrl.trim(),
        includeImages,
        imageCount: parsedImageCount,
        charLimit,
        dailyPostTime: apiDailyPostTime,
        validImageCount,
        validCharLimit,
        validDailyPostTime,
      });
      setHasTemplate(true);
      toast({
        title: "템플릿이 생성되었습니다",
        description: "AI 블로그 템플릿이 성공적으로 저장되었습니다.",
        variant: "success",
      });
      // 생성 완료 후 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      const message = await getErrorMessage(error);
      toast({
        title: "저장 실패",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI 글쓰기 설정</h1>
          <p className="text-muted-foreground mt-1">
            블로그 콘텐츠 자동 생성을 위한 템플릿을 설정하세요
          </p>
        </div>

        <Card className="shadow-elevated max-w-4xl">
          <CardHeader>
            <CardTitle>블로그 템플릿 설정</CardTitle>
            <CardDescription>
              AI가 블로그 글을 생성할 때 사용할 설정을 지정하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <TemplateTitleSection
                title={title}
                setTitle={setTitle}
                loading={loading}
              />

              <CategoriesSection
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
              />

              <PlatformsSection
                selectedBlogs={selectedBlogs}
                toggleBlog={toggleBlog}
              />

              <ShopUrlSection
                shopUrl={shopUrl}
                setShopUrl={setShopUrl}
                loading={loading}
              />

              <ImagesSection
                includeImage={includeImage}
                setIncludeImage={setIncludeImage}
                imageCount={imageCount}
                setImageCount={setImageCount}
                loading={loading}
              />

              <WordCountSection
                wordCount={wordCount}
                setWordCount={setWordCount}
              />

              <TimeSection
                generationTime={generationTime}
                setGenerationTime={setGenerationTime}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  disabled={loading || submitting}
                >
                  {hasTemplate ? "수정하기" : "생성하기"}
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
