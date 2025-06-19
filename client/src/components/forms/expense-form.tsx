import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertExpenseSchema, type InsertExpense, type Property, type ContractWithDetails } from "@shared/schema";

interface ExpenseFormProps {
  onSuccess?: () => void;
  initialData?: InsertExpense;
  expenseId?: number;
}

export function ExpenseForm({ onSuccess, initialData, expenseId }: ExpenseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertExpense>({
    resolver: zodResolver(insertExpenseSchema),
    defaultValues: {
      propertyId: initialData?.propertyId || 0,
      contractId: initialData?.contractId || null,
      category: initialData?.category || "maintenance",
      description: initialData?.description || "",
      amount: initialData?.amount || "",
      expenseDate: initialData?.expenseDate || new Date().toISOString().split('T')[0],
      vendor: initialData?.vendor || "",
      receiptNumber: initialData?.receiptNumber || "",
      notes: initialData?.notes || "",
      isRecurring: initialData?.isRecurring || false,
    },
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: contracts = [] } = useQuery<ContractWithDetails[]>({
    queryKey: ["/api/contracts"],
  });

  const selectedPropertyId = form.watch("propertyId");
  const availableContracts = contracts.filter(contract => 
    contract.propertyId === selectedPropertyId
  );

  const mutation = useMutation({
    mutationFn: async (data: InsertExpense) => {
      const url = expenseId ? `/api/expenses/${expenseId}` : "/api/expenses";
      const method = expenseId ? "PUT" : "POST";
      return apiRequest(url, method, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({
        title: "تم بنجاح",
        description: expenseId ? "تم تحديث المصروف" : "تم إضافة المصروف",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المصروف",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertExpense) => {
    // Convert contractId to null if it's empty or 0
    const processedData = {
      ...data,
      contractId: data.contractId && data.contractId > 0 ? data.contractId : null,
    };
    mutation.mutate(processedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العقار *</FormLabel>
                <Select 
                  value={field.value?.toString()} 
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                    form.setValue("contractId", null); // Reset contract when property changes
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العقار" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.title} - {property.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العقد (اختياري)</FormLabel>
                <Select 
                  value={field.value?.toString() || ""} 
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العقد" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">بدون عقد محدد</SelectItem>
                    {availableContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id.toString()}>
                        {contract.tenant.name} - {contract.property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع المصروف *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المصروف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="maintenance">صيانة</SelectItem>
                    <SelectItem value="legal">مصاريف قانونية ومحكمة</SelectItem>
                    <SelectItem value="insurance">تأمين</SelectItem>
                    <SelectItem value="utilities">مرافق</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المبلغ (د.أ) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المصروف *</FormLabel>
              <FormControl>
                <Input placeholder="مثال: إصلاح السباكة، رسوم المحكمة..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ المصروف *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المورد أو مقدم الخدمة</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="اسم الشركة أو الشخص" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="receiptNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الإيصال أو الفاتورة</FormLabel>
              <FormControl>
                <Input 
                  placeholder="رقم الإيصال للمرجع" 
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">مصروف دوري</FormLabel>
                <div className="text-sm text-muted-foreground">
                  هل هذا المصروف يتكرر بانتظام؟
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ملاحظات إضافية..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "جاري الحفظ..." : expenseId ? "تحديث" : "إضافة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}