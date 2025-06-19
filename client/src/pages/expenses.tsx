import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseForm } from "@/components/forms/expense-form";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ExpenseWithDetails } from "@shared/schema";

export default function Expenses() {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseWithDetails | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["/api/expenses"],
  });

  const filteredExpenses = expenses.filter((expense: ExpenseWithDetails) => {
    if (categoryFilter === "all") return true;
    return expense.category === categoryFilter;
  });

  const getCategoryLabel = (category: string) => {
    const categories = {
      maintenance: "صيانة",
      legal: "قانونية",
      insurance: "تأمين", 
      utilities: "مرافق",
      other: "أخرى"
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      maintenance: "bg-blue-100 text-blue-800",
      legal: "bg-red-100 text-red-800",
      insurance: "bg-green-100 text-green-800",
      utilities: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedExpense(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المصاريف</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedExpense(null)}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مصروف
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedExpense ? "تعديل المصروف" : "إضافة مصروف جديد"}
              </DialogTitle>
            </DialogHeader>
            <ExpenseForm
              initialData={selectedExpense || undefined}
              expenseId={selectedExpense?.id}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <Filter className="h-4 w-4" />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            <SelectItem value="maintenance">صيانة</SelectItem>
            <SelectItem value="legal">قانونية</SelectItem>
            <SelectItem value="insurance">تأمين</SelectItem>
            <SelectItem value="utilities">مرافق</SelectItem>
            <SelectItem value="other">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExpenses.map((expense: ExpenseWithDetails) => (
            <Card key={expense.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{expense.description}</CardTitle>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge className={getCategoryColor(expense.category)}>
                  {getCategoryLabel(expense.category)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">المبلغ:</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">العقار:</span>
                  <span className="text-sm">{expense.property.title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">التاريخ:</span>
                  <span className="text-sm">{formatDate(expense.expenseDate)}</span>
                </div>

                {expense.vendor && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المورد:</span>
                    <span className="text-sm">{expense.vendor}</span>
                  </div>
                )}

                {expense.contract && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المستأجر:</span>
                    <span className="text-sm">{expense.contract.tenant.name}</span>
                  </div>
                )}

                {expense.receiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">رقم الإيصال:</span>
                    <span className="text-sm">{expense.receiptNumber}</span>
                  </div>
                )}

                {expense.isRecurring && (
                  <Badge variant="outline" className="w-fit">
                    مصروف دوري
                  </Badge>
                )}

                {expense.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">{expense.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {categoryFilter === "all" 
              ? "لا توجد مصاريف مسجلة" 
              : `لا توجد مصاريف في فئة ${getCategoryLabel(categoryFilter)}`
            }
          </p>
        </div>
      )}
    </div>
  );
}