import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  useSignupMutation,
  useLoginMutation,
  useEmailCheckMutation,
} from "@/lib/queries";
import type { SignupRequest, LoginRequest } from "@/lib/api";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // React Query Mutations
  const signupMutation = useSignupMutation();
  const loginMutation = useLoginMutation();
  const emailCheckMutation = useEmailCheckMutation();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail.trim() || !loginPassword) {
      toast({
        title: "입력값을 확인해주세요",
        description: "이메일과 비밀번호를 모두 입력해야 합니다.",
      });
      return;
    }

    const loginData: LoginRequest = {
      email: loginEmail.trim(),
      password: loginPassword,
    };

    try {
      await loginMutation.mutateAsync(loginData);
      localStorage.setItem("userEmail", loginEmail);
      // 로그인 성공 시 루트로 이동
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (error) {
      // 에러는 mutation의 onError에서 처리됨
    }
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

    try {
      const response = await emailCheckMutation.mutateAsync(email);
      setEmailChecked(true);
      setIsEmailAvailable(response.available);
    } catch (error) {
      // 에러는 mutation의 onError에서 처리됨
      setEmailChecked(false);
      setIsEmailAvailable(false);
    }
  };

  const handleSignupComplete = async () => {
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
    // 이메일 중복확인 비활성화: 체크 없이 진행
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

    const signupData: SignupRequest = {
      username: name.trim(),
      email: email.trim(),
      department: department.trim(),
      password: password,
    };

    try {
      await signupMutation.mutateAsync(signupData);

      try {
        localStorage.setItem("userEmail", email);
      } catch {}

      resetSignupForm();
      setSignupOpen(false);
    } catch (error) {
      // 에러는 mutation의 onError에서 처리됨
    }
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
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
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
                  onClick={() => {}}
                  disabled
                  title="준비중입니다"
                  className="whitespace-nowrap bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground cursor-not-allowed"
                >
                  중복확인 (준비중)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                이메일 중복확인 기능은 준비중입니다.
              </p>
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
            <Button
              onClick={handleSignupComplete}
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "회원가입 중..." : "회원가입"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
