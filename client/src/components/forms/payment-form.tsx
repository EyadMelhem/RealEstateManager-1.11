import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPaymentSchema, type InsertPayment, type ContractWithDetails } from "@shared/schema";

interface PaymentFormProps {
  onSuccess?: () => void;
  initialData?: InsertPayment;
  paymentId?: number;
}

const paymentSchema = insertPaymentSchema.extend({
  amount: insertPaymentSchema.shape.amount.transform(val => val.toString()),
});

export function PaymentForm({ onSuccess, initialData, paymentId }: PaymentFormProps) {
  const { toast } = useToast();

  const { data: contracts } = useQuery<ContractWithDetails[]>({
    queryKey: ["/api/contracts/active"],
  });

  const form = useForm<InsertPayment>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      contractId: initialData?.contractId || 0,
      amount: initialData?.amount || "0",
      paymentDate: initialData?.paymentDate || new Date().toISOString().split('T')[0],
      dueDate: initialData?.dueDate || "",
      paymentMethod: initialData?.paymentMethod || "",
      referenceNumber: initialData?.referenceNumber || "",
      notes: initialData?.notes || "",
      isLate: initialData?.isLate ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertPayment) => {
      const url = paymentId ? `/api/payments/${paymentId}` : "/api/payments";
      const method = paymentId ? "PUT" : "POST";
      
      const payload = {
        ...data,
        amount: parseFloat(data.amount.toString()),
        isLate: new Date(data.paymentDate) > new Date(data.dueDate),
      };

      return apiRequest(method, url, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments/overdue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: paymentId ? "تم تحديث الدفعة بنجاح" : "تم تسجيل الدفعة بنجاح",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ الدفعة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPayment) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contractId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العقد *</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العقد" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contracts?.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id.toString()}>
                      {contract.property.title} - {contract.tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="2500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>طريقة الدفع</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">نقد</SelectItem>
                    <SelectItem value="check">شيك</SelectItem>
                    <SelectItem value="transfer">حوالة بنكية</SelectItem>
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
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ الدفع *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ الاستحقاق *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="referenceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم المرجع</FormLabel>
              <FormControl>
                <Input placeholder="رقم الشيك أو رقم الحوالة..." {...field} />
              </FormControl>
              <FormMessage />
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
                  placeholder="ملاحظات إضافية عن الدفعة..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 space-x-reverse">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {mutation.isPending ? "جاري الحفظ..." : paymentId ? "تحديث الدفعة" : "تسجيل الدفعة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
