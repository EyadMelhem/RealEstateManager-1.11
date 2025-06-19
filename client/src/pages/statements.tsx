import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Download, FileText, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ContractWithDetails, PaymentWithDetails } from "@shared/schema";

export default function Statements() {
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: contracts } = useQuery<ContractWithDetails[]>({
    queryKey: ["/api/contracts/active"],
  });

  const { data: payments } = useQuery<PaymentWithDetails[]>({
    queryKey: ["/api/payments"],
    enabled: !!selectedContract,
  });

  const filteredPayments = payments?.filter(payment => {
    if (selectedContract && payment.contractId !== parseInt(selectedContract)) {
      return false;
    }
    if (startDate && new Date(payment.paymentDate) < new Date(startDate)) {
      return false;
    }
    if (endDate && new Date(payment.paymentDate) > new Date(endDate)) {
      return false;
    }
    return true;
  });

  const totalAmount = filteredPayments?.reduce((sum, payment) => {
    return sum + parseFloat(payment.amount);
  }, 0) || 0;

  const selectedContractData = contracts?.find(c => c.id.toString() === selectedContract);

  const exportStatement = () => {
    // Here you would implement the export functionality
    // For now, we'll just show an alert
    alert("سيتم تنفيذ تصدير كشف الحساب");
  };

  return (
    <div className="p-6">
      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="ml-2 h-5 w-5" />
            إنشاء كشف حساب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="contract">العقد</Label>
              <Select value={selectedContract} onValueChange={setSelectedContract}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العقد" />
                </SelectTrigger>
                <SelectContent>
                  {contracts?.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id.toString()}>
                      {contract.property.title} - {contract.tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startDate">من تاريخ</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">إلى تاريخ</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={exportStatement}
                disabled={!selectedContract}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير كشف الحساب
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statement Preview */}
      {selectedContract && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات العقد</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedContractData && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">العقار</h4>
                    <p className="text-gray-600">{selectedContractData.property.title}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">العنوان</h4>
                    <p className="text-gray-600">{selectedContractData.property.address}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">المستأجر</h4>
                    <p className="text-gray-600">{selectedContractData.tenant.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">الهاتف</h4>
                    <p className="text-gray-600">{selectedContractData.tenant.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">الإيجار الشهري</h4>
                    <p className="text-gray-600">{formatCurrency(selectedContractData.monthlyRent)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">فترة العقد</h4>
                    <p className="text-gray-600">
                      {formatDate(selectedContractData.startDate)} - {formatDate(selectedContractData.endDate)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ملخص المدفوعات</CardTitle>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalAmount)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredPayments?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">إجمالي المدفوعات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredPayments?.filter(p => new Date(p.paymentDate) <= new Date(p.dueDate)).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">دفعات في الموعد</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {filteredPayments?.filter(p => new Date(p.paymentDate) > new Date(p.dueDate)).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">دفعات متأخرة</div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">تفاصيل المدفوعات</h4>
                  {filteredPayments?.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right py-2">تاريخ الدفع</th>
                            <th className="text-right py-2">تاريخ الاستحقاق</th>
                            <th className="text-right py-2">المبلغ</th>
                            <th className="text-right py-2">طريقة الدفع</th>
                            <th className="text-right py-2">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPayments.map((payment) => (
                            <tr key={payment.id} className="border-b">
                              <td className="py-2">{formatDate(payment.paymentDate)}</td>
                              <td className="py-2">{formatDate(payment.dueDate)}</td>
                              <td className="py-2 font-medium">{formatCurrency(payment.amount)}</td>
                              <td className="py-2">{payment.paymentMethod || "-"}</td>
                              <td className="py-2">
                                {new Date(payment.paymentDate) <= new Date(payment.dueDate) ? (
                                  <span className="text-green-600">في الموعد</span>
                                ) : (
                                  <span className="text-red-600">متأخر</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد مدفوعات في الفترة المحددة
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedContract && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              اختر عقد لعرض كشف الحساب
            </h3>
            <p className="text-gray-600">
              قم بتحديد عقد من القائمة أعلاه لعرض تفاصيل المدفوعات وكشف الحساب
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
