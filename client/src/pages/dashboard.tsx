import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building, Users, DollarSign, AlertTriangle, 
  Home, Plus, UserPlus, Banknote, BarChart3,
  Download, Store
} from "lucide-react";
import { formatCurrency, calculateDaysOverdue, formatDate } from "@/lib/utils";
import type { PaymentWithDetails } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: overduePayments, isLoading: overdueLoading } = useQuery<PaymentWithDetails[]>({
    queryKey: ["/api/payments/overdue"],
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/properties"],
  });

  if (statsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Building className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">إجمالي العقارات</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProperties || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">المستأجرين النشطين</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeTenants || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">الدخل الشهري</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.monthlyRevenue ? formatCurrency(stats.monthlyRevenue) : "د.أ 0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="mr-4">
                <h3 className="text-sm font-medium text-gray-500">دفعات متأخرة</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.overduePayments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Properties */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>العقارات الحديثة</CardTitle>
                <Button variant="ghost" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center p-4 rounded-lg border">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="mr-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                      </div>
                      <div className="text-left">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12 mt-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {properties?.slice(0, 3).map((property: any) => (
                    <div key={property.id} className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {property.type === 'commercial' ? (
                          <Store className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Home className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="mr-4 flex-1">
                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                        <p className="text-sm text-gray-500">المالك: {property.ownerName}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(property.monthlyRent)}
                        </p>
                        <p className="text-sm text-gray-500">شهرياً</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد عقارات مسجلة
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">إضافة عقار جديد</p>
                  <p className="text-sm text-gray-500">تسجيل عقار جديد في النظام</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                  <UserPlus className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">إضافة مستأجر</p>
                  <p className="text-sm text-gray-500">تسجيل مستأجر جديد</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center ml-3">
                  <Banknote className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">تسجيل دفعة</p>
                  <p className="text-sm text-gray-500">تسجيل دفعة إيجار جديدة</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">إنشاء تقرير</p>
                  <p className="text-sm text-gray-500">إنشاء تقرير مالي شامل</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>المدفوعات المتأخرة</CardTitle>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Button variant="ghost" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                <Download className="ml-1 h-4 w-4" />
                تصدير
              </Button>
              <Input 
                type="text" 
                placeholder="بحث..." 
                className="w-48"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {overdueLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center p-4 rounded border">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="mr-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
                  </div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full rtl-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">المستأجر</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">العقار</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاستحقاق</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">أيام التأخير</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overduePayments?.length ? overduePayments.map((payment) => {
                    const daysOverdue = calculateDaysOverdue(payment.dueDate);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                              {payment.contract.tenant.name.charAt(0)}
                            </div>
                            <div className="mr-3">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.contract.tenant.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.contract.tenant.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.contract.property.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={daysOverdue > 10 ? "destructive" : "secondary"}>
                            {daysOverdue} {daysOverdue === 1 ? "يوم" : "أيام"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 ml-3">
                            تسجيل دفعة
                          </Button>
                          <Button variant="ghost" className="text-gray-600 hover:text-gray-700">
                            تذكير
                          </Button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        لا توجد مدفوعات متأخرة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
