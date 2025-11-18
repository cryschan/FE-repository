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

const CATEGORIES = ["패션", "뷰티", "가전", "스포츠", "식품", "생활", "도서"];

const BLOG_PLATFORMS = [
  "네이버 블로그",
  "티스토리",
  "미디움",
  "브런치",
  "벨로그",
];

const Profile = () => {
  const { toast } = useToast();

  // 프로필 정보 상태
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [shopUrl, setShopUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [includeImage, setIncludeImage] = useState(false);
  const [imageCount, setImageCount] = useState("3");
  const [wordCount, setWordCount] = useState("500");

  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({
        title: "입력값을 확인해주세요",
        description: "이름과 이메일은 필수입니다.",
      });
      return;
    }

    // TODO: API 연동
    // console.log("profile.update", { name, email, shopUrl, categories: selectedCategories });

    toast({
      title: "프로필이 저장되었습니다",
      description: "변경사항이 성공적으로 적용되었습니다.",
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "입력값을 확인해주세요",
        description: "모든 비밀번호 필드를 입력하세요.",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "비밀번호 규칙",
        description: "새 비밀번호는 8자 이상이어야 합니다.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 확인이 일치하지 않습니다.",
      });
      return;
    }
    if (currentPassword === newPassword) {
      toast({
        title: "변경 필요",
        description: "현재 비밀번호와 다른 비밀번호를 입력하세요.",
      });
      return;
    }

    // TODO: API 연동
    // console.log("password.change", { currentPassword, newPassword });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({
      title: "비밀번호가 변경되었습니다",
      description: "다음 로그인부터 적용됩니다.",
    });
  };

  return (
    <div className="bg-gradient-subtle">
      <div className="container mx-auto p-8 space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">내 정보 수정</h1>

        {/* 프로필 정보 */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>
              이름, 이메일, 쇼핑몰 URL, 관심 카테고리를 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">부서</Label>
                <Input
                  id="department"
                  placeholder="마케팅팀"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopUrl">쇼핑몰 URL</Label>
                <Input
                  id="shopUrl"
                  type="url"
                  placeholder="https://yourshop.com"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>관심 카테고리</Label>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                <Label>포스팅할 블로그</Label>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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

              <div className="border-t pt-4 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  블로그 프롬프트 설정
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-include-image">이미지 포함</Label>
                      <p className="text-sm text-muted-foreground">
                        블로그 글에 이미지를 포함할지 선택하세요
                      </p>
                    </div>
                    <Switch
                      id="profile-include-image"
                      checked={includeImage}
                      onCheckedChange={setIncludeImage}
                    />
                  </div>

                  {includeImage && (
                    <div className="space-y-2">
                      <Label htmlFor="profile-image-count">이미지 개수</Label>
                      <Select value={imageCount} onValueChange={setImageCount}>
                        <SelectTrigger id="profile-image-count">
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
                  <Label htmlFor="profile-word-count">글자수</Label>
                  <Select value={wordCount} onValueChange={setWordCount}>
                    <SelectTrigger id="profile-word-count">
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
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  변경사항 저장
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 비밀번호 변경 */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
            <CardDescription>
              현재 비밀번호를 확인하고 새 비밀번호로 변경하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 max-w-xl"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  비밀번호 변경
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
