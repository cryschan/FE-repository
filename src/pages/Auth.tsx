import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft } from "lucide-react";
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

const Auth = () => {
  const { toast } = useToast();

  // 로그인 상태
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 모달 상태
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupStep, setSignupStep] = useState(1);

  // 1단계: 기본 정보
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");

  // 2단계: 블로그 프롬프트 설정
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [shopUrl, setShopUrl] = useState("");
  const [includeImage, setIncludeImage] = useState(false);
  const [imageCount, setImageCount] = useState("3");
  const [wordCount, setWordCount] = useState("500");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { email: loginEmail, password: loginPassword });
    try {
      localStorage.setItem("userEmail", loginEmail);
    } catch {}
  };

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

  const resetSignupForm = () => {
    setSignupStep(1);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDepartment("");
    setSelectedCategories([]);
    setSelectedBlogs([]);
    setShopUrl("");
    setIncludeImage(false);
    setImageCount("3");
    setWordCount("500");
  };

  const handleStep1Next = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !department.trim()
    ) {
      toast({
        title: "입력값을 확인해주세요",
        description: "모든 필드를 입력해야 합니다.",
      });
      return;
    }
    if (password.length < 8) {
      toast({
        title: "비밀번호 규칙",
        description: "비밀번호는 8자 이상이어야 합니다.",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
      });
      return;
    }
    setSignupStep(2);
  };

  const handleSignupComplete = () => {
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

    // TODO: Implement signup logic
    console.log("Signup:", {
      name,
      email,
      password,
      department,
      categories: selectedCategories,
      blogs: selectedBlogs,
      shopUrl,
      includeImage,
      imageCount: includeImage ? imageCount : null,
      wordCount,
    });

    try {
      localStorage.setItem("userEmail", email);
    } catch {}

    toast({
      title: "회원가입 완료",
      description: "환영합니다! 로그인해주세요.",
    });

    resetSignupForm();
    setSignupOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="p-8 shadow-elevated">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              AI 콘텐츠 자동화 플랫폼
            </h1>
            <p className="text-muted-foreground">로그인하여 시작하세요</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">이메일</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">비밀번호</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setSignupOpen(true)}
            >
              회원가입하기
            </Button>
          </form>
        </Card>
      </div>

      {/* 회원가입 모달 */}
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>회원가입 - {signupStep}/2단계</DialogTitle>
            <DialogDescription>
              {signupStep === 1
                ? "기본 정보를 입력해주세요"
                : "블로그 프롬프트 설정을 완료해주세요"}
            </DialogDescription>
          </DialogHeader>

          {signupStep === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">이름</Label>
                <Input
                  id="signup-name"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">이메일</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-department">부서</Label>
                <Input
                  id="signup-department"
                  placeholder="마케팅팀"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="8자 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">비밀번호 확인</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleStep1Next} className="w-full gap-2">
                다음 단계
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>관심 카테고리 (복수 선택)</Label>
                <div className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 gap-3">
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSignupStep(1)}
                  className="flex-1 gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </Button>
                <Button onClick={handleSignupComplete} className="flex-1">
                  회원가입 완료
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
