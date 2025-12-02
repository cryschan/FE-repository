import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMyProfileQuery, useUpdateProfileMutation } from "@/lib/queries";

// Zod 스키마 정의
const profileSchema = z.object({
  username: z.string().min(1, "이름은 필수입니다"),
  department: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// 스켈레톤 로딩 컴포넌트
function ProfileSkeleton() {
  return (
    <div className="bg-gradient-subtle">
      <div className="container mx-auto p-8 space-y-6 max-w-2xl">
        <div className="h-9 w-40 bg-muted animate-pulse rounded" />

        <Card className="shadow-elevated">
          <CardHeader>
            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 에러 상태 컴포넌트
function ProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-gradient-subtle">
      <div className="container mx-auto p-8 space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">내 정보 수정</h1>
        <Card className="shadow-elevated">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">!</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                프로필을 불러오지 못했습니다
              </h3>
              <p className="text-muted-foreground mb-6">
                네트워크 연결을 확인하고 다시 시도해주세요.
              </p>
              <Button onClick={onRetry}>다시 시도</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Profile = () => {
  const { data: profile, isLoading, isError, refetch } = useMyProfileQuery();
  const updateProfile = useUpdateProfileMutation();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      department: "",
    },
  });

  // 서버 데이터로 폼 초기화
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        department: profile.department || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        // 프로필 수정 성공 후 최신 데이터로 새로고침
        refetch();
        // localStorage의 userName 업데이트 (Topbar 동기화)
        try {
          localStorage.setItem("userName", data.username);
        } catch {}
      },
    });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return <ProfileError onRetry={() => refetch()} />;
  }

  return (
    <div className="bg-gradient-subtle">
      <div className="container mx-auto p-8 space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">내 정보 수정</h1>

        {/* 프로필 정보 */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>
              이름과 부서 정보를 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        이름 <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="홍길동"
                          aria-required="true"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none"
                  >
                    이메일
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    aria-describedby="email-description"
                    className="bg-muted"
                  />
                  <p
                    id="email-description"
                    className="text-sm text-muted-foreground"
                  >
                    이메일은 변경할 수 없습니다
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>부서</FormLabel>
                      <FormControl>
                        <Input placeholder="마케팅팀" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending || !form.formState.isDirty}
                    className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      "변경사항 저장"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* 계정 정보 (읽기 전용) */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>계정 정보</CardTitle>
            <CardDescription>계정 관련 정보입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">역할</p>
                <p className="font-medium">
                  {profile?.role === "ADMIN" ? "관리자" : "일반 사용자"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">토큰 사용량</p>
                <p className="font-medium">
                  {profile?.tokenUsage?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">가입일</p>
                <p className="font-medium">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("ko-KR")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">최근 수정일</p>
                <p className="font-medium">
                  {profile?.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString("ko-KR")
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비밀번호 변경 - 준비 중 */}
        <Card className="shadow-elevated opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              비밀번호 변경
              <span className="text-xs font-normal bg-muted px-2 py-1 rounded">
                준비 중
              </span>
            </CardTitle>
            <CardDescription>
              비밀번호 변경 기능은 곧 추가될 예정입니다
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
