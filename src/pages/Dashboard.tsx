import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Coins, Users } from "lucide-react";
import { useDashboardQuery } from "@/lib/queries";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#6366f1",
  "#14b8a6",
  "#f97316",
];

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

const Dashboard = () => {
  // Dashboard API 데이터 조회
  const { data: dashboardData, isLoading, isError, error } = useDashboardQuery();

  // 통계 카드 데이터
  const todayPostCount = dashboardData?.todayBlogCount ?? 0;
  const activeUserCount = dashboardData?.activeUserCount ?? 0;
  const totalBlogCount = dashboardData?.totalBlogCount ?? 0;
  const totalTokens = dashboardData?.totalTokenUsage ?? 0;
  
  // 오늘 작성된 글 목록
  const todayBlogList = dashboardData?.todayBlogItemList ?? [];

  // 카테고리별 글 분포 (차트용)
  const categoryData = Object.entries(dashboardData?.categoryDistribution ?? {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // 블로그 플랫폼별 사용 횟수 (차트용)
  const blogPlatformData = Object.entries(dashboardData?.platformUsage ?? {}).map(
    ([platform, count]) => ({
      platform,
      count,
    })
  );

  // 에러 상태 처리
  if (isError) {
    // 에러 로깅
    if (import.meta.env.DEV) {
      console.error("[Dashboard Component Error]", {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    } else {
      // 프로덕션: 기본 로깅만
      console.error("[Dashboard Component Error]", error instanceof Error ? error.message : "Unknown error");
    }

    return (
      <div className="bg-gradient-subtle">
        <div className="w-full mx-auto p-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-lg font-medium text-destructive mb-2">
                  데이터를 불러오는 중 오류가 발생했습니다.
                </p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              관리자 대시보드
            </h1>
            <p className="text-muted-foreground mt-1">
              오늘의 콘텐츠 생성 현황을 확인하세요
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                오늘 작성된 글
              </CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? "-" : todayPostCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                오늘 생성된 글 수
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                활성 사용자
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? "-" : activeUserCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                현재 활성 사용자 수
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                총 글 수
              </CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? "-" : totalBlogCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                전체 생성된 글 수
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                사용한 토큰 수
              </CardTitle>
              <Coins className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? "-" : totalTokens.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                오늘 총 사용량
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Distribution Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>카테고리별 글 분포</CardTitle>
              <CardDescription>카테고리별 글 작성 분포</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  로딩 중...
                </div>
              ) : categoryData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  데이터가 없습니다.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Blog Platform Usage Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>블로그 플랫폼 사용 현황</CardTitle>
              <CardDescription>플랫폼별 글 작성 횟수</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  로딩 중...
                </div>
              ) : blogPlatformData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  데이터가 없습니다.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={blogPlatformData}>
                    <XAxis
                      dataKey="platform"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Articles */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>오늘 작성된 글</CardTitle>
            <CardDescription>오늘 생성된 글 목록</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                로딩 중...
              </div>
            ) : todayBlogList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                오늘 작성된 글이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {todayBlogList.map((article) => (
                  <div
                    key={`${article.title}-${article.createdAt}`}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">
                          {article.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {article.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
