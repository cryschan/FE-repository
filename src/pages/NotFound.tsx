import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Sparkles } from "lucide-react";
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
    setIsVisible(true);
  }, [location.pathname]);

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      style={{
        background:
          "linear-gradient(135deg, hsl(18 100% 95%) 0%, hsl(25 95% 90%) 50%, hsl(38 92% 95%) 100%)",
      }}
    >
      {/* 떠다니는 배경 요소들 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="floating-emoji"
          style={{ left: "10%", top: "20%", animationDelay: "0s" }}
        >
          🌟
        </div>
        <div
          className="floating-emoji"
          style={{ left: "80%", top: "30%", animationDelay: "1s" }}
        >
          ✨
        </div>
        <div
          className="floating-emoji"
          style={{ left: "20%", top: "70%", animationDelay: "2s" }}
        >
          🎈
        </div>
        <div
          className="floating-emoji"
          style={{ left: "70%", top: "80%", animationDelay: "1.5s" }}
        >
          🎉
        </div>
        <div
          className="floating-emoji"
          style={{ left: "50%", top: "10%", animationDelay: "0.5s" }}
        >
          💫
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <Card
          className="border-2 border-primary/20 backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow:
              "0 25px 80px -10px hsl(18 100% 55% / 0.3), 0 0 40px hsl(25 95% 53% / 0.2)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0) scale(1)"
              : "translateY(30px) scale(0.95)",
            animation: isVisible ? "fadeInUp 0.8s ease-out" : "none",
          }}
        >
          <CardHeader className="text-center space-y-6 px-8 py-12">
            {/* 큰 귀여운 이모지 */}
            <div
              className="mx-auto text-8xl"
              style={{
                animation: isVisible
                  ? "bounceIn 1s ease-out 0.3s both, float 3s ease-in-out infinite 1.5s"
                  : "none",
                filter: "drop-shadow(0 10px 20px rgba(255, 165, 0, 0.3))",
              }}
            >
              🐱
            </div>

            {/* 404 숫자 */}
            <h1
              className="mx-auto text-6xl font-black tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, hsl(18 100% 55%), hsl(25 95% 53%), hsl(38 92% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                animation: isVisible
                  ? "scaleIn 0.9s ease-out 0.5s both, pulse 2s ease-in-out infinite 1.5s"
                  : "none",
                textShadow: "0 0 30px rgba(255, 165, 0, 0.3)",
              }}
            >
              404
            </h1>

            <CardTitle className="text-4xl font-bold text-foreground">
              오잉? 길을 잃으셨나요? 🗺️
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              요청하신 페이지가 사라졌어요!
              <br />
              하지만 걱정 마세요, 집으로 돌아갈 길을 찾아드릴게요! 🏠
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-12">
            {/* 경로 표시 */}
            <div
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 backdrop-blur-sm"
              style={{
                animation: isVisible
                  ? "slideIn 0.6s ease-out 0.7s both"
                  : "none",
              }}
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <p className="text-sm font-medium text-foreground">
                찾으신 경로:{" "}
                <code className="rounded-md bg-background/80 px-3 py-1.5 text-xs font-mono font-semibold text-primary">
                  {location.pathname}
                </code>
              </p>
            </div>

            {/* 버튼 */}
            <div
              className="flex flex-col gap-3"
              style={{
                animation: isVisible
                  ? "slideIn 0.6s ease-out 0.9s both"
                  : "none",
              }}
            >
              <Button
                asChild
                size="lg"
                className="group relative w-full overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <Link to="/" className="flex items-center justify-center">
                  <Home className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  홈으로 돌아가기 🏡
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
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) translateY(0);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .floating-emoji {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          animation: float 4s ease-in-out infinite;
          pointer-events: none;
          filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
        }
      `}</style>
    </div>
  );
};

export default NotFound;
