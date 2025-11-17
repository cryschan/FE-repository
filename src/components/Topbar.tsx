import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Topbar = () => {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userEmail") || "";
      setEmail(stored);
    } catch {
      setEmail("");
    }
  }, []);

  return (
    <div className="top-0 flex items-center justify-between border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-5">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground">
          {email || "user@example.com"}
        </span>
      </div>
    </div>
  );
};

export default Topbar;
