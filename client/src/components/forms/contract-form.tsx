import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertContractSchema, type InsertContract, type Property, type Tenant } from "@shared/schema";

interface ContractFormProps {
  onSuccess?: () => void;
  initialData?: InsertContract;
  contractId?: number;
}

const contractSchema = insertContractSchema.extend({
  monthlyRent: insertContractSchema.shape.monthlyRent.transform(val => val.toString()),
  securityDeposit: insertContractSchema.shape.securityDeposit.optional().transform(val => val?.toString() || ""),
});

export function ContractForm({ onSuccess, initialData, contractId }: ContractFormProps) {
  const { toast } = useToast();

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: tenants } = useQuery<Tenant[]>({
    queryKey: ["/api/tenants"],
  });

  const form = useForm<InsertContract>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      propertyId: initialData?.propertyId || 0,
      tenantId: initialData?.tenantId || 0,
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      monthlyRent: initialData?.monthlyRent || "0",
      securityDeposit: initialData?.securityDeposit || "",
      isActive: initialData?.isActive ?? true,
      notes: initialData?.notes || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContract) => {
      const url = contractId ? `/api/contracts/${contractId}` : "/api/contracts";
      const method = contractId ? "PUT" : "POST";
      
      const payload = {
        ...data,
        monthlyRent: parseFloat(data.monthlyRent.toString()),
        securityDeposit: data.securityDeposit ? parseFloat(data.securityDeposit.toString()) : undefined,
      };

      return apiRequest(method, url, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: contractId ? "تم تحديث العقد بنجاح" : "تم إضافة العقد بنجاح",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ العقد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContract) => {
    mutation.mutate(data);
  };

  const availableProperties = properties?.filter(p => p.isAvailable);

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
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العقار" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableProperties?.map((property) => (
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
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المستأجر *</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستأجر" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tenants?.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id.toString()}>
                        {tenant.name} - {tenant.phone}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ بداية العقد *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ نهاية العقد *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthlyRent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الإيجار الشهري (د.أ) *</FormLabel>
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
            name="securityDeposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>مبلغ التأمين (د.أ)</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات العقد</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="شروط وملاحظات إضافية للعقد..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">عقد نشط</FormLabel>
                <div className="text-sm text-muted-foreground">
                  هل العقد نشط حالياً؟
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 space-x-reverse">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {mutation.isPending ? "جاري الحفظ..." : contractId ? "تحديث العقد" : "إضافة العقد"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
