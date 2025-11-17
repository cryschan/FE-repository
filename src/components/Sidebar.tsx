import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  LayoutDashboard,
  FileText,
  Megaphone,
  PieChart,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "회원 관리",
    icon: Users,
    submenu: [
      { title: "전체 회원 목록", path: "/members" },
      { title: "탈퇴 회원 목록", path: "/members/deleted" },
    ],
  },
  {
    title: "광고 배너 관리",
    icon: Megaphone,
    submenu: [
      { title: "광고 배너 목록", path: "/dashboard" },
    ],
  },
  {
    title: "학습 퀴즈 관리",
    icon: PieChart,
    submenu: [
      { title: "경제 퀴즈 목록", path: "/quiz" },
    ],
  },
  {
    title: "관리자 계정 관리",
    icon: Settings,
    submenu: [
      { title: "관리자 계정 목록", path: "/admin" },
      { title: "관리자 권한 관리", path: "/admin/permissions" },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["광고 배너 관리"]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  return (
    <div className="w-64 bg-sidebar-background h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-xl text-primary-foreground">✱</span>
        </div>
        <span className="text-2xl font-bold text-sidebar-foreground">finberry*</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openMenus.includes(item.title);

          return (
            <div key={item.title}>
              <button
                onClick={() => toggleMenu(item.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.title}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isOpen && "transform rotate-180"
                  )}
                />
              </button>

              {isOpen && item.submenu && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-md transition-colors",
                        location.pathname === subItem.path
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          to="/support"
          className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors text-sm"
        >
          <HelpCircle className="w-5 h-5" />
          <span>로그아웃</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
