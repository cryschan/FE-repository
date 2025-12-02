import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMyProfileQuery } from "@/lib/queries";

const Topbar = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  // React Query로 프로필 조회 (인증된 경우에만)
  const { data: profile } = useMyProfileQuery();

  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("userEmail") || "";
      const storedName = localStorage.getItem("userName") || "";
      setEmail(storedEmail);
      setName(storedName);
    } catch {
      setEmail("");
      setName("");
    }
  }, []);

  // 프로필 데이터가 있으면 우선 사용 (실시간 업데이트)
  const displayName = profile?.username || name;
  const displayEmail = profile?.email || email;

  return (
    <div className="top-0 flex items-center justify-between border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-5">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground">
          {displayName
            ? `👋🏻 안녕하세요, ${displayName}님`
            : displayEmail || "user@example.com"}
        </span>
      </div>
    </div>
  );
};

export default Topbar;
