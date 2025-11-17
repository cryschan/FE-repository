import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, TrendingUp, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const mockArticles = [
  {
    id: 1,
    title: "여름 남성 반팔 티셔츠 추천 - 시원하고 스타일리시한",
    category: "남성 의류",
    views: 1234,
    createdAt: "2024-01-15",
    status: "published",
  },
  {
    id: 2,
    title: "메이크업 초보자를 위한 베이스 메이크업 제품 가이드",
    category: "메이크업 제품",
    views: 856,
    createdAt: "2024-01-14",
    status: "published",
  },
  {
    id: 3,
    title: "편안한 운동화 추천 - 일상에서 신기 좋은",
    category: "신발",
    views: 2103,
    createdAt: "2024-01-13",
    status: "draft",
  },
];

const trafficData = [
  { date: "1/10", views: 400 },
  { date: "1/11", views: 600 },
  { date: "1/12", views: 800 },
  { date: "1/13", views: 1200 },
  { date: "1/14", views: 900 },
  { date: "1/15", views: 1400 },
  { date: "1/16", views: 1600 },
];

const Dashboard = () => {
  const totalViews = mockArticles.reduce((sum, article) => sum + article.views, 0);
  const publishedCount = mockArticles.filter((a) => a.status === "published").length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
            <p className="text-muted-foreground mt-1">
              콘텐츠 성과를 한눈에 확인하세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/support">문의사항</Link>
            </Button>
            <Button asChild className="gap-2">
              <Link to="/editor">
                <Plus className="w-4 h-4" />
                새 글 작성
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                총 조회수
              </CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                지난 7일 동안
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                게시된 글
              </CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{publishedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                전체 {mockArticles.length}개 중
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
                {Math.round(totalViews / mockArticles.length).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                글당 평균
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>트래픽 추이</CardTitle>
            <CardDescription>최근 7일간 조회수 변화</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
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

        {/* Articles List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>블로그 글 목록</CardTitle>
            <CardDescription>생성된 콘텐츠를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">
                        {article.title}
                      </h3>
                      <Badge variant={article.status === "published" ? "default" : "secondary"}>
                        {article.status === "published" ? "게시됨" : "임시저장"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views.toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{article.createdAt}</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/editor/${article.id}`}>편집</Link>
                  </Button>
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
