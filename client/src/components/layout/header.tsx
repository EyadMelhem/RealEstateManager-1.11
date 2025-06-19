import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const pageConfig = {
  "/": {
    title: "لوحة التحكم",
    subtitle: "نظرة عامة على العقارات والمدفوعات",
    showAddButton: false,
  },
  "/properties": {
    title: "إدارة العقارات",
    subtitle: "إدارة وتتبع جميع العقارات",
    showAddButton: true,
    addButtonText: "إضافة عقار",
  },
  "/tenants": {
    title: "إدارة المستأجرين",
    subtitle: "إدارة ملفات المستأجرين",
    showAddButton: true,
    addButtonText: "إضافة مستأجر",
  },
  "/contracts": {
    title: "عقود الإيجار",
    subtitle: "إدارة وتتبع عقود الإيجار",
    showAddButton: true,
    addButtonText: "إضافة عقد",
  },
  "/payments": {
    title: "المدفوعات",
    subtitle: "تتبع وإدارة المدفوعات",
    showAddButton: true,
    addButtonText: "تسجيل دفعة",
  },
  "/statements": {
    title: "كشوفات الحساب",
    subtitle: "إنشاء وعرض كشوفات الحساب",
    showAddButton: false,
  },
  "/reports": {
    title: "التقارير",
    subtitle: "تقارير مالية وإحصائيات",
    showAddButton: false,
  },
};

export function Header() {
  const [location] = useLocation();
  const config = pageConfig[location as keyof typeof pageConfig] || pageConfig["/"];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{config.title}</h2>
          <p className="text-gray-600">{config.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          {config.showAddButton && (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="ml-2 h-4 w-4" />
              {config.addButtonText}
            </Button>
          )}
          <div className="flex items-center space-x-3 space-x-reverse">
            <span className="text-gray-700 font-medium">أحمد محمد</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              أ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
