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

  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    variant: "success",
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
    variant: "success",
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
              이름, 이메일, 부서 정보를 관리하세요
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

              <div className="flex justify-end pt-4">
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
