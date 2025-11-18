import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Tag, Globe, Coins } from "lucide-react";
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

// 관리자 대시보드 - 오늘 작성된 글 데이터 (복붙 버튼 클릭 시 집계)
const todayArticles = [
  {
    id: 1,
    userName: "김철수",
    title: "여름 남성 반팔 티셔츠 추천",
    category: "남성 의류",
    blogs: ["네이버 블로그", "티스토리"],
    tokensUsed: 1250,
    createdAt: "2024-01-15 09:30",
  },
  {
    id: 2,
    userName: "이영희",
    title: "메이크업 초보자 가이드",
    category: "메이크업 제품",
    blogs: ["티스토리", "미디움"],
    tokensUsed: 980,
    createdAt: "2024-01-15 10:15",
  },
  {
    id: 3,
    userName: "박민수",
    title: "편안한 운동화 추천",
    category: "신발",
    blogs: ["네이버 블로그"],
    tokensUsed: 1100,
    createdAt: "2024-01-15 11:20",
  },
  {
    id: 4,
    userName: "최지은",
    title: "겨울 패딩 추천",
    category: "여성 의류",
    blogs: ["미디움", "벨로그"],
    tokensUsed: 1350,
    createdAt: "2024-01-15 13:45",
  },
  {
    id: 5,
    userName: "정수진",
    title: "스킨케어 루틴 가이드",
    category: "메이크업 제품",
    blogs: ["브런치", "네이버 블로그"],
    tokensUsed: 1420,
    createdAt: "2024-01-15 14:30",
  },
];

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

const Dashboard = () => {
  // 오늘 작성된 글 수
  const todayPostCount = todayArticles.length;

  // 총 사용 토큰 수
  const totalTokens = todayArticles.reduce(
    (sum, article) => sum + article.tokensUsed,
    0
  );

  // 카테고리별 글 수
  const categoryCount = todayArticles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));

  // 블로그 플랫폼별 사용 횟수
  const blogPlatformCount = todayArticles.reduce((acc, article) => {
    article.blogs.forEach((blog) => {
      acc[blog] = (acc[blog] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const blogPlatformData = Object.entries(blogPlatformCount).map(
    ([platform, count]) => ({
      platform,
      count,
    })
  );

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
                {todayPostCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                복붙 버튼 클릭 집계
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                관심 카테고리
              </CardTitle>
              <Tag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {Object.keys(categoryCount).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                사용 중인 카테고리
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                블로그 플랫폼
              </CardTitle>
              <Globe className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {Object.keys(blogPlatformCount).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                사용 중인 플랫폼
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
                {totalTokens.toLocaleString()}
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
              <CardDescription>오늘 작성된 글의 카테고리 분포</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Blog Platform Usage Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>블로그 플랫폼 사용 현황</CardTitle>
              <CardDescription>플랫폼별 글 작성 횟수</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Today's Articles */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>오늘 작성된 글</CardTitle>
            <CardDescription>복붙 버튼 클릭으로 집계된 글 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {article.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {article.userName}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      {article.blogs.map((blog) => (
                        <Badge key={blog} variant="outline" className="text-xs">
                          {blog}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        {article.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Coins className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {article.tokensUsed.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
