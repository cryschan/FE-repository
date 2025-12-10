import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateInquiryMutation } from "@/lib/queries";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_ENUM_TO_KR } from "@/constants/inquiry";

const CATEGORIES = Object.values(CATEGORY_ENUM_TO_KR);
const CATEGORY_KR_TO_ENUM: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_ENUM_TO_KR).map(([enumKey, krValue]) => [
    krValue,
    enumKey,
  ])
);

type CreateInquiryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void; // 성공 후 부모에서 페이지 1로 이동/탭 전환 등 처리
};

export default function CreateInquiryDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateInquiryDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateInquiryMutation();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState("");

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category.trim()) {
      toast({
        title: "입력값을 확인해주세요",
        description: "제목과 카테고리를 입력해 주세요.",
      });
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      toast({
        title: "문의 내용을 입력해 주세요",
        description: "문의 내용은 필수이며 최소 10자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        inquiryCategory: CATEGORY_KR_TO_ENUM[category] || "FEATURE",
        content: content.trim(),
      });
      resetForm();
      onOpenChange(false);
      onCreated?.();
    } catch {
      // 에러 토스트는 mutation에서 처리
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>문의 생성</DialogTitle>
          <DialogDescription>아래 항목을 작성해 주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="문의 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              카테고리 <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              문의 내용 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="최소 10자 이상 상세한 내용을 작성해 주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[160px]"
              required
              minLength={10}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full gap-2">
              <Send className="w-4 h-4" />
              문의 생성
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
