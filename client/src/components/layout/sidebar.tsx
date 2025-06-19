import { useLocation } from "wouter";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  Building,
  Users,
  FileText,
  CreditCard,
  Receipt,
  BarChart3,
  FileBarChart,
  Home
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "لوحة التحكم", icon: Home },
  { href: "/properties", label: "إدارة العقارات", icon: Building },
  { href: "/tenants", label: "إدارة المستأجرين", icon: Users },
  { href: "/contracts", label: "عقود الإيجار", icon: FileText },
  { href: "/payments", label: "المدفوعات", icon: CreditCard },
  { href: "/expenses", label: "المصاريف", icon: Receipt },
  { href: "/statements", label: "كشوفات الحساب", icon: BarChart3 },
  { href: "/reports", label: "التقارير", icon: FileBarChart },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-l border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">إدارة العقارات</h1>
        <p className="text-sm text-gray-600">نظام شامل للإدارة</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg font-medium transition-colors",
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="ml-3 h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
