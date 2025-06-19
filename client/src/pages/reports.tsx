import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileBarChart, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: payments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: contracts } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const totalRevenue = payments?.reduce((sum: number, payment: any) => {
    return sum + parseFloat(payment.amount);
  }, 0) || 0;

  const monthlyRevenue = stats?.monthlyRevenue || 0;
  const occupancyRate = stats?.totalProperties ? 
    ((stats.activeTenants / stats.totalProperties) * 100).toFixed(1) : 0;

  const exportReport = (type: string) => {
    // Here you would implement the export functionality
    alert(`سيتم تصدير تقرير ${type}`);
  };

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">إجمالي الإيرادات</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">الإيراد الشهري</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(monthlyRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">نسبة الإشغال</h3>
                <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">المدفوعات المتأخرة</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.overduePayments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportReport("الإيرادات الشهرية")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="ml-2 h-5 w-5 text-blue-600" />
              تقرير الإيرادات الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              تقرير شامل عن الإيرادات الشهرية لجميع العقارات
            </p>
            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportReport("المدفوعات المتأخرة")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="ml-2 h-5 w-5 text-red-600" />
              تقرير المدفوعات المتأخرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              قائمة بجميع المدفوعات المتأخرة والمستحقة
            </p>
            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportReport("أداء العقارات")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="ml-2 h-5 w-5 text-green-600" />
              تقرير أداء العقارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              تحليل أداء العقارات ونسب الإشغال
            </p>
            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportReport("كشوفات المستأجرين")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileBarChart className="ml-2 h-5 w-5 text-purple-600" />
              كشوفات المستأجرين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              كشوفات حساب شاملة لجميع المستأجرين
            </p>
            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportReport("التقرير السنوي")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="ml-2 h-5 w-5 text-indigo-600" />
              التقرير السنوي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              تقرير سنوي شامل عن جميع الأنشطة والإيرادات
            </p>
            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportReport("تقرير الصيانة")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileBarChart className="ml-2 h-5 w-5 text-orange-600" />
              تقرير المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              تتبع جميع المصروفات والصيانة للعقارات
            </p>
            <Button variant="outline" className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">متوسط الإيجار</h4>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.totalProperties && stats.monthlyRevenue ? 
                  formatCurrency(stats.monthlyRevenue / stats.activeTenants) : 
                  formatCurrency(0)
                }
              </p>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">معدل التحصيل</h4>
              <p className="text-3xl font-bold text-green-600">
                {payments?.length ? 
                  ((payments.filter((p: any) => new Date(p.paymentDate) <= new Date(p.dueDate)).length / payments.length) * 100).toFixed(1) 
                  : 0}%
              </p>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">العقود النشطة</h4>
              <p className="text-3xl font-bold text-purple-600">{stats?.activeTenants || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
