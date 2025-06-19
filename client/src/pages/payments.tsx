import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/forms/payment-form";
import { Plus, Search, CreditCard, Building, User, Calendar } from "lucide-react";
import { formatCurrency, formatDate, getPaymentMethodLabel, calculateDaysOverdue } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import type { PaymentWithDetails } from "@shared/schema";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: payments, isLoading } = useQuery<PaymentWithDetails[]>({
    queryKey: ["/api/payments"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete payment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
    },
  });

  const filteredPayments = payments?.filter(payment =>
    payment.contract.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.contract.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="البحث في المدفوعات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-64"
            />
          </div>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="ml-2 h-4 w-4" />
              تسجيل دفعة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
            </DialogHeader>
            <PaymentForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments?.length ? (
          filteredPayments.map((payment) => {
            const daysOverdue = calculateDaysOverdue(payment.dueDate);
            const isOverdue = new Date(payment.dueDate) < new Date(payment.paymentDate);
            
            return (
              <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="p-3 rounded-lg bg-green-50">
                        <CreditCard className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            دفعة رقم #{payment.id}
                          </h3>
                          <Badge variant={isOverdue ? "destructive" : "default"}>
                            {isOverdue ? "متأخرة" : "في الموعد"}
                          </Badge>
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(payment.amount)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="ml-2 h-4 w-4" />
                              العقار: {payment.contract.property.title}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="ml-2 h-4 w-4" />
                              المستأجر: {payment.contract.tenant.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              الهاتف: {payment.contract.tenant.phone}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="ml-2 h-4 w-4" />
                              تاريخ الدفع: {formatDate(payment.paymentDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="ml-2 h-4 w-4" />
                              تاريخ الاستحقاق: {formatDate(payment.dueDate)}
                            </div>
                            {payment.paymentMethod && (
                              <div className="text-sm text-gray-600">
                                طريقة الدفع: {getPaymentMethodLabel(payment.paymentMethod)}
                              </div>
                            )}
                            {payment.referenceNumber && (
                              <div className="text-sm text-gray-600">
                                رقم المرجع: {payment.referenceNumber}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {payment.notes && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">{payment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="outline" size="sm">
                        تعديل
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteMutation.mutate(payment.id)}
                        disabled={deleteMutation.isPending}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد مدفوعات
              </h3>
              <p className="text-gray-600 mb-6">
                ابدأ بتسجيل المدفوعات لتتبع إيرادات العقارات
              </p>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="ml-2 h-4 w-4" />
                    تسجيل دفعة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
                  </DialogHeader>
                  <PaymentForm onSuccess={() => setShowAddDialog(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
