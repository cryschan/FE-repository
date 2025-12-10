import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

export type Inquiry = {
  id: string;
  title: string;
  category: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  answer?: string | null;
  content?: string | null;
};

type MyInquiriesSectionProps = {
  inquiries: Inquiry[];
  onSelect?: (id: string) => void;
};

const MyInquiriesSection = ({
  inquiries,
  onSelect,
}: MyInquiriesSectionProps) => {
  return (
    <div className="space-y-4 h-[calc(100vh-20rem)] overflow-y-auto">
      {inquiries.map((inquiry) => (
        <Card
          key={inquiry.id}
          className={onSelect ? "cursor-pointer hover:bg-muted/40" : undefined}
          onClick={() => onSelect?.(inquiry.id)}
          role={onSelect ? "button" : undefined}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Badge variant="outline">{inquiry.category}</Badge>
                  <CardTitle>제목: {inquiry.title}</CardTitle>
                </div>
                <CardDescription className="mt-2 pl-1">
                  작성일: {inquiry.createdAt}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    inquiry.status === "completed"
                      ? "default"
                      : inquiry.status === "in_progress"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {inquiry.status === "completed" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      답변완료
                    </span>
                  ) : inquiry.status === "in_progress" ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      답변중
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      대기중
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </CardHeader>

          {inquiry.answer && (
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-900">
                  <strong>답변:</strong> {inquiry.answer}
                </p>
              </div>
            </CardContent>
          )}

          {inquiry.content && !inquiry.answer && (
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-muted-foreground">{inquiry.content}</p>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {inquiries.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            아직 문의 내역이 없습니다.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyInquiriesSection;
