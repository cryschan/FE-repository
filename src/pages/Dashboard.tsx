import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, FileText } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";

// 지난 7일간 블로그 글 데이터
const mockArticles = [
  {
    id: 1,
    title: "여름 남성 반팔 티셔츠 추천 - 시원하고 스타일리시한",
    category: "남성 의류",
    blogs: ["네이버 블로그", "티스토리"],
    views: 1234,
    createdAt: "2024-01-15",
    status: "published",
  },
  {
    id: 2,
    title: "메이크업 초보자를 위한 베이스 메이크업 제품 가이드",
    category: "메이크업 제품",
    blogs: ["티스토리", "미디움", "브런치"],
    views: 856,
    createdAt: "2024-01-14",
    status: "published",
  },
  {
    id: 3,
    title: "편안한 운동화 추천 - 일상에서 신기 좋은",
    category: "신발",
    blogs: ["네이버 블로그"],
    views: 2103,
    createdAt: "2024-01-13",
    status: "published",
  },
  {
    id: 4,
    title: "겨울 패딩 추천 - 따뜻하고 가벼운",
    category: "여성 의류",
    blogs: ["미디움", "벨로그"],
    views: 1567,
    createdAt: "2024-01-12",
    status: "published",
  },
  {
    id: 5,
    title: "스킨케어 루틴 완벽 가이드",
    category: "뷰티",
    blogs: ["브런치", "네이버 블로그", "티스토리"],
    views: 943,
    createdAt: "2024-01-11",
    status: "published",
  },
  {
    id: 6,
    title: "홈 인테리어 소품 추천",
    category: "생활용품",
    blogs: ["벨로그", "미디움"],
    views: 721,
    createdAt: "2024-01-10",
    status: "published",
  },
  {
    id: 7,
    title: "최신 노트북 비교 리뷰",
    category: "전자제품",
    blogs: ["티스토리"],
    views: 1890,
    createdAt: "2024-01-09",
    status: "published",
  },
];

// 지난 7일간 일별 조회수
const trafficData = [
  { date: "1/9", views: 1890 },
  { date: "1/10", views: 721 },
  { date: "1/11", views: 943 },
  { date: "1/12", views: 1567 },
  { date: "1/13", views: 2103 },
  { date: "1/14", views: 856 },
  { date: "1/15", views: 1234 },
];

const Dashboard = () => {
  // 전체 조회수
  const totalViews = mockArticles.reduce(
    (sum, article) => sum + article.views,
    0
  );

  // 평균 조회수
  const avgViews =
    mockArticles.length > 0 ? Math.round(totalViews / mockArticles.length) : 0;

  // 블로그별 조회수
  const viewsByBlog = mockArticles.reduce((acc, article) => {
    article.blogs.forEach((blog) => {
      acc[blog] = (acc[blog] || 0) + article.views;
    });
    return acc;
  }, {} as Record<string, number>);

  const blogViewsData = Object.entries(viewsByBlog).map(([blog, views]) => ({
    blog,
    views,
  }));

  return (
    <div className="bg-gradient-subtle">
      <div className="w-full mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
            <p className="text-muted-foreground mt-1">
              콘텐츠 성과를 한눈에 확인하세요
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                지난 7일 블로그 글
              </CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {mockArticles.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">게시된 글 수</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                전체 조회수
              </CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                지난 7일 누적
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                평균 조회수
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {avgViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">글당 평균</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Traffic Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>트래픽 추이</CardTitle>
              <CardDescription>최근 7일간 일별 조회수</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Blog Views Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>블로그별 조회수</CardTitle>
              <CardDescription>플랫폼별 조회수 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={blogViewsData}>
                  <XAxis
                    dataKey="blog"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-15}
                    textAnchor="end"
                    height={60}
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
                    dataKey="views"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Articles */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>최근 게시글</CardTitle>
            <CardDescription>지난 7일간 작성된 블로그 글</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
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
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {article.views.toLocaleString()}
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
