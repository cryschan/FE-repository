import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const INQUIRY_TYPES = [
  "통신 오류",
  "블로그 글 생성 오류",
  "계정 문제",
  "기능 제안",
  "기타 문의사항",
];

const Support = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submit logic
    console.log("Support inquiry:", { name, email, type, message });
    
    toast({
      title: "문의가 접수되었습니다",
      description: "빠른 시일 내에 답변 드리겠습니다.",
    });

    // Reset form
    setName("");
    setEmail("");
    setType("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              대시보드로 돌아가기
            </Link>
          </Button>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>문의사항</CardTitle>
              <CardDescription>
                문제가 발생했거나 궁금한 점이 있으시면 언제든지 문의해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">문의 유형</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="문의 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_TYPES.map((inquiryType) => (
                        <SelectItem key={inquiryType} value={inquiryType}>
                          {inquiryType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">문의 내용</Label>
                  <Textarea
                    id="message"
                    placeholder="문제 상황이나 문의 내용을 자세히 작성해주세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  문의하기
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>자주 묻는 질문</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  블로그 글이 생성되지 않아요
                </h3>
                <p className="text-sm text-muted-foreground">
                  쇼핑몰 URL이 올바른지 확인하고, 카테고리가 정확히 선택되었는지 확인해주세요.
                  문제가 지속되면 문의를 남겨주시기 바랍니다.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  생성된 콘텐츠를 수정할 수 있나요?
                </h3>
                <p className="text-sm text-muted-foreground">
                  네, 에디터 페이지에서 마크다운으로 자유롭게 수정할 수 있습니다.
                  미리보기 탭에서 실시간으로 확인하며 편집하세요.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  트래픽 데이터는 어떻게 수집되나요?
                </h3>
                <p className="text-sm text-muted-foreground">
                  블로그 글 조회수는 자동으로 수집되며 대시보드에서 실시간으로 확인할 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
