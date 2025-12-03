import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface NoticeFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    isImportant: boolean;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    content: string;
    isImportant: boolean;
  };
  submitLabel?: string;
}

const NoticeForm = ({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = "작성하기",
}: NoticeFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [isImportant, setIsImportant] = useState(
    initialData?.isImportant || false
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setIsImportant(initialData.isImportant);
    } else {
      // initialData가 없으면 폼 초기화
      setTitle("");
      setContent("");
      setIsImportant(false);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      isImportant,
    });
    // 폼 초기화
    setTitle("");
    setContent("");
    setIsImportant(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          placeholder="공지사항 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          placeholder="공지사항 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isImportant"
          checked={isImportant}
          onCheckedChange={(checked) => setIsImportant(checked === true)}
        />
        <Label
          htmlFor="isImportant"
          className="text-sm font-normal cursor-pointer"
        >
          중요 공지로 설정
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};

export default NoticeForm;
