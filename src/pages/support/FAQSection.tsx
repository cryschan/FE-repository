import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQs as FAQItem } from "@/lib/api";

type FAQSectionProps = {
  faqs: FAQItem[];
  isError?: boolean;
};

const FAQSection = ({ faqs, isError }: FAQSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>자주 묻는 질문</CardTitle>
        <CardDescription>
          일반적인 질문에 대한 답변을 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="text-center py-8 text-red-500">
            FAQ를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            등록된 FAQ가 없습니다.
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => {
              const itemValue =
                typeof faq.id === "number" ? String(faq.id) : faq.id;
              return (
                <AccordionItem key={faq.id} value={itemValue}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default FAQSection;
