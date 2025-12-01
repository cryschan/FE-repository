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
  status: "answered" | "pending";
  createdAt: string;
  answer?: string | null;
  content?: string | null;
};

type MyInquiriesSectionProps = {
  inquiries: Inquiry[];
};

const MyInquiriesSection = ({ inquiries }: MyInquiriesSectionProps) => {
  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      inquiry.status === "answered" ? "default" : "secondary"
                    }
                  >
                    {inquiry.status === "answered" ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        답변완료
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        대기중
                      </span>
                    )}
                  </Badge>
                  <Badge variant="outline">{inquiry.category}</Badge>
                </div>
                <CardTitle>{inquiry.title}</CardTitle>
                <CardDescription className="mt-2">
                  작성일: {inquiry.createdAt}
                </CardDescription>
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
