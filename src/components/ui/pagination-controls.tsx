import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  pagesPerGroup?: number;
  className?: string;
};

export function PaginationControls({
  currentPage,
  totalPages,
  onChange,
  pagesPerGroup = 5,
  className,
}: PaginationControlsProps) {
  const groupStart =
    Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;

  return (
    <div className={`flex items-center justify-center gap-4 ${className || ""}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0 hover:bg-muted disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="flex gap-1">
        {Array.from({ length: pagesPerGroup }, (_, i) => groupStart + i)
          .filter((p) => p <= totalPages)
          .map((p) => (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(p)}
              className={`${p === currentPage ? "bg-primary" : ""} w-8 px-0 justify-center`}
              aria-current={p === currentPage ? "page" : undefined}
              aria-label={`Go to page ${p}`}
            >
              {p}
            </Button>
          ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 p-0 hover:bg-muted disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}


