import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { toast } = useToast();

  // 로그인 상태
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 모달 상태
  const [signupOpen, setSignupOpen] = useState(false);

  // 기본 정보
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");

  // 이메일 중복 확인 상태
  const [emailChecked, setEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log("Login:", { email: loginEmail, password: loginPassword });
    try {
      localStorage.setItem("userEmail", loginEmail);
    } catch {}
  };

  const resetSignupForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDepartment("");
    setEmailChecked(false);
    setIsEmailAvailable(false);
  };

  const handleEmailCheck = async () => {
    if (!email.trim()) {
      toast({
        title: "이메일을 입력해주세요",
        description: "중복 확인할 이메일을 먼저 입력해주세요.",
      });
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "이메일 형식 오류",
        description: "올바른 이메일 형식을 입력해주세요.",
      });
      return;
    }

    // TODO: API 연동 - 실제로는 서버에 중복 확인 요청
    // 임시로 랜덤하게 사용 가능/불가능 판단 (실제로는 API 응답 사용)
    const isAvailable = !email.includes("test@test.com"); // 예시: test@test.com은 중복으로 처리

    setEmailChecked(true);
    setIsEmailAvailable(isAvailable);

    if (isAvailable) {
      toast({
        title: "사용 가능한 이메일입니다",
        description: "해당 이메일로 회원가입을 진행할 수 있습니다.",
      });
    } else {
      toast({
        title: "이미 사용 중인 이메일입니다",
        description: "다른 이메일을 사용해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleSignupComplete = () => {
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
    if (!emailChecked || !isEmailAvailable) {
      toast({
        title: "이메일 중복 확인 필요",
        description: "이메일 중복 확인을 완료해주세요.",
        variant: "destructive",
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

    // TODO: Implement signup logic
    console.log("Signup:", {
      name,
      email,
      password,
      department,
    });

    try {
      localStorage.setItem("userEmail", email);
    } catch {}

    toast({
      title: "회원가입 완료",
      description: "환영합니다! 로그인 후 AI 글쓰기 설정을 완료해주세요.",
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
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={() => setSignupOpen(true)}
                className="text-primary hover:underline font-medium"
              >
                회원가입하기
              </button>
            </p>
          </div>
        </Card>
      </div>

      {/* 회원가입 모달 */}
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>회원가입</DialogTitle>
            <DialogDescription>기본 정보를 입력해주세요</DialogDescription>
          </DialogHeader>

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
              <div className="flex gap-2">
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailChecked(false);
                    setIsEmailAvailable(false);
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleEmailCheck}
                  className="whitespace-nowrap bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  중복확인
                </Button>
              </div>
              {emailChecked && (
                <p
                  className={`text-sm ${
                    isEmailAvailable
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isEmailAvailable
                    ? "✓ 사용 가능한 이메일입니다"
                    : "✗ 이미 사용 중인 이메일입니다"}
                </p>
              )}
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
            <Button onClick={handleSignupComplete} className="w-full">
              회원가입
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
