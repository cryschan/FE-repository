import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BarChart3, Edit3, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI 기반 콘텐츠 자동화
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            쇼핑몰 홍보 블로그를
            <br />
            <span className="text-primary">자동으로 생성하세요</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI가 키워드를 추출하고 최적화된 블로그 콘텐츠를 자동으로 생성합니다.
            트래픽 분석까지 한 번에 관리하세요.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/auth">
                시작하기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">
                대시보드 둘러보기
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 space-y-4 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">AI 키워드 추출</h3>
            <p className="text-muted-foreground">
              카테고리와 쇼핑몰 URL을 입력하면 AI가 최적의 키워드를 자동으로 추출합니다.
            </p>
          </Card>

          <Card className="p-6 space-y-4 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">콘텐츠 편집</h3>
            <p className="text-muted-foreground">
              생성된 마크다운 콘텐츠를 실시간 미리보기로 확인하고 수정할 수 있습니다.
            </p>
          </Card>

          <Card className="p-6 space-y-4 shadow-card hover:shadow-elevated transition-shadow">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground">트래픽 분석</h3>
            <p className="text-muted-foreground">
              각 블로그 글의 조회수와 트래픽을 대시보드에서 한눈에 확인하세요.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto p-12 text-center space-y-6 bg-gradient-primary shadow-elevated">
          <Zap className="w-16 h-16 mx-auto text-primary-foreground" />
          <h2 className="text-3xl font-bold text-primary-foreground">
            지금 바로 시작하세요
          </h2>
          <p className="text-primary-foreground/90 text-lg">
            몇 분 안에 첫 블로그 콘텐츠를 생성할 수 있습니다.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">
              무료로 시작하기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Landing;
