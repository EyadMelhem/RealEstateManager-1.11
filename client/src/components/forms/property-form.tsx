import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPropertySchema, type InsertProperty } from "@shared/schema";

interface PropertyFormProps {
  onSuccess?: () => void;
  initialData?: InsertProperty;
  propertyId?: number;
}

const propertySchema = insertPropertySchema.extend({
  monthlyRent: insertPropertySchema.shape.monthlyRent.transform(val => val.toString()),
  area: insertPropertySchema.shape.area.optional().transform(val => val?.toString() || ""),
});

export function PropertyForm({ onSuccess, initialData, propertyId }: PropertyFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertProperty>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || "",
      address: initialData?.address || "",
      type: initialData?.type || "apartment",
      rooms: initialData?.rooms || undefined,
      area: initialData?.area || undefined,
      monthlyRent: initialData?.monthlyRent || "0",
      ownerName: initialData?.ownerName || "",
      ownerPhone: initialData?.ownerPhone || "",
      ownerEmail: initialData?.ownerEmail || "",
      description: initialData?.description || "",
      isAvailable: initialData?.isAvailable ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const url = propertyId ? `/api/properties/${propertyId}` : "/api/properties";
      const method = propertyId ? "PUT" : "POST";
      
      const payload = {
        ...data,
        monthlyRent: parseFloat(data.monthlyRent.toString()),
        area: data.area ? parseFloat(data.area.toString()) : undefined,
      };

      return apiRequest(method, url, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "تم الحفظ بنجاح",
        description: propertyId ? "تم تحديث العقار بنجاح" : "تم إضافة العقار بنجاح",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ العقار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProperty) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان العقار *</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: شقة 3 غرف - حي الزهراء" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع العقار *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العقار" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="apartment">شقة</SelectItem>
                    <SelectItem value="villa">فيلا</SelectItem>
                    <SelectItem value="commercial">محل تجاري</SelectItem>
                    <SelectItem value="office">مكتب</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان *</FormLabel>
              <FormControl>
                <Input placeholder="العنوان الكامل للعقار" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عدد الغرف</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="3"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المساحة (متر مربع)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="120.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المالك *</FormLabel>
                <FormControl>
                  <Input placeholder="محمد أحمد" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>هاتف المالك</FormLabel>
                <FormControl>
                  <Input placeholder="0599123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>بريد المالك الإلكتروني</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="owner@example.com" {...field} />
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
              <FormLabel>وصف العقار</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="تفاصيل إضافية عن العقار..."
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
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">متاح للإيجار</FormLabel>
                <div className="text-sm text-muted-foreground">
                  هل العقار متاح حالياً للإيجار؟
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
            {mutation.isPending ? "جاري الحفظ..." : propertyId ? "تحديث العقار" : "إضافة العقار"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
