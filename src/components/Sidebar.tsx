import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  User,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const location = useLocation();

  const sections = [
    {
      label: "대시보드",
      icon: LayoutDashboard,
      items: [{ title: "대시보드", to: "/dashboard" }],
    },
    {
      label: "블로그 글 관리",
      icon: FileText,
      items: [{ title: "블로그 글 목록", to: "/posts" }],
    },
    {
      label: "고객 지원",
      icon: HelpCircle,
      items: [{ title: "QnA (자주 묻는 질문 / 내 문의)", to: "/support" }],
    },
    {
      label: "마이페이지",
      icon: User,
      items: [{ title: "내 정보 수정", to: "/profile" }],
    },
    {
      label: "관리자",
      icon: ShieldCheck,
      items: [{ title: "관리자페이지", to: "/admin" }],
    },
  ];

  const [openSections, setOpenSections] = useState<string[]>(["대시보드"]);
  const toggleSection = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <ShadcnSidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="bg-sidebar text-sidebar-foreground p-2"
    >
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img
              src="/image/santa.png"
              alt="logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <span className="text-lg font-bold">Happy Coding</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => {
          const isOpen = openSections.includes(section.label);
          const Icon = section.icon;
          return (
            <SidebarGroup key={section.label}>
              <button
                type="button"
                onClick={() => toggleSection(section.label)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{section.label}</span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <SidebarGroupContent>
                  <SidebarMenu className="flex w-full min-w-0 flex-col gap-1 border-l ">
                    {section.items.map(({ title, to }) => (
                      <SidebarMenuItem key={to}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === to}
                          tooltip={title}
                        >
                          <Link
                            to={to}
                            className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground active:font-medium disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm"
                          >
                            <span>{title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>
  );
};

// Provider를 이 컴포넌트 내부에서 함께 노출해 상위에서 간단히 쓸 수 있게 함
export const SidebarWithProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default AppSidebar;
