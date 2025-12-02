import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  createBlogTemplate,
  updateMyBlogTemplate,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CATEGORIES,
} from "@/constants/AISettings";

const SHOP_URL = "https://ssadagu.kr/";

const AISettings = () => {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    ...CATEGORIES,
  ]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [shopUrl, setShopUrl] = useState(SHOP_URL);
  const [includeImage, setIncludeImage] = useState(false);
  const [imageCount, setImageCount] = useState("0");
  const [wordCount, setWordCount] = useState("500");
  const [generationTime, setGenerationTime] = useState("08:00");
  const [hasTemplate, setHasTemplate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const data = await getMyBlogTemplate();
        // 성공적으로 템플릿 조회됨 → 편집 모드
        setHasTemplate(true);
        setTitle(data.title || "");
        setSelectedCategories(
          Array.isArray(data.categories)
            ? data.categories.filter((c) =>
                (CATEGORIES as readonly string[]).includes(c)
              )
            : []
        );
        setAvailableCategories([...CATEGORIES]);
        setSelectedBlogs(
          (Array.isArray(data.platforms) ? data.platforms : []).map(
            (p) => PLATFORM_TO_DISPLAY[p] || p
          )
        );
        setShopUrl(data.shopUrl || "");
        setIncludeImage(!!data.includeImages);
        if (data.includeImages && data.imageCount != null) {
          const cnt = String(data.imageCount);
          setImageCount(cnt);
        } else {
          setImageCount("0");
        }
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
        setAvailableCategories([...CATEGORIES]);
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

  // ===== Helpers =====
  const normalizeDailyPostTime = (time: string): string => {
    return time && time.length === 5 ? `${time}:00` : time || "08:00:00";
  };

  const buildTemplateRequest = () => {
    const platformSlugs = selectedBlogs.map(
      (b) => PLATFORM_DISPLAY_TO_SLUG[b] || b
    );
    const charLimitNum = Number(wordCount);
    const includeImages = !!includeImage;
    const imageCountNum = includeImages ? Number(imageCount) : 0;
    const dailyPostTime = normalizeDailyPostTime(generationTime);

    const payload = {
      title: title?.trim() || "블로그 템플릿",
      categories: selectedCategories.filter((c) =>
        (CATEGORIES as readonly string[]).includes(c)
      ),
      platforms: platformSlugs,
      shopUrl: shopUrl.trim(),
      includeImages,
      imageCount: imageCountNum,
      charLimit: charLimitNum,
      dailyPostTime,
    };

    return { payload };
  };

  const submitTemplate = async (payload: any): Promise<boolean> => {
    setSubmitting(true);
    try {
      if (hasTemplate) {
        await updateMyBlogTemplate(payload);
        toast({
          title: "템플릿이 수정되었습니다",
          description: "변경사항이 저장되었습니다.",
          variant: "success",
        });
        setOpen(false);
      } else {
        await createBlogTemplate(payload);
        setHasTemplate(true);
        const successToast = {
          title: "템플릿이 생성되었습니다",
          description: "AI 블로그 템플릿이 성공적으로 저장되었습니다.",
          variant: "success",
        } as const;
        toast(successToast);
        // 새로고침 대신 모달만 닫고, 상단 카드가 최신 상태를 즉시 보여주도록 유지
        setOpen(false);
      }
      return true;
    } catch (error) {
      const message = await getErrorMessage(error);
      toast({
        title: "요청 실패",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    if (selectedCategories.length === 0 || selectedBlogs.length === 0) {
      toast({
        title: "선택 필요",
        description: "관심 카테고리와 블로그를 최소 1개 이상 선택해주세요.",
      });
      return false;
    }
    if (!shopUrl.trim()) {
      toast({
        title: "입력값을 확인해주세요",
        description: "쇼핑몰 URL을 입력해주세요.",
      });
      return false;
    }

    const { payload } = buildTemplateRequest();
    const isCharLimitValid =
      Number.isFinite(payload.charLimit) && payload.charLimit > 0;
    const isDailyTimeValid = /^\d{2}:\d{2}(:\d{2})?$/.test(
      payload.dailyPostTime
    );
    const isImageCountValid = payload.includeImages
      ? (payload.imageCount || 0) >= 1
      : true;
    if (!isCharLimitValid || !isDailyTimeValid || !isImageCountValid) {
      toast({
        title: "입력값을 확인해주세요",
        description: "설정 값이 유효한지 확인 후 다시 시도해주세요.",
        variant: "destructive",
      });
      return false;
    }

    return await submitTemplate(payload);
  };

  const handleIncludeImageChange = (checked: boolean) => {
    setIncludeImage(checked);
    if (!checked) {
      setImageCount("0");
    } else {
      // 토글을 켜면 이미지 개수를 1개로 고정
      setImageCount("1");
    }
  };

  const handleImageCountChange = (value: string) => {
    setImageCount(value);
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 pb-16 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI 글쓰기 설정</h1>
          <p className="text-muted-foreground mt-1">
            나만의 템플릿을 만들고 관리하세요
          </p>
        </div>

        {/* 목록 화면 */}
        <div className="max-w-4xl space-y-4">
          {loading ? (
            <Card className="shadow-elevated">
              <CardContent className="p-6 text-muted-foreground">
                템플릿 정보를 불러오는 중입니다...
              </CardContent>
            </Card>
          ) : hasTemplate ? (
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{title || "내 템플릿"}</span>
                  <Button
                    onClick={() => setOpen(true)}
                    className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    수정하기
                  </Button>
                </CardTitle>
                <CardDescription>
                  템플릿을 수정하면 이후 생성되는 글에 적용돼요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>카테고리: {selectedCategories.join(", ") || "-"}</div>
                  <div>블로그: {selectedBlogs.join(", ") || "-"}</div>
                  <div>쇼핑몰 URL: {shopUrl || "-"}</div>
                  <div>
                    이미지 포함: {includeImage ? `Y (${imageCount}개)` : "N"}
                  </div>
                  <div>글자수 제한: {wordCount}자</div>
                  <div>매일 생성 시간: {generationTime}</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle>아직 템플릿이 없어요</CardTitle>
                <CardDescription>
                  버튼을 눌러 나만의 템플릿을 생성해 보세요
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  나만의 템플릿 설정하기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 생성/수정 모달 */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {hasTemplate ? "템플릿 수정" : "템플릿 생성"}
              </DialogTitle>
              <DialogDescription>
                AI가 블로그 글을 생성할 때 사용할 설정을 지정하세요
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                const ok = await handleSave(e);
                if (ok && !hasTemplate) {
                  setOpen(false);
                }
              }}
              className="space-y-6"
            >
              <TemplateTitleSection
                title={title}
                setTitle={setTitle}
                loading={loading}
              />

              <CategoriesSection
                categories={availableCategories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
              />

              <PlatformsSection
                selectedBlogs={selectedBlogs}
                toggleBlog={toggleBlog}
              />

              <ShopUrlSection shopUrl={shopUrl} setShopUrl={setShopUrl} />

              <ImagesSection
                includeImage={includeImage}
                setIncludeImage={handleIncludeImageChange}
                imageCount={imageCount}
                setImageCount={handleImageCountChange}
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AISettings;
