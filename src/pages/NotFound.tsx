import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // 애니메이션 트리거
    setIsVisible(true);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, hsl(220 40% 98%), hsl(240 30% 96% / 0.2))",
      }}
    >
      <div className="w-full max-w-md">
        <Card
          className="border-2"
          style={{
            boxShadow: "0 20px 60px -10px hsl(210 70% 70% / 0.3)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            animation: isVisible ? "fadeInUp 0.6s ease-out" : "none",
          }}
        >
          <CardHeader className="text-center space-y-4 px-8 py-10">
            <h1
              className="mx-auto text-5xl font-black tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, hsl(18 100% 55%), hsl(25 95% 53%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                animation: isVisible
                  ? "scaleIn 0.8s ease-out 0.2s both"
                  : "none",
              }}
            >
              404
            </h1>
            <CardTitle className="text-3xl font-bold">
              페이지를 찾을 수 없습니다
            </CardTitle>
            <CardDescription className="text-base">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-10">
            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-4">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                경로:{" "}
                <code className="rounded bg-background px-2 py-1 text-xs font-mono">
                  {location.pathname}
                </code>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                size="lg"
                className="w-full"
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
