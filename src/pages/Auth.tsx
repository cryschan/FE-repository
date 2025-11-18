import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [shopUrl, setShopUrl] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { email, password });
    try {
      localStorage.setItem("userEmail", email);
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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log("Signup:", {
      email,
      password,
      categories: selectedCategories,
      blogs: selectedBlogs,
      shopUrl,
    });
    try {
      localStorage.setItem("userEmail", email);
    } catch {}
  };

  return (
    <div className="bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="p-8 shadow-elevated">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              AI 콘텐츠 자동화 플랫폼
            </h1>
            <p className="text-muted-foreground">
              시작하려면 로그인하거나 회원가입하세요
            </p>
          </div>

          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">이메일</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">비밀번호</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  로그인
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">이메일</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>관심 카테고리 (복수 선택 가능)</Label>
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
                  <Label>포스팅할 블로그 (복수 선택 가능)</Label>
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
                          <span className="text-sm text-foreground">
                            {blog}
                          </span>
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
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  회원가입
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
